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

const scrapeFonts = async (link) => {
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
  // console.log("final");
  // console.log(formattedFontArr);
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
    if (!fs.existsSync(fontFamily)) {
      fs.mkdirSync(fontFamily);
    }
    fs.writeFileSync(
      fontFamily + "/" + metadata.postScriptName.en + ".ttf",
      ttfBuffer
    );
  }
  await zip("./" + fontFamily + "/", fontFamily + ".zip");
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

scrapeFonts("https://fonts.adobe.com/fonts/source-han-sans-japanese");
