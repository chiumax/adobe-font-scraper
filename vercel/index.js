const puppeteer = require("puppeteer");
const getUrls = require("get-urls");
const request = require("request");
const opentype = require("opentype/src/opentype.js");
const woff2 = require("woff2");
const fs = require("fs");

//font.tables.name.en.fullName
//font.tables.name.en.fontFamily

// request("http://www.sitepoint.com").pipe(fs.createWriteStream("jspro.htm"));

const scrapeFonts = async (link) => {
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
  //await a foreach?
  fonts.forEach(async (url) => {
    console.log("before");
    await new Promise((resolve) =>
      request(url.source)
        .pipe(fs.createWriteStream("out"))
        .on("finish", () => {
          console.log("file written");
          resolve();
        })
    );
    console.log("after");
    // console.log(request(url.source));
    let buffer = fs.readFileSync("out");

    let metadata = opentype.parse(buffer);
    console.log(metadata.tables.name.en);
    console.log(url.family);
    // request(url.source).pipe(fs.createWriteStream(url.family + ".woff2"));
  });
  console.log("huh");
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

scrapeFonts("https://fonts.adobe.com/fonts/rukou");
