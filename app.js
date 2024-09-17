let near;
let far;
let fov;
let aspectRatio;
let fovRad;

let matProj;
let matRotX;
let matRotZ;

let vCamera = new vec3d();
let vCamDir = new vec3d();
let vLookDir = new vec3d();

let buffer = new Uint8ClampedArray();

let mesh = [...getModel('Bob-omb Battlefield.obj', true, true)];
function init() {

    near = 0.1;
    far = 1000;
    fov = 90;
    aspectRatio = ctx.canvas.height / ctx.canvas.width;

    matProj = mat4x4.projectionMatrix(fov, aspectRatio, near, far);

    ctx.imageSmoothingEnabled = false;

    ctx.globalCompositeOperation = "source-over";

}

function frame(delta) {

    var vForward = vLookDir.mul(8 * 1/60);
    var vLeft = new vec3d(-vForward.z, vForward.y, vForward.x);

    if (keyboard.isKeyPressed('space')) {
        vCamera.y -= 8 * 1/60;
    }

    if (keyboard.isKeyPressed('shift')) {
        vCamera.y += 8 * 1/60;
    }

    if (keyboard.isKeyPressed('S')) {
        vCamera = vCamera.sub(vForward);
    }

    if (keyboard.isKeyPressed('W')) {
        vCamera = vCamera.add(vForward);
    }

    if (keyboard.isKeyPressed('A')) {
        vCamera = vCamera.add(vLeft);
    }

    if (keyboard.isKeyPressed('D')) {
        vCamera = vCamera.sub(vLeft);
    }

    if (keyboard.isKeyPressed('left')) {
        vCamDir.z += 2 * 1/60;
    }

    if (keyboard.isKeyPressed('right')) {
        vCamDir.z -= 2 * 1/60;
    }
    
    if (keyboard.isKeyPressed('up')) {
        vCamDir.y += 2 * 1/60;
    }

    if (keyboard.isKeyPressed('down')) {
        vCamDir.y -= 2 * 1/60;
    }

    // matRotZ = mat4x4.rotZMatrix(delta);
    // matRotX = mat4x4.rotXMatrix(delta*0.8);
    matRotZ = mat4x4.rotZMatrix(Math.PI);
    matRotX = mat4x4.rotXMatrix(0);
    matRotY = mat4x4.rotYMatrix(0);

    var matTrans = mat4x4.translationMatrix(0, 0, 8);
    
    var matWorld = matRotY.multiplyMatrix(matRotX);
    matWorld = matWorld.multiplyMatrix(matRotZ);
    matWorld = matWorld.multiplyMatrix(matTrans);

    var vUp = new vec3d(0, 1, 0);
    var vTarget = new vec3d(0, 0, 1);
    var matCameraRot = mat4x4.rotYMatrix(vCamDir.z).multiplyMatrix(mat4x4.rotXMatrix(vCamDir.y).multiplyMatrix(mat4x4.rotZMatrix(vCamDir.x)));
    vLookDir = matCameraRot.multiplyVector(vTarget);

    vTarget = vCamera.add(vLookDir);

    var matCamera = pointAtMatrix(vCamera, vTarget, vUp);

    var matView = quickInvertMatrix(matCamera);

    var trisToDraw = [];

    //DRAW
    
    mesh.forEach(isw => {

        // var tri = triangle.scale(isw, 2);
        var tri = isw;

        var triTrans = new triangle(
            matWorld.multiplyVector(tri.p0),
            matWorld.multiplyVector(tri.p1),
            matWorld.multiplyVector(tri.p2),
            tri.col,
            tri.t0,
            tri.t1,
            tri.t2,
            tri.texture
        )

        var normal = new vec3d();
        var line1 = new vec3d();
        var line2 = new vec3d();

        line1 = triTrans.p1.sub(triTrans.p0);
        line2 = triTrans.p2.sub(triTrans.p0);

        normal = line1.cross(line2);

        normal = normal.normal;

        var l = Math.sqrt(normal.x*normal.x + normal.y*normal.y + normal.z*normal.z);
        normal.x /= l; normal.y /= l; normal.z /= l;

        var vCamRay = triTrans.p0.sub(vCamera);

        if (normal.dot(vCamRay) < 0) {

            var vLight = new vec3d(0, -1, 0);

            var dp = Math.max(0.1, vLight.normal.dot(normal));

            var triViewed = new triangle(
                matView.multiplyVector(triTrans.p0),
                matView.multiplyVector(triTrans.p1),
                matView.multiplyVector(triTrans.p2),
                triTrans.col,
                triTrans.t0,
                triTrans.t1,
                triTrans.t2,
                tri.texture
            );

            var clipped = triViewed.clipAgainstPlane(new vec3d(0,0,0.1),new vec3d(0,0,1));

            clipped.forEach(i => {

                var triProj = new triangle(
                    matProj.multiplyVector(i.p0),
                    matProj.multiplyVector(i.p1),
                    matProj.multiplyVector(i.p2),
                    i.col,
                    i.t0.clone(),
                    i.t1.clone(),
                    i.t2.clone(),
                    tri.texture
                );

                triProj.t0 = new vec2d(triProj.t0.u / triProj.p0.w,triProj.t0.v / triProj.p0.w,1/triProj.p0.w);
                triProj.t1 = new vec2d(triProj.t1.u / triProj.p1.w,triProj.t1.v / triProj.p1.w,1/triProj.p1.w);
                triProj.t2 = new vec2d(triProj.t2.u / triProj.p2.w,triProj.t2.v / triProj.p2.w,1/triProj.p2.w);

                triProj.p0 = triProj.p0.div(triProj.p0.w);
                triProj.p1 = triProj.p1.div(triProj.p1.w);
                triProj.p2 = triProj.p2.div(triProj.p2.w);

                var vOffsetView = new vec3d(1, 1, 0);

                triProj.p0 = triProj.p0.add(vOffsetView);
                triProj.p1 = triProj.p1.add(vOffsetView);
                triProj.p2 = triProj.p2.add(vOffsetView);

                triProj.p0.x *= 0.5 * ctx.canvas.width; triProj.p0.y *= 0.5 * ctx.canvas.height;
                triProj.p1.x *= 0.5 * ctx.canvas.width; triProj.p1.y *= 0.5 * ctx.canvas.height;
                triProj.p2.x *= 0.5 * ctx.canvas.width; triProj.p2.y *= 0.5 * ctx.canvas.height;

                triProj.col = [dp*255,dp*255,dp*255];

                trisToDraw.push(triProj);

            });

        }

    });

    trisToDraw.sort((a, b) => {

        var z1 = (a.p0.z + a.p1.z + a.p2.z) / 3;
        var z2 = (b.p0.z + b.p1.z + b.p2.z) / 3;

        return (z1 > z2) ? -1 : 1;

    });

    trisToDraw.forEach(tris => {

        var clipped = [];
        var listTris = [new triangle()];
        listTris.unshift(tris);

        var newTris = 1;

        for (let p = 0; p < 4; p++) {
            
            while (newTris > 0) {
                var test = listTris.shift();

                newTris--;

                switch (p) {
                    case 0: clipped = test.clipAgainstPlane(new vec3d(0,0,0),new vec3d(1,0,0));break;
                    case 1: clipped = test.clipAgainstPlane(new vec3d(0,ctx.canvas.height,0),new vec3d(0,-1,0));break;
                    case 2: clipped = test.clipAgainstPlane(new vec3d(ctx.canvas.width,0,0),new vec3d(-1,0,0));break;
                    case 3: clipped = test.clipAgainstPlane(new vec3d(0,0,0),new vec3d(0,1,0));break;
                
                    default:
                        break;
                }

                clipped.forEach(i => {
                    listTris.unshift(i);
                });
            }

            newTris = listTris.length;
            
        }

        listTris.forEach(i => {

            // drawTexTri(i);
            drawTri(i, ("rgba(" + i.col[0] + "," + i.col[1] + "," + i.col[2] + ", 1)"));

            // drawTriOutline(i, "#FFFFFF");
        });

    });

    trisToDraw = [];

}

