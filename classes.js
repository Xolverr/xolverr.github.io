class vec3d {
    constructor (x=0,y=0,z=0,w=1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static fromStringArray(arr) {
        return new vec3d(
            Number(arr[0]), Number(arr[1]), Number(arr[2])
        );
    }

    get array() {
        return [vec.x,vec.y,vec.z];
    }

    get length() {
        return Math.sqrt(
            Math.pow(this.x,2)+
            Math.pow(this.y,2)+
            Math.pow(this.z,2)
        );
    }

    get normal() {
        return this.div(this.length);
    }

    dot(v) {
        return (this.x*v.x + this.y*v.y + this.z*v.z);
    }

    cross(v) {
        return new vec3d(
            (this.y * v.z) - (this.z * v.y),
            (this.z * v.x) - (this.x * v.z),
            (this.x * v.y) - (this.y * v.x)
        )
    }

    add(v) {
        return new vec3d(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }

    sub(v) {
        return new vec3d(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }

    mul(k) {
        return new vec3d(
            this.x * k,
            this.y * k,
            this.z * k
        );
    }

    div(k) {
        return new vec3d(
            this.x / k,
            this.y / k,
            this.z / k
        );
    }

    static intersectPlane(plane_p=new vec3d(), plane_n=new vec3d(), lineStart=new vec3d(), lineEnd=new vec3d()) {
        plane_n = plane_n.normal;
        var plane_d = -plane_n.dot(plane_p);
        var ad = lineStart.dot(plane_n);
        var bd = lineEnd.dot(plane_n);
        var t = (-plane_d - ad) / (bd - ad);
        var lineStartToEnd = lineEnd.sub(lineStart);
        var lineToIntersect = lineStartToEnd.mul(t);
        return [lineStart.add(lineToIntersect), t];
    }

    clone() {
        return new vec3d(this.x, this.y, this.z);
    }
}

class vec2d {
    constructor(u=0,v=0,w=1) {
        this.u = u;
        this.v = v;
        this.w = w;
    }
}

class triangle {

    constructor(p0=new vec3d(), p1=new vec3d(), p2=new vec3d(), col=[0, 0, 0], t0=new vec2d(), t1=new vec2d(), t2=new vec2d(), texture='') {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.col = col;
        this.t0 = t0;
        this.t1 = t1;
        this.t2 = t2;
        this.texture = texture;
    }

    static fromArray(array) {
        return new triangle(
            new vec3d(array[0][0], array[0][1], array[0][2]),
            new vec3d(array[1][0], array[1][1], array[1][2]),
            new vec3d(array[2][0], array[2][1], array[2][2])
        );
    }

    static scale(tri, k) {
        return new triangle(
            tri.p0.mul(k),
            tri.p1.mul(k),
            tri.p2.mul(k),
            [255,255,255],
            tri.t0,
            tri.t1,
            tri.t2,
            tri.texture
        )
    }

    clipAgainstPlane(plane_p=new vec3d(), plane_n=new vec3d()) {

        plane_n = plane_n.normal;

        function dist(p=new vec3d()) {
            var n = p.normal;
            return (plane_n.x * p.x + plane_n.y * p.y + plane_n.z * p.z - plane_p.dot(plane_n));
        }
        
        var inside_points = [new vec3d(),new vec3d(),new vec3d()];var insidePointCount = 0;
        var outside_points = [new vec3d(),new vec3d(),new vec3d()];var outsidePointCount = 0;
        var inside_tex = [new vec2d(),new vec2d(),new vec2d()];var insideTexCount = 0;
        var outside_tex = [new vec2d(),new vec2d(),new vec2d()];var outsideTexCount = 0;

        var d0 = dist(this.p0);
        var d1 = dist(this.p1);
        var d2 = dist(this.p2);

        if (d0 >= 0) {inside_points[insidePointCount++] = this.p0; inside_tex[insideTexCount++] = this.t0;}
        else {outside_points[outsidePointCount++] = this.p0; outside_tex[outsideTexCount++] = this.t0;}
        if (d1 >= 0) {inside_points[insidePointCount++] = this.p1; inside_tex[insideTexCount++] = this.t1;}
        else {outside_points[outsidePointCount++] = this.p1; outside_tex[outsideTexCount++] = this.t1;}
        if (d2 >= 0) {inside_points[insidePointCount++] = this.p2; inside_tex[insideTexCount++] = this.t2;}
        else {outside_points[outsidePointCount++] = this.p2; outside_tex[outsideTexCount++] = this.t2;}

        if (insidePointCount == 0) {
            return [];
        }
        if (insidePointCount == 3) {
            return [this];
        }
        if (insidePointCount == 1 && outsidePointCount == 2) {

            var out = [new triangle()];

            out[0].col = this.col;

            out[0].p0 = inside_points[0];
            out[0].t0 = inside_tex[0];

            var tmp = vec3d.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);

            out[0].p1 = tmp[0];
            
            out[0].t1 = new vec2d(
                tmp[1] * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u,
                tmp[1] * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v,
                tmp[1] * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w
            );

            tmp = vec3d.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[1]);

            out[0].p2 = tmp[0];
            out[0].t2 = new vec2d(
                tmp[1] * (outside_tex[1].u - inside_tex[0].u) + inside_tex[0].u,
                tmp[1] * (outside_tex[1].v - inside_tex[0].v) + inside_tex[0].v,
                tmp[1] * (outside_tex[1].w - inside_tex[0].w) + inside_tex[0].w
            )

            return out;
        }
        if (insidePointCount == 2 && outsidePointCount == 1) {
            
            var out = [new triangle(),new triangle()];

            out[0].col = this.col;

            out[0].p0 = inside_points[0];
            out[0].p1 = inside_points[1];
            out[0].t0 = inside_tex[0];
            out[0].t1 = inside_tex[1];

            var tmp = vec3d.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);

            out[0].p2 = tmp[0];
            out[0].t2 = new vec2d(
                tmp[1] * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u,
                tmp[1] * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v,
                tmp[1] * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w
            )

            out[1].col = this.col;

            out[1].p0 = inside_points[1];
            out[1].t0 = inside_tex[1];

            tmp = vec3d.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);

            out[1].p1 = tmp[0];
            out[1].t1 = new vec2d(
                tmp[1] * (outside_tex[0].u - inside_tex[0].u) + inside_tex[0].u,
                tmp[1] * (outside_tex[0].v - inside_tex[0].v) + inside_tex[0].v,
                tmp[1] * (outside_tex[0].w - inside_tex[0].w) + inside_tex[0].w
            )

            tmp = vec3d.intersectPlane(plane_p, plane_n, inside_points[1], outside_points[0]);

            out[1].p2 = tmp[0];
            out[1].t2 = new vec2d(
                tmp[1] * (outside_tex[0].u - inside_tex[1].u) + inside_tex[1].u,
                tmp[1] * (outside_tex[0].v - inside_tex[1].v) + inside_tex[1].v,
                tmp[1] * (outside_tex[0].w - inside_tex[1].w) + inside_tex[1].w
            )
            
            return out;
        }

    }

    clone() {
        return new triangle(this.p0, this.p1, this.p2, this.col, this.t0, this.t1, this.t2, this.texture);
    }
}

