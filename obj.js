let xhr = new XMLHttpRequest();

function getModel(filename, hasTexture=false, hasMTL=false) {

    if (filename == 'CUBE') {

        return [

            //SOUTH
            new triangle(
                new vec3d(0, 0, 0),new vec3d(0, 1, 0),new vec3d(1, 1, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(0, 0),new vec2d(1, 0)
            ),
            new triangle(
                new vec3d(0, 0, 0),new vec3d(1, 1, 0),new vec3d(1, 0, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(1, 0),new vec2d(1, 1)
            ),

            //EAST
            new triangle(
                new vec3d(1, 0, 0),new vec3d(1, 1, 0),new vec3d(1, 1, 1),
                [255,255,255],
                new vec2d(0, 1),new vec2d(0, 0),new vec2d(1, 0)
            ),
            new triangle(
                new vec3d(1, 0, 0),new vec3d(1, 1, 1),new vec3d(1, 0, 1),
                [255,255,255],
                new vec2d(0, 1),new vec2d(1, 0),new vec2d(1, 1)
            ),

            //NORTH
            new triangle(
                new vec3d(1, 0, 1),new vec3d(1, 1, 1),new vec3d(0, 1, 1),
                [255,255,255],
                new vec2d(0, 1),new vec2d(0, 0),new vec2d(1, 0)
            ),
            new triangle(
                new vec3d(1, 0, 1),new vec3d(0, 1, 1),new vec3d(0, 0, 1),
                [255,255,255],
                new vec2d(0, 1),new vec2d(1, 0),new vec2d(1, 1)
            ),

            //WEST
            new triangle(
                new vec3d(0, 0, 1),new vec3d(0, 1, 1),new vec3d(0, 1, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(0, 0),new vec2d(1, 0)
            ),
            new triangle(
                new vec3d(0, 0, 1),new vec3d(0, 1, 0),new vec3d(0, 0, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(1, 0),new vec2d(1, 1)
            ),

            //TOP
            new triangle(
                new vec3d(0, 1, 0),new vec3d(0, 1, 1),new vec3d(1, 1, 1),
                [255,255,255],
                new vec2d(0, 1),new vec2d(0, 0),new vec2d(1, 0)
            ),
            new triangle(
                new vec3d(0, 1, 0),new vec3d(1, 1, 1),new vec3d(1, 1, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(1, 0),new vec2d(1, 1)
            ),

            //BOTTOM
            new triangle(
                new vec3d(1, 0, 1),new vec3d(0, 0, 1),new vec3d(0, 0, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(0, 0),new vec2d(1, 0)
            ),
            new triangle(
                new vec3d(1, 0, 1),new vec3d(0, 0, 0),new vec3d(1, 0, 0),
                [255,255,255],
                new vec2d(0, 1),new vec2d(1, 0),new vec2d(1, 1)
            ),
        ];

    } else {
        xhr.open("GET", filename, false);
        xhr.send();

        return process(hasTexture, hasMTL);
    }
}

function process(hasTexture, hasMTL) {
    if (xhr.readyState == 4) {

        var model = [];

        var resp = xhr.responseText;

        var lines = resp.split(/\r?\n/);

        var verts = [];
        var texs = [];

        var mtlName = '';
        var objName = '';

        var mtl;

        var objs = [];
        var txts = [];

        lines.forEach(i => {

            var items = i.split(" ");

            var first = items.shift();

            if (!hasTexture) {
            
                if (first == 'v') {

                    verts.push(vec3d.fromStringArray(items));
                }

                if (first == 'f') {

                    model.push(
                        new triangle(
                            verts[Number(items[0].split(" ")[0]) - 1],
                            verts[Number(items[1].split(" ")[0])  - 1],
                            verts[Number(items[2].split(" ")[0])  - 1]
                        )
                    )
                }

            } else {

                if (first == 'v') {

                    verts.push(vec3d.fromStringArray(items));
                }

                if (first == 'vt') {
                    texs.push(new vec2d(items[0],items[1]));
                }

                if (first == 'f') {

                    model.push(
                        new triangle(
                            verts[Number(items[0].split(" ")[0].split("/")[0]) - 1],
                            verts[Number(items[1].split(" ")[0].split("/")[0])  - 1],
                            verts[Number(items[2].split(" ")[0].split("/")[0])  - 1],
                            [255,255,255],
                            texs[Number(items[items[0].split(" ")[0].split("/")[1]]) - 1],
                            texs[Number(items[items[1].split(" ")[0].split("/")[1]]) - 1],
                            texs[Number(items[items[2].split(" ")[0].split("/")[1]]) - 1],
                            txts[objs.indexOf(objName)]
                        )
                    )
                }

                if (first == 'mtllib') {
                    items.forEach(j => {
                        mtlName += j + ' ';
                    });

                    mtlName.trimEnd();


                    xhr.open("GET", mtlName, false);
                    xhr.send();

                    mtl = xhr.responseText.split(/\r?\n/);

                    mtl.forEach(i => {

                        var ies = i.split(' ');

                        var f = ies.shift();

                        if (f == 'newmtl') {
                            objs.push(ies[0]);
                        }

                        if (f == 'map_Kd') {
                            txts.push(ies[0]);
                        }

                    });

                }

                if (first == 'usemtl') {
                    objName = items[0];
                }
                
            }

        });

        return model;

    }
}