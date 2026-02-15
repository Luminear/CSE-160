class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = 0;
        this.buffer = null;
        this.UVbuffer = null;
        this.front1 = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        this.frontUV1 = new Float32Array([0, 0, 1, 1, 1, 0]);
        this.front2 = new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0]);
        this.frontUV2 = new Float32Array([0, 0, 0, 1, 1, 1]);
        this.top1 = new Float32Array([0, 1, 0, 0, 1, 1, 1, 1, 1]);
        this.topUV1 = new Float32Array([0, 0, 0, 1, 1, 1]);
        this.top2 = new Float32Array([0, 1, 0, 1, 1, 1, 1, 1, 0]);
        this.topUV2 = new Float32Array([0, 0, 1, 1, 1, 0])
        this.bottom1 = new Float32Array([0, 0, 1, 1, 0, 0, 1, 0, 1]);
        this.bottomUV1 = new Float32Array([0, 1, 1, 0, 1, 1]);
        this.bottom2 = new Float32Array([0, 0, 1, 1, 0, 0, 0, 0, 0]);
        this.bottomUV2 = new Float32Array([0, 1, 1, 0, 0, 0]);
        this.back1 = new Float32Array([0, 0, 1, 1, 1, 1, 1, 0, 1]);
        this.backUV1 = new Float32Array([0, 0, 1, 1, 1, 0]);
        this.back2 = new Float32Array([0, 1, 1, 1, 1, 1, 0, 0, 1]);
        this.backUV2 = new Float32Array([0, 1, 1, 1, 0, 0]);
        this.left1 = new Float32Array([1, 0, 0, 1, 1, 1, 1, 0, 1]);
        this.leftUV1 = new Float32Array([0, 0, 1, 1, 0, 1]);
        this.left2 = new Float32Array([1, 0, 0, 1, 1, 1, 1, 1, 0]);
        this.leftUV2 = new Float32Array([0, 0, 1, 1, 1, 0]);
        this.right1 = new Float32Array([0, 0, 0, 0, 1, 1, 0, 0, 1]);
        this.rightUV1 = new Float32Array([0, 0, 1, 1, 0, 1]);
        this.right2 = new Float32Array([0, 0, 0, 0, 1, 1, 0, 1, 0]);
        this.rightUV2 = new Float32Array([0, 0, 1, 1, 1, 0]);
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        this.drawTriangle3DUV(this.front1, this.frontUV1);
        this.drawTriangle3DUV(this.front2, this.frontUV2);

        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        // Top of cube
        this.drawTriangle3DUV(this.top1, this.topUV1);
        this.drawTriangle3DUV(this.top2, this.topUV2);

        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        // Bottom of cube
        this.drawTriangle3DUV(this.bottom1, this.bottomUV1);
        this.drawTriangle3DUV(this.bottom2, this.bottomUV2);

        gl.uniform4f(u_FragColor, rgba[0] * 0.95, rgba[1] * 0.95, rgba[2] * 0.95, rgba[3]);
        // Back of cube
        this.drawTriangle3DUV(this.back1, this.backUV1);
        this.drawTriangle3DUV(this.back2, this.backUV2);

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // Left of cube
        this.drawTriangle3DUV(this.left1, this.leftUV1);
        this.drawTriangle3DUV(this.left2, this.leftUV2);

        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // Right of cube
        this.drawTriangle3DUV(this.right1, this.rightUV1);
        this.drawTriangle3DUV(this.right2, this.rightUV2);
    }

    drawTriangle3DUV(vertices, uv) {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_Position);

        if (this.UVbuffer === null) {
            this.UVbuffer = gl.createBuffer();
            if (!this.UVbuffer) {
                console.log("Failed to create the UV buffer object");
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_UV);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}