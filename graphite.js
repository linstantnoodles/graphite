(function (window) {

  // Canvas instance
  var canvas = null;

  var Axis = function (config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.values = config.values || [];
    this.range = config.range;
  };

  // Distance between each value on the axis
  Axis.prototype.getIntervalWidth = function () {
    return Math.floor(this.width / (this.getMax() - this.getMin()));
  };

  // Since some may not evenly divide the max may not always be at the end
  // This is the actual width of the line
  Axis.prototype.getLineWidth = function () {
    return  this.width - (this.width - (this.getIntervalWidth() * (this.getMax() - this.getMin())));
  };

  Axis.prototype.getDistanceFromOrigin = function (value) {
    return (value - this.getMin()) * this.getIntervalWidth();
  };

  Axis.prototype.getMin = function () {
    return (this.range) ? this.range.min : Math.min.apply(null, this.values);
  };

  Axis.prototype.getMax = function () {
    return (this.range) ? this.range.max : Math.max.apply(null, this.values);
  };

  var PolarXCoordinate = function (config) {
    Axis.call(this, config);
  };

  PolarXCoordinate.prototype = Object.create(Axis.prototype);

  PolarXCoordinate.prototype.circles = function (values) {
    values = values || [];
    for (var i = 0; i < values.length; i++) {
      var value = this.values[i];
      var pos = this.getValuePosition({
        x: this.x,
        y: this.y
      }, value);
      canvas.circle({
        x: pos.x, 
        y: pos.y
      });
    }
  };

  PolarXCoordinate.prototype.getValuePosition = function (origin, value) {
    var posX = origin.x + this.getDistanceFromOrigin(value);
    return {
      x: posX,
      y: origin.y
    };
  };

  PolarXCoordinate.prototype.draw = function (values) {
    canvas.line({
      x1: this.x, 
      y1: this.y,
      x2: this.x + this.getLineWidth(),
      y2: this.y
    });
    this.circles();
  };

  var PolarYCoordinate = function (config) {
    Axis.call(this, config);
  };

  PolarYCoordinate.prototype = Object.create(Axis.prototype);
  
  PolarYCoordinate.prototype.circles = function (values) {
    values = values || [];
    for (var i = 0; i < values.length; i++) {
      var value = this.values[i];
      var pos = this.getValuePosition({
        x: this.x,
        y: this.y
      }, value);
      canvas.circle({
        x: pos.x, 
        y: pos.y
      });
    }
  };

  PolarYCoordinate.prototype.getValuePosition = function (origin, value) {
    var posY = (origin.y + this.getLineWidth()) - this.getDistanceFromOrigin(value);
    return {
      x: origin.x, 
      y: posY
    };
  };

  PolarYCoordinate.prototype.draw = function (values) {
    canvas.line({
      x1: this.x,
      y1: this.y,
      x2: this.x, 
      y2: this.y + this.getLineWidth()
    });
    this.circles();
  };

  var CartesianCoordinate = function (config) {
    this.x = config.x;
    this.y = config.y;
    this.xWidth = config.x_width;
    this.yWidth = config.y_width;
    this.xRange = config.x_range;
    this.yRange = config.y_range;
    this.origin = config.origin;
    this.xCoordinate = new PolarXCoordinate({
      width: this.xWidth, 
      range: this.xRange
    });
    this.yCoordinate = new PolarYCoordinate({
      width: this.yWidth,
      range: this.yRange
    });
    this.yCoordinate.x = this.xCoordinate.getValuePosition({
      x: this.x, 
      y: this.y
    }, this.origin.x).x;
    this.yCoordinate.y = this.y;
    this.xCoordinate.x = this.x;
    this.xCoordinate.y = this.yCoordinate.getValuePosition({
      x: this.x, 
      y: this.y
    }, this.origin.y).y;
  };

  CartesianCoordinate.prototype.grid = function () {
    var yMin = this.yCoordinate.getMin();
    var yMax = this.yCoordinate.getMax();
    for (var i = yMin; i <= yMax; i++) {
      var y = this.yCoordinate.getValuePosition({
        x: this.x, 
        y: this.y
      }, i).y;
      canvas.line({
        x1: this.x,
        y1: y,
        x2: this.x + this.xCoordinate.getLineWidth(),
        y2: y,
        stroke_width: 0.2
      });
    }
    var xMin = this.xCoordinate.getMin();
    var xMax = this.xCoordinate.getMax();
    for (var i = xMin; i <= xMax; i++) {
      var x = this.xCoordinate.getValuePosition({
        x: this.x, 
        y: this.y
      }, i).x;
      canvas.line({
        x1: x,
        y1: this.y,
        x2: x,
        y2: this.y + this.yCoordinate.getLineWidth(),
        stroke_width: 0.2
      });
    }
  };

  CartesianCoordinate.prototype.circles = function (points) {
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var xPos = this.xCoordinate.getValuePosition({
        x: this.x, 
        y: this.y
      }, point.x).x;
      var yPos = this.yCoordinate.getValuePosition({
        x: this.x, 
        y: this.y
      }, point.y).y;
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
      var xPos = this.xCoordinate.getValuePosition({
        x: this.x, 
        y: this.y
      }, point.x).x;
      var yPos = this.yCoordinate.getValuePosition({
        x: this.x, 
        y: this.y
      }, point.y).y;
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
    this.xCoordinate.draw();
    this.yCoordinate.draw();
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
