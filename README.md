# Adobe Font Scraper
> Adobe Font Download Utility<br>
Downloads .ttf font files from any Adobe font link.

## How To Run
```sh
# install dependencies
$ npm install

# launch server
$ npm start
```

## How To Scrape All Fonts

1. Go to `src/fonts.js`.
2. Uncomment line 172 and run `node src/fonts.js`. This will create a JSON file which holds all the links.
3. Comment that line.
4. Uncomment the block of code below 172 and run `node src/fonts.js`.
5. In the event that the script breaks, just run it again, it will check against already downloaded files.
6. Profit.

## Dependencies / Environment

- NodeJS (v14.2.0)
- Express - server
- Puppeteer - scraping
- wawoff2 - decoding WOFF2 files
- opentype.js - getting font details (font family)