class mat4x4 {
    constructor(m=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]) {
        this.m=m;
    }

    static identityMatrix() {
        return new mat4x4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }

    static rotXMatrix(theta=0) {
        return new mat4x4([
            [1, 0, 0, 0],
            [0, Math.cos(theta), Math.sin(theta), 0],
            [0, -Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 0, 1]
        ]);
    }

    static rotYMatrix(theta=0) {
        return new mat4x4([
            [Math.cos(theta), 0, Math.sin(theta), 0],
            [0, 1, 0, 0],
            [-Math.sin(theta), 0, Math.cos(theta), 0],
            [0, 0, 0, 1]
        ]);
    }

    static rotZMatrix(theta=0) {
        return new mat4x4([
            [Math.cos(theta), Math.sin(theta), 0, 0],
            [-Math.sin(theta), Math.cos(theta), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }

    static translationMatrix(x=0,y=0,z=0) {
        return new mat4x4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [x, y, z, 1]
        ]);
    }

    static projectionMatrix(fov=90,aspectRatio=1,near=0.1,far=1000) {
        var fovRad = 1 / Math.tan(fov * 0.5 / 180 * Math.PI);
        return new mat4x4([
            [aspectRatio * fovRad, 0, 0, 0],
            [0, fovRad, 0, 0],
            [0, 0, far / (far - near), 1],
            [0, 0, (-far * near) / (far - near), 0]
        ]);
    }

    multiplyMatrix(m) {
        var o = new mat4x4()
        for (var c = 0; c < 4; c++) {
            for (var r = 0; r < 4; r++) {
                o.m[r][c] = this.m[r][0] * m.m[0][c] + this.m[r][1] * m.m[1][c] + this.m[r][2] * m.m[2][c] + this.m[r][3] * m.m[3][c];
            }
        }
        return o;
    }

    multiplyVector(v) {

        return new vec3d(
            v.x * this.m[0][0] + v.y * this.m[1][0] + v.z * this.m[2][0] + v.w * this.m[3][0],
            v.x * this.m[0][1] + v.y * this.m[1][1] + v.z * this.m[2][1] + v.w * this.m[3][1],
            v.x * this.m[0][2] + v.y * this.m[1][2] + v.z * this.m[2][2] + v.w * this.m[3][2],
            v.x * this.m[0][3] + v.y * this.m[1][3] + v.z * this.m[2][3] + v.w * this.m[3][3]
        );

    }

    clone() {
        return new mat4x4(this.m);
    }
}

