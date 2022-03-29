class Canvas{
    constructor(i){
        this.cv = document.createElement("canvas");
        this.ctx = this.cv.getContext("2d");

        this.width = i.width;
        this.height = i.height;

        this.cv.width = i.width;
        this.cv.height = i.height;
        this.cv.classList.add(i.id);
        this.cv.style.background = i.background;
        this.cursor(i.cursor);
        
        typeof i.parentId == 'undefined' 
            ? document.body.appendChild(this.cv)
            : document.getElementById(i.parentId).appendChild(this.cv);
    }
    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    cursor(bool){
        bool ? this.cv.style.cursor = "default" : this.cv.style.cursor = "none"
    }
}

class Paddle{
    constructor(i){
        this.x = i.x;
        this.y = i.y;
        this.Ix = i.x;
        this.Iy = i.y;
        this.color = i.color;
        this.width = i.width;
        this.height = i.height;
        this.speed = i.speed;
        this.upKeyCode = i.upKeyCode;
        this.downKeyCode = i.downKeyCode;
        this.up = false;
        this.down = false;
        this.score = 0;
    }
    render(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.up && (this.y -= this.speed);
        this.down && (this.y += this.speed);
    }
    move(key){
        this.upKeyCode == key && (this.up = true);
        this.downKeyCode == key && (this.down = true);
    }
    stop(key){
        this.upKeyCode == key && (this.up = false);
        this.downKeyCode == key && (this.down = false);
    }
    reset(){
        this.x = this.Ix;
        this.y = this.Iy;
        this.up = false;
        this.down = false;
    }
}

class Ball{
    constructor(i){
        this.x = i.x;
        this.y = i.y;
        this.Ix = i.x;
        this.Iy = i.y;
        this.color = i.color;
        this.width = i.width;
        this.height = i.height;
        this.upKeyCode = i.upKeyCode;
        this.downKeyCode = i.downKeyCode;
        this.speedX = 0;
        this.speedY = 0;
        this.started = false;
    }
    render(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    start(){
        this.speedX = randomNumberFromArray([-5, 5]);
        this.speedY = randomNumberFromArray([-2.5, 2.5]);
        this.started = true;
    }
    move(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    reset(){
        this.speedX = 0;
        this.speedY = 0;
        this.x = this.Ix;
        this.y = this.Iy;
        this.started = false;
    }
}

function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function randomNumberFromArray(array){
    return array[Math.floor(Math.random() * array.length)];
}

function openFullscreen(el) {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) { /* Safari */
        el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) { /* IE11 */
        el.msRequestFullscreen();
    }
}

let sceneWidth = 720;
let sceneHeight = 405;

const pongGameCanvas = new Canvas({
    id: "canvas",
    width: sceneWidth,
    height: sceneHeight,
    background: "#0f0f0f",
    parentId: "canvas-container",
    cursor: false
});

let player1 = new Paddle({
    x: 50,
    y: sceneHeight/2 - 75/2,
    width: 10,
    height: 75,
    speed: 6.25,
    color: "#fff",
    upKeyCode: 87,
    downKeyCode: 83 
});

let player2 = new Paddle({
    x: sceneWidth-50,
    y: sceneHeight/2 - 75/2,
    width: 10,
    height: 75,
    speed: 6.25,
    color: "#fff",
    upKeyCode: 38,
    downKeyCode: 40
});

let ball = new Ball({
    x: sceneWidth/2 - 10/2,
    y: sceneHeight/2 - 10/2,
    width: 10,
    height: 10,
    color: "#fff"
});

let gameFinished = false;

document.addEventListener("keydown", e => keyDown(e));
document.addEventListener("keyup", e => keyUp(e));

function keyDown(e){
    player1.move(e.keyCode);
    player2.move(e.keyCode);

    ball.started == false && ball.start();

    if (gameFinished){
        player1.score = 0;
        player2.score = 0;
        //text.innerText = `W S | ${player1.score} - ${player2.score} | O L`
		gameFinished = false;
    }
}

function keyUp(e){
    player1.stop(e.keyCode);
    player2.stop(e.keyCode);
}

function score(player){
    ball.reset();
    player1.reset();
    player2.reset();
    player.score += 1;
    if (player.score >= 7) {
        gameFinished = true;
    };
}

document.addEventListener("touchstart", e => touchStart(e));
document.addEventListener("touchmove", e => touchMove(e));

function touchStart(e) { 
    if(window.innerHeight == pongGameCanvas.cv.height) {
        console.log('fullscreen');
        //openFullscreen(pongGameCanvas.cv);
    }
    let rect = e.target.getBoundingClientRect();
    const x = e.targetTouches[0].pageX - rect.left;
    const y = e.targetTouches[0].pageY - rect.top;
    x < pongGameCanvas.width/2 && (player1.y = y - player1.height/2);
    x > pongGameCanvas.width/2 && (player2.y = y - player1.height/2);

    ball.started == false && ball.start();

    if (gameFinished){
        player1.score = 0;
        player2.score = 0;
		gameFinished = false;
    }
};

function touchMove(e) { 
    let rect = e.target.getBoundingClientRect();
    
    Object.values(e.targetTouches).forEach(touch => {
        const x = touch.pageX - rect.left;
        const y = touch.pageY - rect.top;
        x < pongGameCanvas.width/2 && (player1.y = y - player1.height/2);
        x > pongGameCanvas.width/2 && (player2.y = y - player1.height/2);
    });
};

function loop() {
    requestAnimationFrame(loop); 
    pongGameCanvas.clear();

    player1.render(pongGameCanvas.ctx);
    player2.render(pongGameCanvas.ctx);
    ball.render(pongGameCanvas.ctx);
    ball.move();

    if(isCollide(ball, player1)){
        ball.speedX = Math.abs(Math.abs(ball.speedX) + .25);
        ball.speedY += randomNumberFromArray([-Math.floor(Math.random() * 1), Math.floor(Math.random() * 1)])
    };
    if(isCollide(ball, player2)){
        ball.speedX = -Math.abs(Math.abs(ball.speedX) + .25);
        ball.speedY += randomNumberFromArray([-Math.floor(Math.random() * 1), Math.floor(Math.random() * 1)])
    };

    if(ball.y + ball.height > pongGameCanvas.height || ball.y < 0){
        ball.speedY *= -1;
    }

    if(ball.x > pongGameCanvas.width){
        score(player1);
    }
    if(ball.x < 0){
        score(player2);
    }
}
loop();
