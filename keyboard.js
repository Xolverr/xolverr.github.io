window.addEventListener('keydown', checkdown, false);
window.addEventListener('keyup', checkup, false);

let keys = [];

class keyboard {
    static isKeyPressed(key='') {
        switch (key) {
            case 'up':
                return keys.includes(38);break;
            case 'down':
                return keys.includes(40);break;
            case 'left':
                return keys.includes(37);break;
            case 'right':
                return keys.includes(39);break;
            case 'W':
                return keys.includes(87);break;
            case 'A':
                return keys.includes(65);break;
            case 'S':
                return keys.includes(83);break;
            case 'D':
                return keys.includes(68);break;
            case 'space':
                return keys.includes(32);break;
            case 'shift':
                return keys.includes(16);break;
            default:
                break;
        }
    }
}

function checkdown(e) {
    if (!keys.includes(e.keyCode)) {
        keys.push(e.keyCode);
        // console.log(e.keyCode);
    }
}

function checkup(e) {
    keys.splice(keys.indexOf(e.keyCode), 1);
}