/**
 * Package: svgedit.sanitize
 *
 * Licensed under the Apache License, Version 2
 *
 * Copyright(c) 2010 Alexis Deveria
 * Copyright(c) 2010 Jeff Schiller
 */

// Dependencies:
// 1) browser.js
// 2) svgutils.js

var svgedit = svgedit || {};

(function() {

if (!svgedit.sanitize) {
	svgedit.sanitize = {};
}

// Namespace constants
var svgns = "http://www.w3.org/2000/svg",
	xlinkns = "http://www.w3.org/1999/xlink",
	xmlns = "http://www.w3.org/XML/1998/namespace",
	xmlnsns = "http://www.w3.org/2000/xmlns/", // see http://www.w3.org/TR/REC-xml-names/#xmlReserved
	se_ns = "http://svg-edit.googlecode.com",
	htmlns = "http://www.w3.org/1999/xhtml",
	mathns = "http://www.w3.org/1998/Math/MathML";

// map namespace URIs to prefixes
var nsMap_ = {};
nsMap_[xlinkns] = 'xlink';
nsMap_[xmlns] = 'xml';
nsMap_[xmlnsns] = 'xmlns';
nsMap_[se_ns] = 'se';
nsMap_[htmlns] = 'xhtml';
nsMap_[mathns] = 'mathml';

// map prefixes to namespace URIs
var nsRevMap_ = {};
$.each(nsMap_, function(key,value){
	nsRevMap_[value] = key;
});

// this defines which elements and attributes that we support
var svgWhiteList_ = {
	// SVG Elements
	"a": ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "xlink:href", "xlink:title"],
	"circle": ["class", "clip-path", "clip-rule", "cx", "cy", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "r", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
	"clipPath": ["class", "clipPathUnits", "id"],
	"defs": [],
        "style" : ["type"],
	"desc": [],
	"ellipse": ["class", "clip-path", "clip-rule", "cx", "cy", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "requiredFeatures", "rx", "ry", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
	"feGaussianBlur": ["class", "color-interpolation-filters", "id", "requiredFeatures", "stdDeviation"],
	"filter": ["class", "color-interpolation-filters", "filterRes", "filterUnits", "height", "id", "primitiveUnits", "requiredFeatures", "width", "x", "xlink:href", "y"],
	"foreignObject": ["class", "font-size", "height", "id", "opacity", "requiredFeatures", "style", "transform", "width", "x", "y"],
	"g": ["class", "clip-path", "clip-rule", "id", "display", "fill", "fill-opacity", "fill-rule", "filter", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "font-family", "font-size", "font-style", "font-weight", "text-anchor", "data-locked"],
	"image": ["class", "clip-path", "clip-rule", "filter", "height", "id", "mask", "opacity", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:href", "xlink:title", "y"],
	"line": ["shape-rendering", "class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "id", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "x1", "x2", "y1", "y2"],
	"linearGradient": ["class", "id", "gradientTransform", "gradientUnits", "requiredFeatures", "spreadMethod", "systemLanguage", "x1", "x2", "xlink:href", "y1", "y2"],
	"marker": ["id", "class", "markerHeight", "markerUnits", "markerWidth", "orient", "preserveAspectRatio", "refX", "refY", "systemLanguage", "viewBox"],
	"mask": ["class", "height", "id", "maskContentUnits", "maskUnits", "width", "x", "y"],
	"metadata": ["class", "id"],
	"path": ["class", "clip-path", "clip-rule", "d", "fill", "fill-opacity", "fill-rule", "filter", "id", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
	"pattern": ["class", "height", "id", "patternContentUnits", "patternTransform", "patternUnits", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xlink:href", "y"],
	"polygon": ["class", "clip-path", "clip-rule", "id", "fill", "fill-opacity", "fill-rule", "filter", "id", "class", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "points", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
	"polyline": ["class", "clip-path", "clip-rule", "id", "fill", "fill-opacity", "fill-rule", "filter", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "points", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
	"radialGradient": ["class", "cx", "cy", "fx", "fy", "gradientTransform", "gradientUnits", "id", "r", "requiredFeatures", "spreadMethod", "systemLanguage", "xlink:href"],
	"rect": ["shape-rendering", "class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "height", "id", "mask", "opacity", "requiredFeatures", "rx", "ry", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "width", "x", "y"],
	"stop": ["class", "id", "offset", "requiredFeatures", "stop-color", "stop-opacity", "style", "systemLanguage"],
	"svg": ["class", "clip-path", "clip-rule", "filter", "id", "height", "mask", "preserveAspectRatio", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xmlns", "xmlns:se", "xmlns:xlink", "y"],
	"switch": ["class", "id", "requiredFeatures", "systemLanguage"],
	"symbol": ["class", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "opacity", "preserveAspectRatio", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "viewBox"],
	"text": ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "text-anchor", "transform", "x", "xml:space", "y"],
	"textPath": ["class", "id", "method", "requiredFeatures", "spacing", "startOffset", "style", "systemLanguage", "transform", "xlink:href"],
	"title": [],
	"tspan": ["class", "clip-path", "clip-rule", "dx", "dy", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "mask", "opacity", "requiredFeatures", "rotate", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "text-anchor", "textLength", "transform", "x", "xml:space", "y"],
	"use": ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "height", "id", "mask", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "transform", "width", "x", "xlink:href", "y"],
	
	// MathML Elements
	"annotation": ["encoding"],
	"annotation-xml": ["encoding"],
	"maction": ["actiontype", "other", "selection"],
	"math": ["class", "id", "display", "xmlns"],
	"menclose": ["notation"],
	"merror": [],
	"mfrac": ["linethickness"],
	"mi": ["mathvariant"],
	"mmultiscripts": [],
	"mn": [],
	"mo": ["fence", "lspace", "maxsize", "minsize", "rspace", "stretchy"],
	"mover": [],
	"mpadded": ["lspace", "width", "height", "depth", "voffset"],
	"mphantom": [],
	"mprescripts": [],
	"mroot": [],
	"mrow": ["xlink:href", "xlink:type", "xmlns:xlink"],
	"mspace": ["depth", "height", "width"],
	"msqrt": [],
	"mstyle": ["displaystyle", "mathbackground", "mathcolor", "mathvariant", "scriptlevel"],
	"msub": [],
	"msubsup": [],
	"msup": [],
	"mtable": ["align", "columnalign", "columnlines", "columnspacing", "displaystyle", "equalcolumns", "equalrows", "frame", "rowalign", "rowlines", "rowspacing", "width"],
	"mtd": ["columnalign", "columnspan", "rowalign", "rowspan"],
	"mtext": [],
	"mtr": ["columnalign", "rowalign"],
	"munder": [],
	"munderover": [],
	"none": [],
	"semantics": []
	,"table": []
	,"tr": []
	,"td": []
};

// Produce a Namespace-aware version of svgWhitelist
var svgWhiteListNS_ = {};
$.each(svgWhiteList_, function(elt,atts){
	var attNS = {};
	$.each(atts, function(i, att){
		if (att.indexOf(':') >= 0) {
			var v = att.split(':');
			attNS[v[1]] = nsRevMap_[v[0]];
		} else {
			attNS[att] = att == 'xmlns' ? xmlnsns : null;
		}
	});
	svgWhiteListNS_[elt] = attNS;
});

// temporarily expose these
svgedit.sanitize.getNSMap = function() { return nsMap_; }

// Function: svgedit.sanitize.sanitizeSvg
// Sanitizes the input node and its children
// It only keeps what is allowed from our whitelist defined above
//
// Parameters:
// node - The DOM element to be checked, will also check its children
//added by job 20190314 for checking "便簽"
//svgedit.sanitize.sanitizeSvg = function(node) {
svgedit.sanitize.sanitizeSvg = function(node, docType) {
	// we only care about element nodes
	// automatically return for all comment, etc nodes
	// for text, we do a whitespace trim
	if (node.nodeType == 3) {
		//added by job 20190314 for checking "便簽"，20190321 add 令 lien.chiu
        if ((docType == "便簽" ||docType == "A4空白簽" || docType == "簡簽" || docType == "令" || docType == "便箋" || docType == "受文者令" ||docType == "代辦處令" || docType == "會銜令" || docType == "會銜受文者令") && node.parentNode.id == "KDRichTextBlock_1_context") {
            //no need to trim text
            console.log("nodeValue:" + node.nodeValue + ".need to rtrim only.");
            node.nodeValue = node.nodeValue.replace(/\s+$/, '');
            console.log("after: nodeValue:" + node.nodeValue + ".");

        } else {
            // User 要求令所有行都要留空白 - by yi-chi chiu
            if (docType == "令" || docType == "受文者令" ||docType == "代辦處令"|| docType == "會銜令" || docType == "會銜受文者令")
                node.nodeValue = node.nodeValue.replace(/\s+$/, '');
            else
                node.nodeValue = node.nodeValue.replace(/^\s+|\s+$/g, "");
        }
		// Remove empty text nodes
		if(!node.nodeValue.length) node.parentNode.removeChild(node);
	}
	if (node.nodeType != 1) return;
	var doc = node.ownerDocument;
	var parent = node.parentNode;
	// can parent ever be null here?  I think the root node's parent is the document...
	if (!doc || !parent) return;
	
	var allowedAttrs = svgWhiteList_[node.nodeName];
	var allowedAttrsNS = svgWhiteListNS_[node.nodeName];

	// if this element is allowed
	if (allowedAttrs != undefined) {

		var se_attrs = [];
	
		var i = node.attributes.length;
		while (i--) {
			// if the attribute is not in our whitelist, then remove it
			// could use jQuery's inArray(), but I don't know if that's any better
			var attr = node.attributes.item(i);
			var attrName = attr.nodeName;
			var attrLocalName = attr.localName;
			var attrNsURI = attr.namespaceURI;
			// Check that an attribute with the correct localName in the correct namespace is on 
			// our whitelist or is a namespace declaration for one of our allowed namespaces
			if (!(allowedAttrsNS.hasOwnProperty(attrLocalName) && attrNsURI == allowedAttrsNS[attrLocalName] && attrNsURI != xmlnsns) &&
				!(attrNsURI == xmlnsns && nsMap_[attr.value]) )
			{
				// TODO(codedread): Programmatically add the se: attributes to the NS-aware whitelist.
				// Bypassing the whitelist to allow se: prefixes. Is there
				// a more appropriate way to do this?
				if(attrName.indexOf('se:') == 0) {
					se_attrs.push([attrName, attr.value]);
				} 
				node.removeAttributeNS(attrNsURI, attrLocalName);
			}
			
			// Add spaces before negative signs where necessary
			if(svgedit.browser.isGecko()) {
				switch ( attrName ) {
				case "transform":
				case "gradientTransform":
				case "patternTransform":
					var val = attr.value.replace(/(\d)-/g, "$1 -");
					node.setAttribute(attrName, val);
				}
			}
			
			// for the style attribute, rewrite it in terms of XML presentational attributes
			if (attrName == "style") {
				var props = attr.value.split(";"),
					p = props.length;
				while(p--) {
					var nv = props[p].split(":");
					// now check that this attribute is supported
					if (allowedAttrs.indexOf(nv[0]) >= 0) {
						node.setAttribute(nv[0],nv[1]);
					}
				}
				node.removeAttribute('style');
			}
		}
		
		$.each(se_attrs, function(i, attr) {
			node.setAttributeNS(se_ns, attr[0], attr[1]);
		});
		
		// for some elements that have a xlink:href, ensure the URI refers to a local element
		// (but not for links)
		var href = svgedit.utilities.getHref(node);
		if(href && 
		   ["filter", "linearGradient", "pattern",
		   "radialGradient", "textPath", "use"].indexOf(node.nodeName) >= 0)
		{
			// TODO: we simply check if the first character is a #, is this bullet-proof?
			if (href[0] != "#") {
				// remove the attribute (but keep the element)
				svgedit.utilities.setHref(node, "");
				node.removeAttributeNS(xlinkns, "href");
			}
		}
		
		// Safari crashes on a <use> without a xlink:href, so we just remove the node here
		if (node.nodeName == "use" && !svgedit.utilities.getHref(node)) {
			parent.removeChild(node);
			return;
		}
		// if the element has attributes pointing to a non-local reference, 
		// need to remove the attribute
		$.each(["clip-path", "fill", "filter", "marker-end", "marker-mid", "marker-start", "mask", "stroke"],function(i,attr) {
			var val = node.getAttribute(attr);
			if (val) {
				val = svgedit.utilities.getUrlFromAttr(val);
				// simply check for first character being a '#'
				if (val && val[0] !== "#") {
					node.setAttribute(attr, "");
					node.removeAttribute(attr);
				}
			}
		});
		
		// recurse to children
		i = node.childNodes.length;
				//added by job 20190314 for checking "便簽"
		while (i--) { svgedit.sanitize.sanitizeSvg(node.childNodes.item(i), docType); }
		//while (i--) { svgedit.sanitize.sanitizeSvg(node.childNodes.item(i)); }
	}
	// else, remove this element
	else {
		// remove all children from this node and insert them before this node
		// FIXME: in the case of animation elements this will hardly ever be correct
		var children = [];
		while (node.hasChildNodes()) {
			children.push(parent.insertBefore(node.firstChild, node));
		}

		// remove this node from the document altogether
		parent.removeChild(node);

		// call sanitizeSvg on each of those children
		var i = children.length;
				//added by job 20190314 for checking "便簽"
		while (i--) { svgedit.sanitize.sanitizeSvg(children[i], docType); }
		//while (i--) { svgedit.sanitize.sanitizeSvg(children[i]); }

	}
};

})();

