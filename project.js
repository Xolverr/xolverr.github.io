let ctx;
let delta = 0;
let clearb;

let inte = [];

for (let i = 0; i < window.innerHeight; i++) {
    for (let j = 0; j < window.innerWidth; j++) {
        inte.push(0);
        inte.push(0);
        inte.push(0);
        inte.push(255);
    }
}

let array = new Uint8ClampedArray(inte);

function initial() {
    const canvas = document.getElementById("screen");
    
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    createImageBitmap(new ImageData(array, window.innerWidth, window.innerHeight)).then(clear);

    init();

    window.requestAnimationFrame(update);
}

function update(now) {

    delta += 1/60;

    clear();
    frame(delta);

    window.requestAnimationFrame(update);
}

function clear(input) {
    if (input) {
        clearb = input;
    }
    ctx.drawImage(clearb, 0, 0);
    
}

window.addEventListener("load", initial);