class imgtex {
    constructor(imgURL='',width=1,height=1) {
        this.img = new Image(imgURL);
        this.width = width;
        this.height = height;
    }
}

function pointAtMatrix(pos=new vec3d(), target=new vec3d(), up=new vec3d()) {

    var newForward = target.sub(pos);
    newForward = newForward.normal;

    var a = newForward.mul(up.dot(newForward));
    var newUp = up.sub(a);
    newUp = newUp.normal;

    var newRight = newUp.cross(newForward);

    return new mat4x4([
        [newRight.x, newRight.y, newRight.z, 0],
        [newUp.x, newUp.y, newUp.z, 0],
        [newForward.x, newForward.y, newForward.z, 0],
        [pos.x, pos.y, pos.z, 1]
    ]);

}

function quickInvertMatrix(m=new mat4x4()) {
    var matrix = new mat4x4();
    matrix.m[0][0] = m.m[0][0]; matrix.m[0][1] = m.m[1][0]; matrix.m[0][2] = m.m[2][0]; matrix.m[0][3] = 0;
    matrix.m[1][0] = m.m[0][1]; matrix.m[1][1] = m.m[1][1]; matrix.m[1][2] = m.m[2][1]; matrix.m[1][3] = 0;
    matrix.m[2][0] = m.m[0][2]; matrix.m[2][1] = m.m[1][2]; matrix.m[2][2] = m.m[2][2]; matrix.m[2][3] = 0;
    matrix.m[3][0] = -(m.m[3][0] * matrix.m[0][0] + m.m[3][1] * matrix.m[1][0] + m.m[3][2] * matrix.m[2][0]);
    matrix.m[3][1] = -(m.m[3][0] * matrix.m[0][1] + m.m[3][1] * matrix.m[1][1] + m.m[3][2] * matrix.m[2][1]);
    matrix.m[3][2] = -(m.m[3][0] * matrix.m[0][2] + m.m[3][1] * matrix.m[1][2] + m.m[3][2] * matrix.m[2][2]);
    matrix.m[3][3] = 1;
    return matrix;
}