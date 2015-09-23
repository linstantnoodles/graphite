(function (window) {

  var canvas = null;

  /**
   * An axis is a line on a coordinate plane. Its purpose is to server as a visual reference for the position of points on the plane.
   */

  var Axis = function (config) {
    // x, y position of the axis on the canvas
    this.x = config.x;
    this.y = config.y;
    // Axis width
    this.width = config.width;
    // Min and max values on the axis
    this.range = config.range;
  };
  
  Axis.prototype.getWidth = function () {
    return this.width;
  };

  Axis.prototype.getMin = function (values) {
    return this.range.min;
  };

  Axis.prototype.getMax = function (values) {
    return this.range.max;
  };

  Axis.prototype.getIntervalWidth = function () {
    return this.width / (this.getMax() - this.getMin());
  };

  Axis.prototype.getDistanceFromOrigin = function (value) {
    return (value - this.getMin()) * this.getIntervalWidth();
  };

  var XAxis = function (config) {
    Axis.call(this, config);
  };

  XAxis.prototype = Object.create(Axis.prototype);

  XAxis.prototype.getValuePosition = function (value) {
    var xPos = this.x + this.getDistanceFromOrigin(value);
    return {
      x: xPos,
      y: this.y
    };
  };

  XAxis.prototype.draw = function (values) {
    canvas.line({
      x1: this.x, 
      y1: this.y,
      x2: this.x + this.getWidth(),
      y2: this.y
    });
  };

  var YAxis = function (config) {
    Axis.call(this, config);
  };

  YAxis.prototype = Object.create(Axis.prototype);
  
  YAxis.prototype.getValuePosition = function (value) {
    var yPos = (this.y + this.getWidth()) - this.getDistanceFromOrigin(value);
    return {
      x: this.x, 
      y: yPos
    };
  };

  YAxis.prototype.draw = function (values) {
    canvas.line({
      x1: this.x,
      y1: this.y,
      x2: this.x, 
      y2: this.y + this.getWidth()
    });
  };

  /**
   * A two dimensional coordinate plane with a horizontal axis
   */

  var PolarXCoordinate = function (config) {
    this.axis = new XAxis(config);
  };

  PolarXCoordinate.prototype.circles = function (values) {
    values = values || [];
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      var pos = this.axis.getValuePosition(value);
      canvas.circle({
        x: pos.x, 
        y: pos.y
      });
    }
  };

  PolarXCoordinate.prototype.draw = function (values) {
    this.axis.draw();
    this.circles();
  };

  /**
   * A two dimensional coordinate plane with a vertical axis
   */

  var PolarYCoordinate = function (config) {
    this.axis = new YAxis(config);
  };

  PolarYCoordinate.prototype.circles = function (values) {
    values = values || [];
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      var pos = this.axis.getValuePosition(value);
      canvas.circle({
        x: pos.x, 
        y: pos.y
      });
    }
  };

  PolarYCoordinate.prototype.draw = function (values) {
    this.axis.draw();
    this.circles();
  };

  /**
   * A two dimensional coordinate plane with a vertical and horizontal axis
   */

  var CartesianCoordinate = function (config) {
    this.x = config.x;
    this.y = config.y;
    this.xWidth = config.x_width;
    this.yWidth = config.y_width;
    this.xRange = config.x_range;
    this.yRange = config.y_range;
    this.origin = config.origin;
    this.xAxis = new XAxis({
      x: this.x,
      y: this.y,
      width: this.xWidth, 
      range: this.xRange
    });
    this.yAxis = new YAxis({
      x: this.x,
      y: this.y,
      width: this.yWidth,
      range: this.yRange
    });
    this.yAxis.x = this.xAxis.getValuePosition(this.origin.x).x;
    this.yAxis.y = this.y;
    this.xAxis.x = this.x;
    this.xAxis.y = this.yAxis.getValuePosition(this.origin.y).y;
  };

  CartesianCoordinate.prototype.grid = function () {
    var yMin = this.yAxis.getMin();
    var yMax = this.yAxis.getMax();
    for (var i = yMin; i <= yMax; i++) {
      var y = this.yAxis.getValuePosition(i).y;
      canvas.line({
        x1: this.x,
        y1: y,
        x2: this.x + this.xAxis.getWidth(),
        y2: y,
        stroke_width: 0.2
      });
    }
    var xMin = this.xAxis.getMin();
    var xMax = this.xAxis.getMax();
    for (var i = xMin; i <= xMax; i++) {
      var x = this.xAxis.getValuePosition(i).x;
      canvas.line({
        x1: x,
        y1: this.y,
        x2: x,
        y2: this.y + this.yAxis.getWidth(),
        stroke_width: 0.2
      });
    }
  };

  CartesianCoordinate.prototype.circles = function (points) {
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var xPos = this.xAxis.getValuePosition(point.x).x;
      var yPos = this.yAxis.getValuePosition(point.y).y;
      canvas.circle({
        x: xPos,
        y: yPos
      });
    }
  };

  CartesianCoordinate.prototype.path = function (points) {
    var coordinates = [];
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var xPos = this.xAxis.getValuePosition(point.x).x;
      var yPos = this.yAxis.getValuePosition(point.y).y;
      coordinates.push({
        x: xPos, 
        y: yPos
      });
    }
    canvas.path({
      points: coordinates
    });
  }; 

  CartesianCoordinate.prototype.draw = function (points) {
    this.xAxis.draw();
    this.yAxis.draw();
    this.grid();
    this.circles(points);
    this.path(points);
  };

  window.Graphite = {
    PolarXCoordinate: PolarXCoordinate,
    PolarYCoordinate: PolarYCoordinate,
    CartesianCoordinate: CartesianCoordinate,
    init: function (canvasObj) {
      canvas = canvasObj;
    }
  };

})(window);
