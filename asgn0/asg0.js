function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const v1 = new Vector3([2.25, 2.25, 0]);

    drawVector(v1, "red");
}

function drawVector(v, color) {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;

    let cx = canvas.width/2;
    let cy = canvas.height/2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (v.elements[0] * 20), cy - (v.elements[1] * 20));
    ctx.stroke();
}

function handleDrawEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let v1x = document.getElementById("v1x").value;
    let v1y = document.getElementById("v1y").value;
    let v2x = document.getElementById("v2x").value;
    let v2y = document.getElementById("v2y").value;

    const v1 = new Vector3([v1x, v1y, 0]);
    const v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let operation = document.getElementById("operation").value;
    let scalar = document.getElementById("scalar").value;

    let v1x = document.getElementById("v1x").value;
    let v1y = document.getElementById("v1y").value;
    let v2x = document.getElementById("v2x").value;
    let v2y = document.getElementById("v2y").value;

    const v1 = new Vector3([v1x, v1y, 0]);
    const v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");

    if (operation == "add") {
        v1.add(v2);
        drawVector(v1, "green");
    } else if (operation == "sub") {
        v1.sub(v2);
        drawVector(v1, "green");
    } else if (operation == "mul") {
        v1.mul(scalar);
        drawVector(v1, "green");
        v2.mul(scalar);
        drawVector(v2, "green");
    } else if (operation == "div") {
        v1.div(scalar);
        drawVector(v1, "green");
        v2.div(scalar);
        drawVector(v2, "green");
    } else if (operation == "mag") {
        console.log("Magnitude v1:", v1.magnitude());
        console.log("Magnitude v2:",v2.magnitude());
    } else if (operation == "nor") {
        v1.normalize();
        drawVector(v1, "green");
        v2.normalize();
        drawVector(v2, "green");
    } else if (operation == "ang") {
        console.log("Angle:", angleBetween(v1, v2));
    }
}

function angleBetween(v1, v2) {
    let dot_product = Vector3.dot(v1, v2);
    let m1 = v1.magnitude();
    let m2 = v2.magnitude();
    let mag = m1 * m2;
    let result = Math.acos(dot_product / mag);
    return result * (180 / Math.PI);
}