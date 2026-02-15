// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else {
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  actionsForHTMLUI();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // renderAllShapes();
  requestAnimationFrame(tick);
}

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_globalAngle = 0;
let g_tailAngle = 0;
let g_tailMidAngle = 0;
let g_tailEndAngle = 0;
let g_headAngle = 0;
let g_headAngle2 = 0;
let g_leftEyeScale = 0.1;
let g_rightEyeScale = 0.1;
let g_headAnim = false;
let g_tailAnim = false;
let g_tailMidAnim = false;
let g_tailEndAnim = false;
let pokeAnim = false;

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
  document.getElementById('tailEndSlide').oninput = function () {
    g_tailEndAngle = this.value; renderAllShapes();
  };
  document.getElementById('headSlide').oninput = function () {
    g_headAngle = this.value; renderAllShapes();
  };
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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function initTextures() {
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function () { loadTexture0(image); }
  image.src = 'dirt.webp';

  return true;
}

function loadTexture0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  gl.uniform1i(u_Sampler0, 0);

  // gl.clear(gl.COLOR_BUFFER_BIT);

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
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
    g_tailAngle = (20 * Math.sin(2 * g_seconds));
  }
  if (g_tailMidAnim) {
    g_tailMidAngle = (25 * Math.sin(g_seconds));
  }
  if (g_tailEndAnim) {
    g_tailEndAngle = (25 * Math.sin(g_seconds));
  }
  if (pokeAnim) {
    g_leftEyeScale = 0.025;
    g_rightEyeScale = 0.025;
    g_headAngle2 = (15 * Math.sin(4 * g_seconds));
  }
}

