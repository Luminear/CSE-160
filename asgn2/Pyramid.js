class Pyramid {
    constructor() {
        this.type = 'pyramid';
        this.color = [0.5, 0.5, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.buffer = null;
    }

    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of pyramid
        this.drawTriangle3D([0, 0, 0, 0.5, 1, 0.5, 1, 0, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        // Bottom of pyramid
        this.drawTriangle3D([0, 0, 1, 1, 0, 0, 1, 0, 1]);
        this.drawTriangle3D([0, 0, 1, 1, 0, 0, 0, 0, 0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // Back of cube
        this.drawTriangle3D([0, 0, 1, 0.5, 1, 0.5, 1, 0, 1]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.95, rgba[1] * 0.95, rgba[2] * 0.95, rgba[3]);
        // Left of cube
        this.drawTriangle3D([1, 0, 0, 0.5, 1, 0.5, 1, 0, 1]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.85, rgba[1] * 0.85, rgba[2] * 0.85, rgba[3]);
        // Right of cube
        this.drawTriangle3D([0, 0, 0, 0.5, 1, 0.5, 0, 0, 1]);
    }

    drawTriangle3D(vertices) {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}