const puppeteer = require("puppeteer");
const getUrls = require("get-urls");
const request = require("request");
const opentype = require("opentype.js");
// const opentype = require("opentype/src/opentype.js");
const woff2 = require("woff2");
const { zip } = require("zip-a-folder");
const fs = require("fs");

// global stuff...
let fontFamily;
let fontHrefCache = [];
let totalFontCountCache;

let fontBrowseUrl = ``;
const browserMode = ["default", "japanese"];

let fontMetaData = {};

// scrape outer page for all font links
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

  for (fontLink of fontHrefCache) {
    await scrapeFonts(fontLink);
  }

  // scrape fonts from font link here
};

const scrapeFonts = async (link) => {
  console.log("display once");
  linkArr = link.split("/");
  fontFamily = linkArr[linkArr.length - 1];

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
  writeFonts(formattedFontArr);
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

// Write fonts to file
const writeFonts = async (fonts) => {
  for (url of fonts) {
    await new Promise((resolve) =>
      request(url.source)
        .pipe(fs.createWriteStream("out.woff2"))
        .on("finish", () => {
          console.log("file written");
          resolve();
        })
    );
    let buffer = fs.readFileSync("out.woff2");
    let ttfBuffer = woff2.decode(buffer);
    fs.writeFileSync("out.ttf", ttfBuffer);
    let metadata = opentype.loadSync("out.ttf").names;
    console.log(metadata);
    if (!fs.existsSync("./temp/" + fontFamily)) {
      fs.mkdirSync("./temp/" + fontFamily);
    }
    fs.writeFileSync(
      "./temp/" + fontFamily + "/" + metadata.postScriptName.en + ".ttf",
      ttfBuffer
    );
  }
  await zip("./temp/" + fontFamily + "/", "./zips/" + fontFamily + ".zip");
};

// const openBrowser = async (username) => {
//   const browser = await puppeteer.launch({
//     headless: true,
//   });
//   const page = await browser.newPage();

//   //   await page.goto("https://fonts.adobe.com/fonts/rukou");
//   await page.goto("https://fonts.adobe.com/fonts/");

//   // Login form
//   await page.screenshot({ path: "1.png" });

//   //   await page.click("[type=submit]");

//   await page.goto(`https://fonts.adobe.com/fonts/rukou`);
//   await page.screenshot({ path: "2.png" });

//   // Execute code in the DOM
//   const data = await page.evaluate(() => {
//     // fonts are woff2 format
//     const fonts = window.Typekit.fonts.fonts;
//     const fontURLs = parseFonts(fonts);
//   });

//   await browser.close();

//   console.log(data);

//   return data;
// };

// scrapeFonts("https://fonts.adobe.com/fonts/source-han-sans-japanese");
scrapeForFontLinks("https://fonts.adobe.com/fonts?browse_mode=default");
