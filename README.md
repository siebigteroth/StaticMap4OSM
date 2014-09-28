StaticMap4OSM
=============

StaticMap4OSM is a javascript library, which creates a static canvas image based on an OpenStreetMap like layer.

####how to:
```
var smap=new StaticMap(); //create new StaticMap object with default parameters
var canvas=smap.getCanvas(40.713698,-74.005469,12); //first two parameters are the center of the map; last one is the zoom level
document.body.appendChild(canvas); //add canvas to DOM
```

####default parameters:
```
var smap=new StaticMap4OSM({
   size:256, //tile size (width and height)
   url:'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', //layer url
   maxZoom:18 //layer's max zoom level
});
```

####license:
Licensed under The MIT License (MIT).
```
 StaticMap4OSM

 Copyright (c) 2014 Tim Siebigteroth

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
```
