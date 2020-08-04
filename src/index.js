const scrapeFonts = require("./fonts.js");

const express = require("express");
const rateLimit = require("express-rate-limit");
const Redis = require("ioredis");
const helmet = require("helmet");
const path = require("path");

// setup redis

// express, middleware?
const PORT = process.env.PORT || 8080;
const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "..", "public")));

// Rate limiting: 30 requests / 1 min
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  })
);

// app.get("/", async (req, res) => {
//   let fontLink = "https://fonts.adobe.com/fonts/azo-sans";
//   res.send("Hello World!");
// });

app.post("/", async (req, res) => {
  let { fontUrl } = req.body;
  let linkArr = fontUrl.split("/");
  let fontFamily = linkArr[linkArr.length - 1];

  try {
    await scrapeFonts(fontUrl);
    res.download(
      path.join(__dirname, "zips", fontFamily + ".zip"),
      fontFamily + ".zip"
    );
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
      message:
        "Oops! Looks like something went wrong... Try getting the font again.",
    });
  }

  console.log("font downloaded");
});

console.log(`[i] Server listening on port: ${PORT}`);
app.listen(PORT);
