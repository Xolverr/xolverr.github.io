let ctx;
let delta = 0;

function initial() {
    const canvas = document.getElementById("screen");
    
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    init();

    window.requestAnimationFrame(update);
}

function update(now) {

    delta += 1/60;

    clear();
    frame(delta);

    window.requestAnimationFrame(update);
}

function clear() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

window.addEventListener("load", initial);