function keydown(ev) {
  if (ev.keyCode == 65) { // left
    let f = new Vector3();
    f.set(g_at);
    f.sub(g_eye);
    let s = Vector3.cross(g_up, f);
    s.normalize();
    s.mul(0.5);
    g_eye.add(s);
    g_at.add(s);
  } else if (ev.keyCode == 68) { // right
    let f = new Vector3();
    f.set(g_at);
    f.sub(g_eye);
    let s = Vector3.cross(f, g_up);
    s.normalize();
    s.mul(0.5);
    g_eye.add(s);
    g_at.add(s);
  } else if (ev.keyCode == 87) { // forward
    let f = new Vector3();
    f.set(g_at);
    f.sub(g_eye);
    f.normalize();
    f.mul(0.5);
    g_eye.add(f);
    g_at.add(f);
  } else if (ev.keyCode == 83) { // backward
    let b = new Vector3();
    b.set(g_eye);
    b.sub(g_at);
    b.normalize();
    b.mul(0.5);
    g_eye.add(b);
    g_at.add(b);
  } else if (ev.keyCode == 81) { // pan left
    let f = new Vector3();
    f.set(g_at);
    f.sub(g_eye);
    let rotMat = new Matrix4().setRotate(10, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
    let f_prime = rotMat.multiplyVector3(f);
    f_prime.add(g_eye);
    g_at.set(f_prime);
  } else if (ev.keyCode == 69) { // pan right
    let f = new Vector3();
    f.set(g_at);
    f.sub(g_eye);
    let rotMat = new Matrix4().setRotate(-10, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
    let f_prime = rotMat.multiplyVector3(f);
    f_prime.add(g_eye);
    g_at.set(f_prime);
  }

  renderAllShapes();
}

let locked = false;
function click(ev) {
  if (ev.shiftKey) {
    if (locked) return;
    locked = true;
    pokeAnim = true;
    setTimeout(() => {
      locked = false;
      pokeAnim = false;
      g_leftEyeScale = 0.1;
      g_rightEyeScale = 0.1;
    }, 3000);
  }
}

var g_eye = new Vector3([0, 0, 0]);
var g_at = new Vector3([0, 0, -1]);
var g_up = new Vector3([0, 1, 0]);

function renderAllShapes() {
  var startTime = performance.now();
  
  var projMat = new Matrix4();
  projMat.setPerspective(60.0, 1 * canvas.width / canvas.height, 0.1, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2],
    g_at.elements[0], g_at.elements[1], g_at.elements[2],
    g_up.elements[0], g_up.elements[1], g_up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var floor = new Cube();
  floor.color = [0.5, 1.0, 0.5, 1.0];
  floor.textureNum = -2;
  floor.matrix.scale(49.9, 0.1, 49.9);
  floor.matrix.translate(-0.5, -10, -0.5);
  floor.render();
  
  var sky = new Cube();
  sky.color = [0.5, 0.5, 1.0, 1.0];
  sky.textureNum = -2;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  var body = new Cube();
  body.color = [0.95, 0.45, 0.0, 1.0];
  body.textureNum = -2;
  body.matrix.translate(-0.25, -0.5, -0.2);
  body.matrix.rotate(0, 1, 0, 0);
  body.matrix.scale(0.5, 0.4, 0.75);
  body.render();

  var head = new Cube();
  head.color = [1.0, 0.5, 0.0, 1.0];
  head.matrix.translate(0.175, -0.25, -0.15);
  head.matrix.rotate(g_headAngle, 1, 0, 0);
  head.matrix.rotate(g_headAngle2, 0, 1, 0);
  head.matrix.rotate(180, 0, 1, 0);
  var eyeCoords = new Matrix4(head.matrix);
  var eyeCoords2 = new Matrix4(head.matrix);
  var earCoords = new Matrix4(head.matrix);
  var earCoords2 = new Matrix4(head.matrix);
  head.matrix.scale(0.35, 0.35, 0.35);
  head.render();

  var leftEye = new Cube();
  leftEye.color = [0.95, 0.95, 0.95, 1.0];
  leftEye.textureNum = -2;
  leftEye.matrix = eyeCoords;
  leftEye.matrix.translate(0.125, 0.175, 0.4);
  leftEye.matrix.rotate(180, 0, 1, 0);
  leftEye.matrix.scale(0.1, g_leftEyeScale, 0.1);
  leftEye.render();

  var rightEye = new Cube();
  rightEye.color = [0.95, 0.95, 0.95, 1.0];
  rightEye.textureNum = -2;
  rightEye.matrix = eyeCoords2;
  rightEye.matrix.translate(0.325, 0.175, 0.4);
  rightEye.matrix.rotate(180, 0, 1, 0);
  rightEye.matrix.scale(0.1, g_rightEyeScale, 0.1);
  rightEye.render();

  var leftEar = new Cube();
  leftEar.color = [1.0, 0.5, 0.0, 1.0];
  leftEar.textureNum = -2;
  leftEar.matrix = earCoords;
  leftEar.matrix.translate(0.075, 0.275, 0.25);
  leftEar.matrix.rotate(45, 0, 0, 1);
  leftEar.matrix.scale(0.1, 0.1, 0.05);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = [1.0, 0.5, 0.0, 1.0];
  rightEar.textureNum = -2;
  rightEar.matrix = earCoords2;
  rightEar.matrix.translate(0.275, 0.275, 0.25);
  rightEar.matrix.rotate(45, 0, 0, 1);
  rightEar.matrix.scale(0.1, 0.1, 0.05);
  rightEar.render();

  var frontLeftLeg = new Cube();
  frontLeftLeg.color = [1.0, 0.55, 0.0, 1.0];
  frontLeftLeg.textureNum = -2;
  frontLeftLeg.matrix.translate(0.15, -0.8, -0.2);
  frontLeftLeg.matrix.rotate(0, 1, 0, 0);
  frontLeftLeg.matrix.scale(0.1, 0.3, 0.1);
  frontLeftLeg.render();

  var frontRightLeg = new Cube();
  frontRightLeg.color = [1.0, 0.55, 0.0, 1.0];
  frontRightLeg.textureNum = -2;
  frontRightLeg.matrix.translate(-0.25, -0.8, -0.2);
  frontRightLeg.matrix.rotate(0, 1, 0, 0);
  frontRightLeg.matrix.scale(0.1, 0.3, 0.1);
  frontRightLeg.render();

  var backLeftLeg = new Cube();
  backLeftLeg.color = [0.85, 0.45, 0.0, 1.0];
  backLeftLeg.matrix.translate(0.15, -0.8, 0.45);
  backLeftLeg.matrix.rotate(0, 1, 0, 0);
  backLeftLeg.matrix.scale(0.1, 0.3, 0.1);
  backLeftLeg.render();

  var backRightLeg = new Cube();
  backRightLeg.color = [0.85, 0.45, 0.0, 1.0];
  backRightLeg.matrix.translate(-0.25, -0.8, 0.45);
  backRightLeg.matrix.rotate(0, 1, 0, 0);
  backRightLeg.matrix.scale(0.1, 0.3, 0.1);
  backRightLeg.render();

  var tailBegin = new Cube();
  tailBegin.color = [0.9, 0.5, 0.1, 1.0];
  tailBegin.matrix.setTranslate(0, -0.45, 0);
  tailBegin.matrix.rotate(5, 1, 0, 0);
  tailBegin.matrix.rotate(-g_tailAngle, 0, 0, 1);
  var tailMidCoords = new Matrix4(tailBegin.matrix);
  tailBegin.matrix.translate(-0.075, 0.35, 0.4);
  tailBegin.matrix.scale(0.15, 0.25, 0.15);
  tailBegin.render();

  var tailMid = new Cube();
  tailMid.color = [0.9, 0.5, 0.1, 1.0];
  tailMid.matrix = tailMidCoords;
  tailMid.matrix.translate(-0.07, 0.50, 0.405);
  tailMid.matrix.rotate(-g_tailMidAngle, 1, 0, 0);
  var tailEndCoords = new Matrix4(tailMid.matrix);
  tailMid.matrix.scale(0.14, 0.3, 0.14);
  tailMid.matrix.translate(0, 0.15, 0);
  tailMid.render();

  var tailEnd = new Cube();
  tailEnd.color = [0.9, 0.5, 0.1, 1.0];
  tailEnd.matrix = tailEndCoords;
  tailEnd.matrix.translate(0.005, 0.3, 0);
  tailEnd.matrix.rotate(-g_tailEndAngle, 1, 0, 0);
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