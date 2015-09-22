var SVGCanvas = function (id) {
  this.svgElement = document.getElementById(id);
};

SVGCanvas.prototype.circle = function (options) {
  var x = options.x;
  var y = options.y;
  var C= document.createElementNS("http://www.w3.org/2000/svg","circle");
  C.setAttributeNS(null,"r", 5);
  C.setAttributeNS(null,"cx", x);
  C.setAttributeNS(null,"cy", y);
  C.setAttributeNS(null,"stroke", "red");
  this.svgElement.appendChild(C);
};

SVGCanvas.prototype.line = function (options) {
  var x1 = options.x1;
  var y1 = options.y1;
  var x2 = options.x2;
  var y2 = options.y2;
  var strokeWidth = options.stroke_width || 1;
  var C = document.createElementNS("http://www.w3.org/2000/svg","line");
  C.setAttributeNS(null,"x1", x1);
  C.setAttributeNS(null,"y1", y1);
  C.setAttributeNS(null,"x2", x2);
  C.setAttributeNS(null,"y2", y2);
  C.setAttributeNS(null,"stroke", "black");
  C.setAttributeNS(null,"stroke-width", strokeWidth);
  this.svgElement.appendChild(C);
};

SVGCanvas.prototype.path = function (options) {
  var points = options.points || [];
  var C = document.createElementNS("http://www.w3.org/2000/svg","path");
  var initialPoint = points[0];
  var pathString = "M " + initialPoint.x + " " + initialPoint.y + " L ";
  for (var i = 1; i < points.length; i++) {
    pathString += points[i].x + " " + points[i].y + " ";
  }
  C.setAttributeNS(null,"stroke", "red");
  C.setAttributeNS(null, "d", pathString);
  C.setAttributeNS(null, "fill", "none");
  this.svgElement.appendChild(C);
};

