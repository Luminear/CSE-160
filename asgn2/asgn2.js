// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  actionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  // canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // gl.enable(gl.BLEND);
  // // Set blending function
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // renderAllShapes();
  requestAnimationFrame(tick);
}

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_globalAngle = 0;
let g_tailAngle = 0;
let g_tailMidAngle = 0;
let g_headAngle = 0;
let g_headAnim = false;
let g_tailAnim = false;

function actionsForHTMLUI() {
  document.getElementById('angleSlide').oninput = function () {
    g_globalAngle = this.value; renderAllShapes();
  };
  document.getElementById('tailSlide').oninput = function () {
    g_tailAngle = this.value; renderAllShapes();
  };
  document.getElementById('tailMidSlide').oninput = function () {
    g_tailMidAngle = this.value; renderAllShapes();
  };
  document.getElementById('headSlide').oninput = function () {
    g_headAngle = this.value; renderAllShapes();
  };
  document.getElementById('animHeadOnButton').onclick = function () {
    g_headAnim = true;
  }
  document.getElementById('animHeadOffButton').onclick = function () {
    g_headAnim = false;
  }
  document.getElementById('animTailOnButton').onclick = function () {
    g_tailAnim = true;
  }
  document.getElementById('animTailOffButton').onclick = function () {
    g_tailAnim = false;
  }
}

// function click(ev) {

//   let [x, y] = convertCoordsToGL(ev);

//   let point;
//   if (g_selectedShape == TRIANGLE) {
//     point = new Triangle();
//   }

//   point.position = [x, y];
//   point.color = g_selectedColor.slice();
//   g_shapesList.push(point);

//   renderAllShapes();
// }

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
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

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  // console.log(g_seconds);
  updateAnimAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimAngles() {
  if (g_headAnim) {
    g_headAngle = (15 * Math.sin(g_seconds));
  }
  if (g_tailAnim) {
    g_tailAngle = (20 * Math.sin(g_seconds));
  }
}

function renderAllShapes() {
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-0.25, -0.5, -0.2);
  body.matrix.rotate(0, 1, 0, 0);
  body.matrix.scale(0.5, 0.4, 0.75);
  body.render();

  var head = new Cube();
  head.color = [0.0, 0.5, 1.0, 1.0];
  head.matrix.translate(0.175, -0.25, -0.15);
  head.matrix.rotate(g_headAngle, 1, 0, 0);
  head.matrix.rotate(180, 0, 1, 0);
  var eyeCoords = new Matrix4(head.matrix);
  var eyeCoords2 = new Matrix4(head.matrix);
  head.matrix.scale(0.35, 0.35, 0.35);
  head.render();

  var leftEye = new Cube();
  leftEye.color = [0.35, 0.35, 0.35, 1.0];
  leftEye.matrix = eyeCoords;
  leftEye.matrix.translate(0.125, 0.175, 0.4);
  leftEye.matrix.rotate(180, 0, 1, 0);
  leftEye.matrix.scale(0.1, 0.1, 0.1);
  leftEye.render();

  var rightEye = new Cube();
  rightEye.color = [0.35, 0.35, 0.35, 1.0];
  rightEye.matrix = eyeCoords2;
  rightEye.matrix.translate(0.325, 0.175, 0.4);
  rightEye.matrix.rotate(180, 0, 1, 0);
  rightEye.matrix.scale(0.1, 0.1, 0.1);
  rightEye.render();

  var frontLeftLeg = new Cube();
  frontLeftLeg.color = [1.0, 0.5, 0.0, 1.0];
  frontLeftLeg.matrix.translate(0.15, -0.8, -0.2);
  frontLeftLeg.matrix.rotate(0, 1, 0, 0);
  frontLeftLeg.matrix.scale(0.1, 0.3, 0.1);
  frontLeftLeg.render();

  var frontRightLeg = new Cube();
  frontRightLeg.color = [1.0, 0.5, 0.0, 1.0];
  frontRightLeg.matrix.translate(-0.25, -0.8, -0.2);
  frontRightLeg.matrix.rotate(0, 1, 0, 0);
  frontRightLeg.matrix.scale(0.1, 0.3, 0.1);
  frontRightLeg.render();

  var backLeftLeg = new Cube();
  backLeftLeg.color = [1.0, 0.5, 0.0, 1.0];
  backLeftLeg.matrix.translate(0.15, -0.8, 0.45);
  backLeftLeg.matrix.rotate(0, 1, 0, 0);
  backLeftLeg.matrix.scale(0.1, 0.3, 0.1);
  backLeftLeg.render();

  var backRightLeg = new Cube();
  backRightLeg.color = [1.0, 0.5, 0.0, 1.0];
  backRightLeg.matrix.translate(-0.25, -0.8, 0.45);
  backRightLeg.matrix.rotate(0, 1, 0, 0);
  backRightLeg.matrix.scale(0.1, 0.3, 0.1);
  backRightLeg.render();

  var tailBegin = new Cube();
  tailBegin.color = [1.0, 1.0, 0.0, 1.0];
  tailBegin.matrix.setTranslate(0, -0.45, 0);
  tailBegin.matrix.rotate(5, 1, 0, 0);
  tailBegin.matrix.rotate(-g_tailAngle, 0, 0, 1);
  var tailMidCoords = new Matrix4(tailBegin.matrix);
  tailBegin.matrix.translate(-0.075, 0.35, 0.4);
  tailBegin.matrix.scale(0.15, 0.25, 0.15);
  tailBegin.render();

  var tailMid = new Cube();
  tailMid.color = [0.5, 0.5, 1.0, 1.0];
  tailMid.matrix = tailMidCoords;
  tailMid.matrix.translate(-0.07, 0.50, 0.405);
  tailMid.matrix.rotate(-g_tailMidAngle, 1, 0, 0);
  var tailEndCoords = new Matrix4(tailMid.matrix);
  tailMid.matrix.scale(0.14, 0.3, 0.14);
  tailMid.matrix.translate(0, 0.15, 0);
  tailMid.render();

  var tailEnd = new Cube();
  tailEnd.color = [1.0, 0.0, 1.0, 1.0];
  tailEnd.matrix = tailEndCoords;
  tailEnd.matrix.translate(0.005, 0.3, 0);
  tailEnd.matrix.rotate(35, 1, 0, 0);
  tailEnd.matrix.scale(0.13, 0.29, 0.13);
  tailEnd.render();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElem = document.getElementById(htmlID);
  if (!htmlElem) {
    console.log("failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElem.innerHTML = text;
}

// function convertCoordsToGL(ev) {
//   var x = ev.clientX; // x coordinate of a mouse pointer
//   var y = ev.clientY; // y coordinate of a mouse pointer
//   var rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
//   y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
//   return ([x, y]);
// }