function drawTri(tri, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(Math.trunc(tri.p0.x), Math.trunc(tri.p0.y));
    ctx.lineTo(Math.trunc(tri.p1.x), Math.trunc(tri.p1.y));
    ctx.lineTo(Math.trunc(tri.p2.x), Math.trunc(tri.p2.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawTriOutline(tri, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(tri.p0.x, tri.p0.y);
    ctx.lineTo(tri.p1.x, tri.p1.y);
    ctx.lineTo(tri.p2.x, tri.p2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawTexTri(tri = new triangle()) {

    var texture = new Image();
    texture.src = tri.texture;

    var x0 = tri.p0.x, x1 = tri.p1.x, x2 = tri.p2.x;
    var y0 = tri.p0.y, y1 = tri.p1.y, y2 = tri.p2.y;
    
    var w0 = tri.t0.w, w1 = tri.t1.w, w2 = tri.t2.w;
    var u0 = tri.t0.u*texture.width/w0, u1 = tri.t1.u*texture.width/w1, u2 = tri.t2.u*texture.width/w2;
    var v0 = tri.t0.v*texture.height/w0, v1 = tri.t1.v*texture.height/w1, v2 = tri.t2.v*texture.height/w2;

    // Set clipping area so that only pixels inside the triangle will be affected by the image drawing operation
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();

    // Compute matrix transform with perspective correction
    var delta = (u0 * v1 + v0 * u2 + u1 * v2) - (v1 * u2 + v0 * u1 + u0 * v2);
    var delta_a = (x0 * v1 + v0 * x2 + x1 * v2) - (v1 * x2 + v0 * x1 + x0 * v2);
    var delta_b = (u0 * x1 + x0 * u2 + u1 * x2) - (x1 * u2 + x0 * u1 + u0 * x2);
    var delta_c = (u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2) - (x0 * v1 * u2 + v0 * u1 * x2 + u0 * x1 * v2);
    var delta_d = (y0 * v1 + v0 * y2 + y1 * v2) - (v1 * y2 + v0 * y1 + y0 * v2);
    var delta_e = (u0 * y1 + y0 * u2 + u1 * y2) - (y1 * u2 + y0 * u1 + u0 * y2);
    var delta_f = (u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2) - (y0 * v1 * u2 + v0 * u1 * y2 + u0 * y1 * v2);
    
    // Normalize by delta
    ctx.transform(delta_a / delta, delta_d / delta, delta_b / delta, delta_e / delta, delta_c / delta, delta_f / delta);

    // Draw the transformed image
    ctx.drawImage(texture, 0, 0);
    ctx.restore();
}

// function drawTexTri(tri = new triangle()) {

//     var texture = new Image();
//     texture.src = tri.texture;

//     var verts = [
//         tri.p0,
//         tri.p1,
//         tri.p2
//     ];

//     verts.sort((a,b) => {
//         return a.y - b.y;
//     });

//     var x1 = verts[0].x; var y1 = verts[0].y; var u1 = verts[0].u; var v1 = verts[0].v;
//     var x2 = verts[1].x; var y2 = verts[1].y; var u2 = verts[1].u; var v2 = verts[1].v;
//     var x3 = verts[2].x; var y3 = verts[2].y; var u3 = verts[2].u; var v3 = verts[2].v;

//     var dy1 = verts[1].y - verts[0].y;
//     var dx1 = verts[1].x - verts[0].x;
//     var dv1 = verts[1].v - verts[0].v;
//     var du1 = verts[1].u - verts[0].u;

//     console.log(verts[0])

//     var dy2 = verts[2].y - verts[0].y;
//     var dx2 = verts[2].x - verts[0].x;
//     var dv2 = verts[2].v - verts[0].v;
//     var du2 = verts[2].u - verts[0].u;

//     var tex_u; var tex_v;

//     var dax_step = 0; var dbx_step = 0;
//     var du1_step = 0; var dv1_step = 0;
//     var du2_step = 0; var dv2_step = 0;

//     if (dy1 != 0) dax_step = dx1 / Math.abs(dy1);
//     if (dy2 != 0) dbx_step = dx2 / Math.abs(dy2);

//     if (dy1 != 0) du1_step = du1 / Math.abs(dy1);
//     if (dy1 != 0) dv1_step = dv1 / Math.abs(dy1);

//     if (dy2 != 0) du2_step = du2 / Math.abs(dy2);
//     if (dy2 != 0) dv2_step = dv2 / Math.abs(dy2);

//     if (dy1 != 0) {
//         for (let i = y1; i < y2; i++) {
//             var ax = x1 + i - y1 * dax_step;
//             var bx = x1 + i - y1 * dbx_step;
            
//             var tex_su = u1 + i - y1 * du1_step;
//             var tex_sv = v1 + i - y1 * dv1_step;

//             var tex_eu = u1 + i - y1 * du2_step;
//             var tex_ev = v1 + i - y1 * dv2_step;

//             if (ax > bx) {
//                 var tmp = ax;
//                 ax = bx;
//                 bx = tmp;
//                 tmp = tex_su;
//                 tex_su = tex_eu;
//                 tex_eu = tmp;
//                 tmp = tex_sv;
//                 tex_sv = tex_ev;
//                 tex_ev = tmp;
//             }

//             tex_u = tex_su;
//             tex_v = tex_sv;

//             var tstep = 1 / (bx - ax);
//             var t = 0;

//             for (let j = ax; j < bx; j++) {
                
//                 tex_u = (1-t) * tex_su + t * tex_eu;
//                 tex_v = (1-t) * tex_sv + t * tex_ev;

//                 addToBuffer(j, i, sampleColor(tex_u, tex_v, texture));

//                 t += tstep;
                
//             }


//         }
//     }


//     // drawBuffer();

// }

// function sampleColor(u, v, tex) {

//     // imgctx.canvas.width = tex.width;
//     // imgctx.canvas.height = tex.height;

//     // imgctx.drawImage(tex,0,0);
    
//     // return imgctx.getImageData(0,0,u,v).data;
//     return [180,180,180,1];

// }

// function addToBuffer(x,y,rgba) {

//     buffer[((window.innerWidth * y) + x) * 4] = rgba[0];
//     buffer[((window.innerWidth * y) + x) * 4 + 1] = rgba[1];
//     buffer[((window.innerWidth * y) + x) * 4 + 2] = rgba[2];
//     buffer[((window.innerWidth * y) + x) * 4 + 3] = rgba[3];

// }

// function getIndexOf(x, y, width) {
//     return y * (imageBuffer.width * 4) + x * 4;
// }

// function drawBuffer() {

//     createImageBitmap(new ImageData(buffer, window.innerWidth, window.innerHeight)).then(final);

// }

// function final(input) {
//     if (input) {
//         ctx.drawImage(input);
//     }
// }