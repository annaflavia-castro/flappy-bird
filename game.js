const sprites = new Image();
sprites.src = './sprites.png';

let frames = 0;
const sound_collision = new Audio();
sound_collision.src = './effects/collision.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
    sx: 390,
    sy: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,

    draw() {
        context.fillStyle = "#70c5ce"
        context.fillRect(0,0, canvas.width, canvas.height)
        
        context.drawImage(
            sprites,
            background.sx, background.sy,
            background.width, background.height,
            background.x, background.y,
            background.width, background.height,
        );
        
        context.drawImage(
            sprites,
            background.sx, background.sy,
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height,
        );
    },
};

function createFloor() {
    const floor = {
        sx: 0,
        sy: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,

        update() {
            const floorMotion = 1;
            const repeatOn = floor.width / 2;
            const movement = floor.x - floorMotion;

            floor.x = movement % repeatOn;
        },

        draw() {
            context.drawImage(
                sprites,
                floor.sx, floor.sy,
                floor.width, floor.height,
                floor.x, floor.y,
                floor.width, floor.height,
            );

            context.drawImage(
                sprites,
                floor.sx, floor.sy,
                floor.width, floor.height,
                (floor.x + floor.width), floor.y,
                floor.width, floor.height,
            );
        },
    };
    return floor;
};

function hasCollision(flappyBird, floor) {
    const flappyBiry = flappyBird.y + flappyBird.height;
    const floory = floor.y;

    if (flappyBiry >= floory) {
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
        x: 10, 
        y: 50,
        jump: 4.6,
        gravity: 0.25,
        velocity: 0,
    
        jumping() {
            flappyBird.velocity = - flappyBird.jump;
        },
        
        update() {
            if (hasCollision(flappyBird, global.floor)) {
                sound_collision.play();

                setTimeout(() => {
                    changeScreen(Screens.START);
                }, 500);
                return;
            }
            
            flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
            flappyBird.y = flappyBird.y + flappyBird.velocity;
        },

        movements: [
            { sx: 0, sy: 0, },
            { sx: 0, sy: 26, },
            { sx: 0, sy: 52, },
            { sx: 0, sy: 26, },
        ],

        currentFrame: 0,

        updateCurrentFrame() {
          const intervalFrame = 10;
          const intervalPast = frames % intervalFrame === 0;

          if(intervalPast) {
            const incrementBase = 1;
            const increment = incrementBase + flappyBird.currentFrame;
            const repeatBase = flappyBird.movements.length;
            flappyBird.currentFrame = increment % repeatBase
          }
        },
    
        draw() {
            flappyBird.updateCurrentFrame();

            const { sx, sy } = flappyBird.movements[flappyBird.currentFrame];

            context.drawImage(
                sprites,
                sx, sy,
                flappyBird.width, flappyBird.height,
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.height,
            );
        },
    };
    return flappyBird;
};

const messageGetReay = {
    sx: 134,
    sy: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,

    draw() {
        context.drawImage(
            sprites,
            messageGetReay.sx, messageGetReay.sy,
            messageGetReay.width, messageGetReay.height,
            messageGetReay.x, messageGetReay.y,
            messageGetReay.width, messageGetReay.height,
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

function createPipes() {
    const pipes = {
        width: 52,
        height: 400,
        floor: {
            sx: 0,
            sy: 169,
        },
        heaven: {
            sx: 52,
            sy: 169,
        },
        space: 80,

        draw() {
            pipes.pairs.forEach(function(pair) {
                const randomY = pair.y;
                const spacingBetweenPipes = 90;
  
                const pipeHeavenX = pair.x;
                const pipeHeavenY = randomY; 
        
                context.drawImage(
                    sprites, 
                    pipes.heaven.sx, pipes.heaven.sy,
                    pipes.width, pipes.height,
                    pipeHeavenX, pipeHeavenY,
                    pipes.width, pipes.height,
                )
  
                const pipeFloorX = pair.x;
                const pipeFloorY = pipes.height + spacingBetweenPipes + randomY; 
                context.drawImage(
                    sprites, 
                    pipes.floor.sx, pipes.floor.sy,
                    pipes.width, pipes.height,
                    pipeFloorX, pipeFloorY,
                    pipes.width, pipes.height,
                )
        
                pair.pipeHeaven = {
                    x: pipeHeavenX,
                    y: pipes.height + pipeHeavenY
                }
                
                pair.pipeFloor = {
                    x: pipeFloorX,
                    y: pipeFloorY
                }
            })
        },

        hasCollisionWithFlappyBird(pair) {
            const headFlappy = global.flappyBird.y;
            const footFlappy = global.flappyBird.y + global.flappyBird.height;
    
            if(global.flappyBird.x >= pair.x) {
                if(headFlappy <= pair.pipeHeaven.y) {
                    return true;
                }
    
                if(footFlappy >= pair.pipeFloor.y) {
                    return true;
                }
            }
            return false;
        },

        pairs: [],
      
        update() {
            const passedOneHundredFrames = frames % 100 === 0;
            if(passedOneHundredFrames) {
                pipes.pairs.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            pipes.pairs.forEach(function(pair) {
                pair.x = pair.x - 2;
  
                if(pipes.hasCollisionWithFlappyBird(pair)) {
                    changeScreen(Screens.START);
                }
  
                if(pair.x + pipes.width <= 0) {
                    pipes.pairs.shift();
                }
            });
        }
    }
    return pipes;
}

const Screens = {
    START: {
        initialize() {
            global.flappyBird = createFlappyBird();
            global.floor = createFloor();
            global.pipes = createPipes();
        },

        draw() {
            background.draw();
            global.flappyBird.draw();
            global.floor.draw();
            messageGetReay.draw();
        },

        click() {
            changeScreen(Screens.GAME)
        },

        update() {
            global.floor.update();
        },
    },

    GAME: {
        draw() {
            background.draw();
            global.pipes.draw();
            global.floor.draw();
            global.flappyBird.draw();
        },

        click() {
            global.flappyBird.jumping();
        },

        update() {
            global.pipes.update();
            global.floor.update();
            global.flappyBird.update();
        },
    },
};

function loop() {
    activeScreen.draw();
    activeScreen.update();

    frames = frames + 1;

    requestAnimationFrame(loop);
};

window.addEventListener("click", function() {
    if (activeScreen.click) {
        activeScreen.click();
    }
});

changeScreen(Screens.START);
loop();