class Sphere {
    constructor() {
        this.type = 'sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.buffer = null;
        this.UVbuffer = null;
        this.normBuffer = null;
        // this.verts32 = new Float32Array([]);
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = Math.PI / 10;
        var dd = Math.PI / 10;

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2 * Math.PI); r += d) {
                var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
                var p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
                var p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

                var uv1 = [t / Math.PI, r / (2 * Math.PI)];
                var uv2 = [(t + dd) / Math.PI, r / (2 * Math.PI)];
                var uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
                var uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];

                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p2); uv = uv.concat(uv2);
                v = v.concat(p4); uv = uv.concat(uv4);

                gl.uniform4f(u_FragColor, 1, 1, 1, 1);
                this.drawTriangle3DUVNormal(v, uv, v);

                v = []; uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p4); uv = uv.concat(uv4);
                v = v.concat(p3); uv = uv.concat(uv3);
                gl.uniform4f(u_FragColor, 1, 1, 1, 1);
                this.drawTriangle3DUVNormal(v, uv, v);
            }
        }

    }

    drawTriangle3DUVNormal(vertices, uv, normals) {
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


        if (this.UVbuffer === null) {
            this.UVbuffer = gl.createBuffer();
            if (!this.UVbuffer) {
                console.log("Failed to create the UV buffer object");
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_UV);


        if (this.normBuffer === null) {
            this.normBuffer = gl.createBuffer();
            if (!this.normBuffer) {
                console.log("Failed to create the normal buffer object");
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_Normal);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}