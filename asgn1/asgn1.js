// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  actionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedShape = POINT;
let g_selectedSegments = 10;

function actionsForHTMLUI() {
  document.getElementById('pointButton').onclick = function () { g_selectedShape = POINT; };
  document.getElementById('triangleButton').onclick = function () { g_selectedShape = TRIANGLE; };
  document.getElementById('circleButton').onclick = function () { g_selectedShape = CIRCLE; };

  document.getElementById('clearButton').onclick = function () { g_shapesList = []; renderAllShapes(); };

  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value; });
  document.getElementById('segmentsSlide').addEventListener('mouseup', function () { g_selectedSegments = this.value; console.log(g_selectedSegments); });

  document.getElementById('copyButton').onclick = function () { copyPainting(); };
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {

  let [x, y] = convertCoordsToGL(ev);

  let point;
  if (g_selectedShape == POINT) {
    point = new Point();
  } else if (g_selectedShape == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }

  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  if (point.type == 'circle') {
    point.segments = g_selectedSegments;
  }
  g_shapesList.push(point);

  renderAllShapes();
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function convertCoordsToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  console.log("x:", x, "y:", y);
  return ([x, y]);
}

let verts = [[-0.9, 0.6, -0.7, 0.6, -0.7, -0.6], [-0.9, -0.6, -0.9, 0.6, -0.7, -0.6], [-0.7, 0.6, -0.7, 0.5, -0.2, 0.5], 
[-0.7, -0.6, -0.7, -0.5, -0.2, -0.5], [-0.2, 0.5, -0.2, 0, -0.1, 0], [-0.2, -0.5, -0.2, 0, -0.1, 0], 
[-0.1, 0.6, 0, 0.6, 0, 0.5], [0, 0.6, 0, 0.5, 0.4, 0.6], [0, 0.5, 0.4, 0.6, 0.4, 0.5], [0.4, 0.5, 0.4, 0.6, 0.8, 0.5],
[0.4, 0.6, 0.8, 0.6, 0.8, 0.5], [0.8, 0.6, 0.8, 0.5, 0.9, 0.6], [0.3, 0.5, 0.3, 0.1, 0.5, 0.1],
[0.3, 0.5, 0.5, 0.5, 0.5, 0.1], [0.5, 0.1, 0.3, 0.1, 0.5, -0.3], [0.5, -0.3, 0.3, -0.3, 0.3, 0.1],
[0.3, -0.3, 0.4, -0.3, 0.3, -0.45], [0.4, -0.3, 0.4, -0.6, 0.2, -0.6], [0.4, -0.3, 0.5, -0.3, 0.5, -0.45],
[0.4, -0.3, 0.4, -0.6, 0.6, -0.6]];
function copyPainting() {
  var triangleList = [];
  // Quad 1: x: -0.715 y: 0.685
  // Quad 2: x: 0.765 y: 0.735
  // Quad 3: x: -0.655 y: -0.565
  // Quad 4: x: 0.7 y: -0.555

  var vertLen = verts.length;
  for (var i = 0; i < vertLen; i++) {
    let point = new Triangle();

    point.position = [verts[i][0], verts[i][1]];
    point.color = g_selectedColor.slice();

    triangleList.push(point);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = triangleList.length;
  for (var i = 0; i < len; i++) {
    triangleList[i].drawing_render([verts[i][0], verts[i][1], verts[i][2], verts[i][3], verts[i][4], verts[i][5]]);
  }
}