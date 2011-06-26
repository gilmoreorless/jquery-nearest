/*!
 * jQuery Line plugin v0.1
 * Copyright (c) 2011 Gilmore Davidson
 * https://gilmoreorless.github.com/jquery-line/
 */
/**
 * Draw a line between any two arbitrary points, using a simple div element
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
;(function ($, undefined) {
	function checkPoint(point) {
		if (point.x === undefined && point.y === undefined) {
			return false;
		}
		point.x = parseFloat(point.x) || 0;
		point.y = parseFloat(point.y) || 0;
		return point;
	}
	
	var calcCache = {};
	function calcPosition(from, to, calc) {
		var cacheId = [from.x, from.y, to.x, to.y, calc.w, calc.h].join(',');
		if (calcCache[cacheId]) {
			return calcCache[cacheId];
		}
		// Calculate dimensions
		var xDiff = Math.abs(to.x - from.x),
			yDiff = Math.abs(to.y - from.y),
			hypot = (!xDiff || !yDiff) ? xDiff || yDiff : Math.sqrt(xDiff * xDiff + yDiff * yDiff),
			minX = Math.min(from.x, to.x),
			minY = Math.min(from.y, to.y),
			halfX = minX + xDiff / 2,
			halfY = minY + yDiff / 2,
			theta,
			pos = calcCache[cacheId] = {
				left: halfX - hypot / 2,
				top: halfY,
				width: hypot
			};
		
		// Account for width/height/margin offsets
		(calc.w > 1) && (pos.width -= (calc.w - 1));
		(calc.h > 1) && (pos.top -= calc.h / 2);
		pos.left -= calc.l;
		pos.top -= calc.t;
        pos.left = Math.round(pos.left);
        pos.top = Math.round(pos.top);
        pos.width = Math.round(pos.width);
		
		// Work out angle
		if (!xDiff) {
			theta = from.y < to.y ? 90 : 270;
		} else if (!yDiff) {
			theta = from.x < to.x ? 0 : 180;
		} else {
			// Angle calculation taken from Raphaël
			theta = (180 + Math.atan2(from.y - to.y, from.x - to.x) * 180 / Math.PI + 360) % 360;
		}
		pos.transform = 'rotate(' + theta + 'deg)';
		
		return pos;
	}
	
	$.line = function (from, to, options) {
		from = checkPoint(from);
		to = checkPoint(to);
		if (!from || !to) {
			return false;
		}
		
		// Create div element
		var opts = $.extend({}, $.line.defaults, options || {}),
			$elem = opts.elem ? $(opts.elem) : $('<div/>', {
				'class': opts.className
			}),
			css = {
				position: 'absolute',
				backgroundColor: opts.lineColor,
				width: 1,
				height: opts.lineWidth
			},
			pos;
		$elem.css(css);
		$elem[0].parentNode || $elem.appendTo('body');
		
		// Work out position, accounting for element dimensions
		pos = calcPosition(from, to, {
			w: $elem.outerWidth(),
			h: $elem.outerHeight(),
			l: parseFloat($elem.css('marginLeft')) || 0,
			t: parseFloat($elem.css('marginTop')) || 0
		});
		$elem.css(pos);
		
		return $elem;
	};
	
	$.line.defaults = {
		elem: '',
		className: 'jquery-line',
		lineWidth: 1,
		lineColor: '#000'
	}
})(jQuery);
/*
 * transform: A jQuery cssHooks adding cross-browser 2d transform capabilities to $.fn.css() and $.fn.animate()
 *
 * limitations:
 * - requires jQuery 1.4.3+
 * - Should you use the *translate* property, then your elements need to be absolutely positionned in a relatively positionned wrapper **or it will fail in IE678**.
 * - transformOrigin is not accessible
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery.transform.js
 *
 * Copyright 2011 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 *
 */
