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

let mesh = [...getModel('/Bob-omb Battlefield.obj', true, true)];

function init() {

    near = 0.1;
    far = 1000;
    fov = 90;
    aspectRatio = ctx.canvas.height / ctx.canvas.width;

    matProj = mat4x4.projectionMatrix(fov, aspectRatio, near, far);

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




    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // matRotZ = mat4x4.rotZMatrix(delta);
    // matRotX = mat4x4.rotXMatrix(delta*0.8);
    matRotZ = mat4x4.rotZMatrix(0);
    matRotX = mat4x4.rotZMatrix(0);

    var matTrans = mat4x4.translationMatrix(0, 0, 8);
    
    var matWorld = matRotZ.multiplyMatrix(matRotX);
    matWorld = matWorld.multiplyMatrix(matTrans);

    var vUp = new vec3d(0, 1, 0);
    var vTarget = new vec3d(0, 0, 1);
    var matCameraRot = mat4x4.rotYMatrix(vCamDir.z);
    vLookDir = matCameraRot.multiplyVector(vTarget);

    vTarget = vCamera.add(vLookDir);

    var matCamera = pointAtMatrix(vCamera, vTarget, vUp);

    var matView = quickInvertMatrix(matCamera);

    var trisToDraw = [];

    //DRAW
    
    mesh.forEach(i => {

        // var tri = triangle.scale(i, 2);
        var tri = i;

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

            var vLight = new vec3d(0, 1, -1);

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
                    i.t0,
                    i.t1,
                    i.t2,
                    tri.texture
                );

                // triProj.t0.u = triProj.t0.u / triProj.p0.w;
                // triProj.t1.u = triProj.t1.u / triProj.p1.w;
                // triProj.t2.u = triProj.t2.u / triProj.p2.w;

                // triProj.t0.v = triProj.t0.v / triProj.p0.w;
                // triProj.t1.v = triProj.t1.v / triProj.p1.w;
                // triProj.t2.v = triProj.t2.v / triProj.p2.w;

                triProj.t0.w = 1 / triProj.p0.w;
                triProj.t1.w = 1 / triProj.p1.w;
                triProj.t2.w = 1 / triProj.p2.w;

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
    ctx.moveTo(tri.p0.x, tri.p0.y);
    ctx.lineTo(tri.p1.x, tri.p1.y);
    ctx.lineTo(tri.p2.x, tri.p2.y);
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

    // if (tri.texture != '') {
    //     console.log(tri)
    //     console.ls();
    // }

    var texture = new Image();
    texture.src = tri.texture;

    var x0 = tri.p0.x, x1 = tri.p1.x, x2 = tri.p2.x;
    var y0 = tri.p0.y, y1 = tri.p1.y, y2 = tri.p2.y;
    
    var w0 = tri.t0.w, w1 = tri.t1.w, w2 = tri.t2.w;
    var u0 = tri.t0.u/* * texture.width*/, u1 = tri.t1.u/* * texture.width*/, u2 = tri.t2.u/* * texture.width*/;
    var v0 = tri.t0.v/* * texture.height*/, v1 = tri.t1.v/* * texture.height*/, v2 = tri.t2.v/* * texture.height*/;

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