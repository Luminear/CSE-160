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

    // console.log("you got this far");
    // console.log(v.elements[0]);

    let cx = canvas.width/2;
    let cy = canvas.height/2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (v.elements[0] * 20), cy - (v.elements[1] * 20));
    ctx.stroke();
}