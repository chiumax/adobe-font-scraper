# node-woff2

This is just a Node.js wrapper around Google's excellent
[woff2](https://github.com/google/woff2) utility.

## Usage

If you're using `npm`:

```
npm install --save-dev woff2
```

Alternatively you can clone this repo and run `npm install`. Be sure to get the
submodule dependency (use the `--recursive` flag when cloning). Note that you
can't install directly from this repo because `npm` doesn't understand
submodules.

## Special thanks

[nfroidure](https://github.com/nfroidure) wrote a wrapper that converts TTF to
WOFF2. I wanted something that could encode and decode though, so I recycled his
`bindings.gyp` file, and the file `./src/woff2_encode.cc` is more or less
straight from his repository. In respect for his work this wrapper is also under
the MIT license.

## API Reference

<a name="woff2"></a>

## woff2 : <code>object</code>

**Kind**: global namespace

* [woff2](#woff2) : <code>object</code>
  * [.decode](#woff2.decode) ⇒ <code>Buffer</code>
  * [.encode](#woff2.encode) ⇒ <code>Buffer</code>

<a name="woff2.decode"></a>

### woff2.decode ⇒ <code>Buffer</code>

Convert WOFF2 data to TTF.

**Kind**: static property of <code>[woff2](#woff2)</code>  
**Returns**: <code>Buffer</code> - Decoded TTF data.

| Param | Type                | Description               |
| ----- | ------------------- | ------------------------- |
| data  | <code>Buffer</code> | WOFF2 data to be decoded. |

**Example**

```js
var woff2 = require('woff2');
var input = fs.readFileSync('something.woff2');
var output = 'output.ttf';
fs.writeFileSync(output, woff2.decode(input));
```

<a name="woff2.encode"></a>

### woff2.encode ⇒ <code>Buffer</code>

Convert TTF data to WOFF2.

**Kind**: static property of <code>[woff2](#woff2)</code>  
**Returns**: <code>Buffer</code> - Encoded WOFF2 data.

| Param | Type                | Description                  |
| ----- | ------------------- | ---------------------------- |
| data  | <code>Buffer</code> | TTF font data to be encoded. |

**Example**

```js
var woff2 = require('woff2');
var input = fs.readFileSync('something.ttf');
var output = 'output.woff2';
fs.writeFileSync(output, woff2.encode(input));
```

## Hacking

In order to use the development env, install [Nix](https://nixos.org/nix/) and
run `nix-shell` in the root of this repo. You will be dropped into a shell with
the project's dependencies installed.
