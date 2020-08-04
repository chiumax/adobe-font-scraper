/* eslint-disable import/no-extraneous-dependencies */

const basePath = './node_modules/font-awesome/fonts';
const fs = require('fs');
const path = require('path');
const temp = require('temp').track();
const test = require('tap').test;
const woff2 = require('../src/woff2.js');

const magic = {
  // http://www.garykessler.net/library/file_sigs.html
  ttf: [0x00, 0x01, 0x00, 0x00],
  // "wOF2", see https://www.w3.org/TR/WOFF2/#woff20Header
  woff2: [0x77, 0x4f, 0x46, 0x32],
};

test('Decode WOFF2 data.', t => {
  temp.mkdir('node-woff2', (err, dirPath) => {
    if (err) throw err;
    const data = fs.readFileSync(
      path.join(basePath, 'fontawesome-webfont.woff2')
    );
    const file = path.join(dirPath, 'decoded.ttf');
    // eslint-disable-next-line no-shadow
    fs.writeFile(file, woff2.decode(data), err => {
      if (err) throw err;
      // eslint-disable-next-line no-shadow
      fs.open(file, 'r', (err, fd) => {
        if (err) throw err;
        const buffer = Buffer.alloc(4);
        // eslint-disable-next-line no-shadow
        fs.read(fd, buffer, 0, 4, 0, (err, bytesRead, buffer) => {
          // eslint-disable-next-line no-shadow
          fs.close(fd, err => {
            if (err) throw err;
            t.ok(buffer.equals(Buffer.from(magic.ttf)));
            t.end();
          });
        });
      });
    });
  });
});

test('Encode WOFF2 data.', t => {
  temp.mkdir('node-woff2', (err, dirPath) => {
    if (err) throw err;
    const data = fs.readFileSync(
      path.join(basePath, 'fontawesome-webfont.ttf')
    );
    const file = path.join(dirPath, 'encoded.woff2');
    // eslint-disable-next-line no-shadow
    fs.writeFile(file, woff2.encode(data), err => {
      if (err) throw err;
      // eslint-disable-next-line no-shadow
      fs.open(file, 'r', (err, fd) => {
        if (err) throw err;
        const buffer = Buffer.alloc(4);
        // eslint-disable-next-line no-shadow
        fs.read(fd, buffer, 0, 4, 0, (err, bytesRead, buffer) => {
          // eslint-disable-next-line no-shadow
          fs.close(fd, err => {
            if (err) throw err;
            t.ok(buffer.equals(Buffer.from(magic.woff2)));
            t.end();
          });
        });
      });
    });
  });
});
