const puppeteer = require("puppeteer");
const path = require("path");
const getUrls = require("get-urls");
const request = require("request");
const opentype = require("opentype.js");
// const opentype = require("opentype/src/opentype.js");
// const woff2 = require(path.join(__dirname, "woff2", "src", "woff2.js"));
const woff2 = require("wawoff2");
const { zip } = require("zip-a-folder");
const fs = require("fs");
const rimraf = require("rimraf");

// global stuff...
let fontFamily;
let fontHrefCache = [];

let fontBrowseUrl = ``;
const browserMode = ["default", "japanese"];

let fontMetaData = {};

// scrape outer page for all font links to json
const scrapeForFontLinks = async (link) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  for (browseMode of browserMode) {
    let hrefs;
    let fontPages;
    let unique;
    let pageNum = 1;
    console.log(browseMode);
    fontMetaData[browseMode] = {};

    fontBrowseUrl = `https://fonts.adobe.com/fonts?browse_mode=${browseMode}&page=${pageNum}&sort=alpha`;
    await page.goto(fontBrowseUrl);
    const fontCount = await page.evaluate(() => {
      return document.querySelector("div[data-id='family-count-message']")
        .innerText;
    });
    fontMetaData[browseMode].count = fontCount;
    console.log(fontMetaData);

    do {
      fontBrowseUrl = `https://fonts.adobe.com/fonts?browse_mode=${browseMode}&page=${pageNum}&sort=alpha`;
      await page.goto(fontBrowseUrl);
      // all links on page
      hrefs = await page.$$eval("a", (as) => as.map((a) => a.href));
      // all links to fonts
      fontPages = hrefs.filter((href) => {
        splitHref = href.split("/");
        return splitHref[splitHref.length - 2] == "fonts";
      });
      // all unique links to fonts
      unique = [...new Set(fontPages)];
      fontHrefCache = fontHrefCache.concat(unique);
      // console.log(fontHrefCache);
      console.log("scraped ", unique.length, "fonts");
      pageNum++;
    } while (unique.length > 0);
  }

  await browser.close();

  console.log(
    "There are a total of: " +
      fontMetaData.default.count +
      fontMetaData.japanese.count +
      "fonts"
  );
  console.log("We recorded a total of: " + fontHrefCache.length + "fonts");

  // write font links to json
  let temp = { fontArray: fontHrefCache };
  const jsonString = JSON.stringify(temp);
  fs.writeFileSync(path.join(__dirname, "fontHrefs.json"), jsonString);
};

const scrapeFonts = async (link) => {
  let fontWritten = false;
  linkArr = link.split("/");
  fontFamily = linkArr[linkArr.length - 1];

  if (fs.existsSync(path.join(__dirname, "zips", fontFamily + ".zip"))) {
    console.log(fontFamily, "exists! \nSkipping...");
    return true;
  }

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  // scrape fonts from font link here
  await page.goto(link);

  // Executing code in the DOM
  const fonts = await page.evaluate(() => {
    let temp = window.Typekit.fonts.fonts;
    let fonts = [];
    temp.forEach((font) => {
      fonts.push({ family: font.w.family, source: font.source });
    });

    return fonts;
  });
  await browser.close();

  const formattedFontArr = parseFonts(fonts);
  while (!fontWritten) {
    try {
      fontWritten = await writeFonts(formattedFontArr);
    } catch (err) {
      await writeFonts(formattedFontArr);
      fontWritten = true;
      console.log("uh-oh");
      console.log(err);
    }
  }
};

// Filters out adobe fonts and returns an array with links to WOFF2 fonts
const parseFonts = (fonts) => {
  const filteredFonts = fonts.filter((font) => {
    return !font.family.includes("adobe");
  });
  const fontURLs = filteredFonts.map((font) => {
    return { family: font.family, source: Array.from(getUrls(font.source))[0] };
  });
  return fontURLs;
};

// Write and convert WOFF2 to TTF fonts to file
const writeFonts = async (fonts) => {
  rimraf.sync(path.join(__dirname, "temp"));
  fs.mkdirSync(path.join(__dirname, "temp"));
  for (url of fonts) {
    await new Promise((resolve) =>
      request(url.source)
        .pipe(fs.createWriteStream(path.join(__dirname, "out.woff2")))
        .on("finish", () => {
          resolve();
        })
    );
    let buffer = fs.readFileSync(path.join(__dirname, "out.woff2"));
    let ttfBuffer = await woff2.decompress(buffer);
    // let ttfBuffer = woff2.decode(buffer);
    fs.writeFileSync(path.join(__dirname, "out.ttf"), ttfBuffer);
    // Opentype can ONLY parse TTFs, not WOFF2s
    let metadata = opentype.loadSync(path.join(__dirname, "out.ttf")).names;
    fs.writeFileSync(
      path.join(__dirname, "temp", metadata.postScriptName.en + ".ttf"),
      ttfBuffer
    );
  }
  await zip(
    path.join(__dirname, "temp"),
    path.join(__dirname, "zips", fontFamily + ".zip")
  );

  console.log(fontFamily, "scraped and zipped");
  return true;
};

// scrapeFonts("https://fonts.adobe.com/fonts/fira-sans");

// run one time only, scrapes all the font links from adobe. This will generate a fontHrefs.json

// await scrapeForFontLinks("https://fonts.adobe.com/fonts?browse_mode=default");
// const scrapedFontLinks = fs.readFileSync("fontHrefs.json");
// let fontArray = JSON.parse(scrapedFontLinks).fontArray;
// (async () => {
//   try {
//     for (href of fontArray) {
//       await scrapeFonts(href);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// })();

//////////////////////////

module.exports = scrapeFonts;