(function(a){function q(a){a=/\(([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(a);return[a[1],a[2],a[3],a[4],a[5],a[6]]}function p(a){return~a.indexOf("deg")?parseInt(a,10)*(Math.PI*2/360):~a.indexOf("grad")?parseInt(a,10)*(Math.PI/200):parseFloat(a)}function o(b){b=b.split(")");var c=[0,0],d=0,e=[1,1],f=[0,0],g=b.length-1,h=a.trim,i,j,k;while(g--)i=b[g].split("("),j=h(i[0]),k=i[1],j=="translateX"?c[0]+=parseInt(k,10):j=="translateY"?c[1]+=parseInt(k,10):j=="translate"?(k=k.split(","),c[0]+=parseInt(k[0],10),c[1]+=parseInt(k[1]||0,10)):j=="rotate"?d+=p(k):j=="scaleX"?e[0]*=k:j=="scaleY"?e[1]*=k:j=="scale"?(k=k.split(","),e[0]*=k[0],e[1]*=k.length>1?k[1]:k[0]):j=="skewX"?f[0]+=p(k):j=="skewY"?f[1]+=p(k):j=="skew"&&(k=k.split(","),f[0]+=p(k[0]),f[1]+=p(k[1]||"0"));return{translate:c,rotate:d,scale:e,skew:f}}function n(a){var b,c,d,e,f=a[0],g=a[1],h=a[2],i=a[3];f*i-g*h?(b=Math.sqrt(f*f+g*g),f/=b,g/=b,d=f*h+g*i,h-=f*d,i-=g*d,c=Math.sqrt(h*h+i*i),h/=c,i/=c,d/=c,f*i<g*h&&(f=-f,g=-g,d=-d,b=-b)):e=b=c=d=0;return{translate:[+a[4],+a[5]],rotate:Math.atan2(g,f),scale:[b,c],skew:[d,0]}}function m(b){b=b.split(")");var c=a.trim,d=b.length-1,e,f,g,h=1,i=0,j=0,k=1,l,m,n,o,q,r,s=0,t=0;while(d--){e=b[d].split("("),f=c(e[0]),g=e[1],l=m=n=o=0;switch(f){case"translateX":s+=parseInt(g,10);continue;case"translateY":t+=parseInt(g,10);continue;case"translate":g=g.split(","),s+=parseInt(g[0],10),t+=parseInt(g[1]||0,10);continue;case"rotate":g=p(g),l=Math.cos(g),m=Math.sin(g),n=-Math.sin(g),o=Math.cos(g);break;case"scaleX":l=g,o=1;break;case"scaleY":l=1,o=g;break;case"scale":g=g.split(","),l=g[0],o=g.length>1?g[1]:g[0];break;case"skewX":l=o=1,n=Math.tan(p(g));break;case"skewY":l=o=1,m=Math.tan(p(g));break;case"skew":l=o=1,g=g.split(","),n=Math.tan(p(g[0])),m=Math.tan(p(g[1]||0));break;case"matrix":g=g.split(","),l=+g[0],m=+g[1],n=+g[2],o=+g[3],s+=parseInt(g[4],10),t+=parseInt(g[5],10)}q=h*l+i*n,i=h*m+i*o,r=j*l+k*n,k=j*m+k*o,h=q,j=r}return[h,i,j,k,s,t]}var b=document.createElement("div"),c=b.style,d="transform",e="Transform",f=["O"+e,"ms"+e,"Webkit"+e,"Moz"+e,d],g=f.length,h,i,j,k,l=/Matrix([^)]*)/;while(g--)if(f[g]in c){a.support[d]=h=f[g];continue}h||(a.support.matrixFilter=i=c.filter===""),b=c=null,a.cssNumber[d]=!0,h&&h!=d?(a.cssProps[d]=h,h=="Moz"+e?j={get:function(b,c){return c?a.css(b,h).split("px").join(""):b.style[h]},set:function(a,b){a.style[h]=/matrix[^)p]*\)/.test(b)?b.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/,"matrix$1$2px,$3px"):b}}:/^1\.[0-5](?:\.|$)/.test(a.fn.jquery)&&(j={get:function(b,c){return c?a.css(b,h.replace(/^ms/,"Ms")):b.style[h]}})):i&&(j={get:function(a,b){var c=b&&a.currentStyle?a.currentStyle:a.style,d;c&&l.test(c.filter)?(d=RegExp.$1.split(","),d=[d[0].split("=")[1],d[2].split("=")[1],d[1].split("=")[1],d[3].split("=")[1]]):d=[1,0,0,1],d[4]=c?c.left:0,d[5]=c?c.top:0;return"matrix("+d+")"},set:function(b,c,d){var e=b.style,f,g,h,i;d||(e.zoom=1),c=m(c);if(!d||d.M){g=["Matrix(M11="+c[0],"M12="+c[2],"M21="+c[1],"M22="+c[3],"SizingMethod='auto expand'"].join(),i=(f=b.currentStyle)&&f.filter||e.filter||"",e.filter=l.test(i)?i.replace(l,g):i+" progid:DXImageTransform.Microsoft."+g+")";if(h=a.transform.centerOrigin)e[h=="margin"?"marginLeft":"left"]=-(b.offsetWidth/2)+b.clientWidth/2+"px",e[h=="margin"?"marginTop":"top"]=-(b.offsetHeight/2)+b.clientHeight/2+"px"}if(!d||d.T)e.left=c[4]+"px",e.top=c[5]+"px"}}),j&&(a.cssHooks[d]=j),k=j&&j.get||a.css,a.fx.step.transform=function(a){var b=a.elem,c=a.start,d=a.end,e,f=a.pos,g,l,p,r,s,t=!1,u=!1,v;l=p=r=s="";if(!c||typeof c=="string"){c||(c=k(b,h)),i&&(b.style.zoom=1),e=d.split(c),e.length==2&&(d=e.join(""),a.origin=c,c="none"),a.start=c=c=="none"?{translate:[0,0],rotate:0,scale:[1,1],skew:[0,0]}:n(q(c)),a.end=d=~d.indexOf("matrix")?n(m(d)):o(d);for(v in c)(v=="rotate"?c[v]==d[v]:c[v][0]==d[v][0]&&c[v][1]==d[v][1])&&delete c[v]}c.translate&&(l=" translate("+(c.translate[0]+(d.translate[0]-c.translate[0])*f+.5|0)+"px,"+(c.translate[1]+(d.translate[1]-c.translate[1])*f+.5|0)+"px"+")",t=!0),c.rotate!=undefined&&(p=" rotate("+(c.rotate+(d.rotate-c.rotate)*f)+"rad)",u=!0),c.scale&&(r=" scale("+(c.scale[0]+(d.scale[0]-c.scale[0])*f)+","+(c.scale[1]+(d.scale[1]-c.scale[1])*f)+")",u=!0),c.skew&&(s=" skew("+(c.skew[0]+(d.skew[0]-c.skew[0])*f)+"rad,"+(c.skew[1]+(d.skew[1]-c.skew[1])*f)+"rad"+")",u=!0),g=a.origin?a.origin+l+s+r+p:l+p+r+s,j&&j.set?j.set(b,g,{M:u,T:t}):b.style[h]=g},a.transform={centerOrigin:"margin"}})(jQuery)