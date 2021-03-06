/*
* Licensed under The MIT License (MIT).
*
* StaticMap4OSM
*
* Copyright (c) 2014 Tim Siebigteroth
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

function StaticMap4OSM(options) {
	//set options
	this.options={
		size:256,
		url:'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
		maxZoom:18
	};
	if(options!=undefined) {
		if(options.size!=undefined)
			this.options.size=options.size;
		if(options.url!=undefined)
			this.options.url=options.url;
		if(options.maxZoom!=undefined)
			this.options.maxZoom=options.maxZoom;
	}
	
	//return coordinates by x, y and zoom parameter of a tile
	this.getCoordinates=function(x,y,z) {
		if(x>Math.pow(2,z)-1) {
			x=0;
			y++;
		}
		else if(x<0) {
			x=Math.floor(Math.pow(2,z)-1);
			y--;
		}
		if(y>Math.pow(2,z)) {
			y=0;
			x++;
		}
		else if(y<0) {
			y=Math.floor(Math.pow(2,z));
			x--;
		}
		if(x>Math.pow(2,z)-1 || x<0)
			return getCoordinates(x,y,z);
		else {
			return {
				x: x,
				y: y
			};
		}
	}
	
	//return tiles url
	this.getTile=function(zoom,x,y) {
		if(zoom>this.options.maxZoom)
			zoom=this.options.maxZoom;
		else if(zoom<0)
			zoom=0;
		var co=this.getCoordinates(x,y,zoom);
		return this.options.url.replace('{x}',co.x).replace('{y}',co.y).replace('{z}',zoom);
	}
	
	//latitude to radians
	this.toRadians=function(n) {
		return n*Math.PI/180;
	}
	
	//return a canvas containing a static map image
	this.getCanvas=function(lat,lng,zoom) {	
		var size=this.options.size;
		var hsize=Math.floor(size/2);
		
		//init canvas
		var c=document.createElement('canvas');
		c.width=size;
		c.height=size;
		var ctx=c.getContext('2d');

		//image vars for top, bottom, left, right, top-left, bottom-left, top-right, bottom-right
		var t,b,l,r,tl,bl,tr,br;
		
		//get position according to tile url
		var x = (lng+180)/360*(1<<zoom);
		var y = (1-Math.log(Math.tan(this.toRadians(lat))+1/Math.cos(this.toRadians(lat)))/Math.PI)/2*(1<<zoom);
		
		//get main tiles url
		var xUrl = Math.floor(x);
		var yUrl = Math.floor(y);
		
		//get position on tile
		var xLeft = Math.floor(Math.floor(((x * 100) % 100))*size/100);
		var yTop = Math.floor(Math.floor(((y * 100) % 100))*size/100);
		var xRight = size-xLeft;
		var yBottom = size-yTop;
		
		//booleans to define, which additional tiles are needed
		var top = yTop<hsize ? true : false;
		var bottom = yTop>hsize ? true : false;
		var left = xLeft<hsize ? true : false;
		var right = xLeft>hsize ? true : false;
		
		//add only top
		if(top==true && bottom==false && left==false && right==false) {		
			t = new Image;
			t.onload = function(){
				ctx.drawImage(t,0,0,size,size,0,hsize-yTop-size,size,size);
			};
			t.src = this.getTile(zoom,xUrl,yUrl-1);
			
			b = new Image;
			b.onload = function(){
				ctx.drawImage(b,0,0,size,size,0,hsize-yTop,size,size);
			};
			b.src = this.getTile(zoom,xUrl,yUrl);
		}
		
		//add only bottom
		else if(bottom==true && top==false && left==false && right==false) {		
			t = new Image;
			t.onload = function(){
				ctx.drawImage(t,0,0,size,size,0,hsize-yTop,size,size);
			};
			t.src = this.getTile(zoom,xUrl,yUrl);
			
			b = new Image;
			b.onload = function(){
				ctx.drawImage(b,0,0,size,size,0,hsize+yBottom,size,size);
			};
			b.src = this.getTile(zoom,xUrl,yUrl+1);
		}
		
		//add only left
		else if(left==true && top==false && bottom==false && right==false) {
			l = new Image;
			l.onload = function(){
				ctx.drawImage(l,0,0,size,size,hsize-xLeft-size,0,size,size);
			};
			l.src = this.getTile(zoom,xUrl-1,yUrl);
			
			r = new Image;
			r.onload = function(){
				ctx.drawImage(r,0,0,size,size,hsize-xLeft,0,size,size);
			};
			r.src = this.getTile(zoom,xUrl,yUrl);
		}
		
		//add only right
		else if(right==true && top==false && bottom==false && left==false) {
			l = new Image;
			l.onload = function(){
				ctx.drawImage(l,0,0,size,size,hsize-xLeft,0,size,size);
			};
			l.src = this.getTile(zoom,xUrl,yUrl);
			
			r = new Image;
			r.onload = function(){
				ctx.drawImage(r,0,0,size,size,hsize+xRight,0,size,size);
			};
			r.src = this.getTile(zoom,xUrl+1,yUrl);
		}
		
		//add top left corner
		else if(top==true && left==true && bottom==false && right==false) {	
			tl = new Image;
			tl.onload = function(){
				ctx.drawImage(tl,0,0,size,size,hsize-xLeft-size,hsize-yTop-size,size,size);
			};
			tl.src = this.getTile(zoom,xUrl-1,yUrl-1);
			
			tr = new Image;
			tr.onload = function(){
				ctx.drawImage(tr,0,0,size,size,hsize-xLeft,hsize-yTop-size,size,size);
			};
			tr.src = this.getTile(zoom,xUrl,yUrl-1);
			
			bl = new Image;
			bl.onload = function(){
				ctx.drawImage(bl,0,0,size,size,hsize-xLeft-size,hsize-yTop,size,size);
			};
			bl.src = this.getTile(zoom,xUrl-1,yUrl);
			
			br = new Image;
			br.onload = function(){
				ctx.drawImage(br,0,0,size,size,hsize-xLeft,hsize-yTop,size,size);
			};
			br.src = this.getTile(zoom,xUrl,yUrl);
		}
		
		//add top right corner
		else if(top==true && right==true && bottom==false && left==false) {	
			tl = new Image;
			tl.onload = function(){
				ctx.drawImage(tl,0,0,size,size,hsize-xLeft,hsize-yBottom,size,size);
			};
			tl.src = this.getTile(zoom,xUrl,yUrl-1);
			
			tr = new Image;
			tr.onload = function(){
				ctx.drawImage(tr,0,0,size,size,hsize+xRight,hsize-yBottom,size,size);
			};
			tr.src = this.getTile(zoom,xUrl+1,yUrl-1);
			
			bl = new Image;
			bl.onload = function(){
				ctx.drawImage(bl,0,0,size,size,hsize-xLeft,hsize+size-yBottom,size,size);
			};
			bl.src = this.getTile(zoom,xUrl,yUrl);
			
			br = new Image;
			br.onload = function(){
				ctx.drawImage(br,0,0,size,size,hsize+xRight,hsize+size-yBottom,size,size);
			};
			br.src = this.getTile(zoom,xUrl+1,yUrl);
		}
		
		//add bottom left corner
		else if(bottom==true && left==true && top==false && right==false) {	
			tl = new Image;
			tl.onload = function(){
				ctx.drawImage(tl,0,0,size,size,hsize-xLeft-size,hsize-yTop,size,size);
			};
			tl.src = this.getTile(zoom,xUrl-1,yUrl);
			
			tr = new Image;
			tr.onload = function(){
				ctx.drawImage(tr,0,0,size,size,hsize-xLeft,hsize-yTop,size,size);
			};
			tr.src = this.getTile(zoom,xUrl,yUrl);
			
			bl = new Image;
			bl.onload = function(){
				ctx.drawImage(bl,0,0,size,size,hsize-xLeft-size,hsize+yBottom,size,size);
			};
			bl.src = this.getTile(zoom,xUrl-1,yUrl+1);
			
			br = new Image;
			br.onload = function(){
				ctx.drawImage(br,0,0,size,size,hsize-xLeft,hsize+yBottom,size,size);
			};
			br.src = this.getTile(zoom,xUrl,yUrl+1);
		}
		
		//add bottom right corner
		else if(bottom==true && right==true && top==false && left==false) {
			tl = new Image;
			tl.onload = function(){
				ctx.drawImage(tl,0,0,size,size,hsize-size+xRight,hsize-yTop,size,size);
			};
			tl.src = this.getTile(zoom,xUrl,yUrl);
			
			tr = new Image;
			tr.onload = function(){
				ctx.drawImage(tr,0,0,size,size,hsize+xRight,hsize-yTop,size,size);
			};
			tr.src = this.getTile(zoom,xUrl+1,yUrl);
			
			bl = new Image;
			bl.onload = function(){
				ctx.drawImage(bl,0,0,size,size,hsize-size+xRight,hsize+yBottom,size,size);
			};
			bl.src = this.getTile(zoom,xUrl,yUrl+1);
			
			br = new Image;
			br.onload = function(){
				ctx.drawImage(br,0,0,size,size,hsize+xRight,hsize+yBottom,size,size);
			};
			br.src = this.getTile(zoom,xUrl+1,yUrl+1);
		}
		
		//center; no additional tiles needed
		else {
			var ct = new Image;
			ct.onload = function(){
				ctx.drawImage(ct,0,0,size,size,0,0,size,size);
			};
			ct.src = this.getTile(zoom,xUrl,yUrl);
		}
		
		//return canvas
		return c;
	}
	
}