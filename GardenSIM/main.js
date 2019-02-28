var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function (ctx) {
    // this.ctx.drawImage(this.spritesheet,
    //                this.x, this.y);
    for(var row = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){

            ctx.beginPath();
            ctx.moveTo(0 + 100 * col, 0);
            ctx.lineTo(0 + 100 * col, 800);
            ctx.stroke();



        }

        
        ctx.beginPath();
        ctx.moveTo(0, 0 + 100 * row);
        ctx.lineTo(800 , 0 + 100 * row);
        ctx.stroke();

        
    }



    //console.log("HERE")
};

Background.prototype.update = function () {
    
};



function Seed(game) {
    this.x = 50;
    this.y = 50;
    this.game = game;
    this.ctx = game.ctx;
};

Seed.prototype.draw = function (ctx) {
    // this.ctx.drawImage(this.spritesheet,
    //                this.x, this.y);


    for(var row = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){

            ctx.beginPath();
            ctx.fillStyle = "brown";
            ctx.arc(this.x + 100 * row, this.y + 100 * col, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        

        }

        
    }
    


    //console.log("HERE")
};

Seed.prototype.update = function () {

};




AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine));
    gameEngine.addEntity(new Seed(gameEngine));

    console.log("All Done!");
});