const sprites = new Image();
sprites.src = './sprites.png';

const sound_collision = new Audio();
sound_collision.src = './effects/collision.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
    sx: 390,
    sy: 0,
    width: 275,
    height: 204,
    dx: 0,
    dy: canvas.height - 204,
    draw() {
        context.fillStyle = "#70c5ce"
        context.fillRect(0,0, canvas.width, canvas.height)
        
        context.drawImage(
            sprites,
            background.sx, background.sy,
            background.width, background.height,
            background.dx, background.dy,
            background.width, background.height,
        );
        
        context.drawImage(
            sprites,
            background.sx, background.sy,
            background.width, background.height,
            (background.dx + background.width), background.dy,
            background.width, background.height,
        );
    },
};

const floor = {
    sx: 0,
    sy: 610,
    width: 224,
    height: 112,
    dx: 0,
    dy: canvas.height - 112,
    draw() {
        context.drawImage(
            sprites,
            floor.sx, floor.sy,
            floor.width, floor.height,
            floor.dx, floor.dy,
            floor.width, floor.height,
        );

        context.drawImage(
            sprites,
            floor.sx, floor.sy,
            floor.width, floor.height,
            (floor.dx + floor.width), floor.dy,
            floor.width, floor.height,
        );
    },
};

function hasCollision(flappyBird, floor) {
    const flappyBirdDY = flappyBird.dy + flappyBird.height;
    const floorDY = floor.dy;

    if (flappyBirdDY >= floorDY) {
        return true;
    }
    return false;
};

function createFlappyBird() {
    const flappyBird = {
        sx: 0, 
        sy: 0,
        width: 33,
        height: 24,
        dx: 10, 
        dy: 50,
        jump: 4.6,
        gravity: 0.25,
        velocity: 0,
    
        jumping() {
            flappyBird.velocity = - flappyBird.jump;
        },
        
        update() {
            if (hasCollision(flappyBird, floor)) {
                sound_collision.play();

                setTimeout(() => {
                    changeScreen(Screens.START);
                }, 500);
                return;
            }
            
            flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
            flappyBird.dy = flappyBird.dy + flappyBird.velocity;
        },
    
        draw() {
            context.drawImage(
                sprites,
                flappyBird.sx, flappyBird.sy,
                flappyBird.width, flappyBird.height,
                flappyBird.dx, flappyBird.dy,
                flappyBird.width, flappyBird.height,
            );
        },
    };
    return flappyBird;
};

const messageGetReady = {
    sx: 134,
    sy: 0,
    width: 174,
    height: 152,
    dx: (canvas.width / 2) - 174 / 2,
    dy: 50,

    draw() {
        context.drawImage(
            sprites,
            messageGetReady.sx, messageGetReady.sy,
            messageGetReady.width, messageGetReady.height,
            messageGetReady.dx, messageGetReady.dy,
            messageGetReady.width, messageGetReady.height,
        );
    },
};

const global = {};

let activeScreen = {};
function changeScreen(newScreen) {
    activeScreen = newScreen;

    if (activeScreen.initialize) {
        activeScreen.initialize();
    }
};

const Screens = {
    START: {
        initialize() {
            global.flappyBird = createFlappyBird();
        },

        draw() {
            background.draw();
            floor.draw();
            global.flappyBird.draw();
            messageGetReady.draw();
        },

        click() {
            changeScreen(Screens.GAME)
        },

        update() {},
    },

    GAME: {
        draw() {
            background.draw();
            floor.draw();
            global.flappyBird.draw();
        },

        click() {
            global.flappyBird.jumping();
        },

        update() {
            global.flappyBird.update();
        },
    },
};

function loop() {
    activeScreen.draw();
    activeScreen.update();
    requestAnimationFrame(loop);
};

window.addEventListener("click", function() {
    if (activeScreen.click) {
        activeScreen.click();
    }
});

changeScreen(Screens.START);
loop();