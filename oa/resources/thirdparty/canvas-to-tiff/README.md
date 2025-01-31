﻿canvas-to-tiff
==============

Converts HTML5 Canvas to a TIFF file (blob, data-uri, typed array).

The generated TIFF file is standard baseline compliant and supports RGB + alpha
channel as well as compression at various compression levels, and with
option for byte-order (big-endian or little-endian) as well as DPI settings.


Features
--------

- Fast
- Asynchronous and non-blocking
- Supports alpha channel
- Supports optional ZIP compression
- Convert directly to `ArrayBuffer`
- Convert directly to `Blob`
- Convert directly to Data-URI
- Support both big-endian (default) and little-endian byte order
- Can set arbitrary DPI for X and Y directions
- Can obtain a web-gl based canvas as well.
- Full [documentation](http://epistemex.github.io/canvas-to-tiff/docs/index.html)
- Works with all major browsers incl. IE
- No dependencies (ezlib deflate if compression is wanted. Included).


Install
-------

- Bower: `bower install canvas-to-tiff`
- Git using HTTPS: `git clone https://github.com/epistemex/canvas-to-tiff.git`
- Git using SSH: `git clone git@github.com:epistemex/canvas-to-tiff.git`
- Download [zip archive](https://github.com/epistemex/canvas-to-tiff/archive/master.zip) and extract.
- [canvastotiff.min.js](https://raw.githubusercontent.com/epistemex/canvas-to-tiff/master/canvastotiff.min.js)


Usage
-----

Include the script in header or before the script section in your HTML file.

To convert the canvas to a TIFF file as a Data-URI:
```javascript
CanvasToTIFF.toDataURL(canvas, function(uri) {
	// use here
});
```

To convert the canvas to a TIFF file as a blob (much faster than Data-URI
and more suitable for large files):
```javascript
CanvasToTIFF.toBlob(canvas, function(blob) {
	// use here
});
```

To convert it to an ArrayBuffer:
```javascript
CanvasToTIFF.toArrayBuffer(canvas, function(buffer) {
	// use here
});
```

For convenience, a direct Canvas to ObjectURL method is included:
```javascript
CanvasToTIFF.toObjectURL(canvas, function(url) {
	// use here
});
```

Also see `www/test.html` for sample use of compression and byte-order 
options.

**NOTE:** As with ordinary canvas Cross-Origin Resource Sharing (CORS) 
requirements must be fulfilled.

TIP: The *ezlib* library is included to support ZIP compression.
It can be left out to reduce code size (see `canvastotiff_no_deflate.min.js` [2.4 kb]).
CanvasToTIFF will adopt automatically and accordingly if not found, and 
produce a uncompressed TIFF file instead.


Issues
------

See the [issue tracker](https://github.com/epistemex/canvas-to-tiff/issues) for details.


Contributors
------------

See contributors [here](https://github.com/epistemex/canvas-to-tiff/graphs/contributors)


License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/). You may use this class in both commercial and non-commercial projects 
provided that full header (minified and developer versions) is included.


*&copy; Epistemex 2015-2016*
 
![Epistemex](http://i.imgur.com/wZSsyt8.png)
