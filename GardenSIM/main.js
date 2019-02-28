function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (other) {

    if (this.right >= other.left && this.left <= other.right && this.top <= other.bottom && this.bottom >= other.top) {
        return true;
    }
    return false;
}

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



function Seed(game, x, y, n, r) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.gotRain = r;
    this.seedNumber = n;
    this.boundingbox = new BoundingBox(this.x, this.y, 0, 0);
    this.ctx = game.ctx;
};

Seed.prototype = new Entity();
Seed.prototype.constructor = Seed;


Seed.prototype.update = function () {

    this.gotRain = this.gotRain;
   //console.log("SEED #: " + this.seedNumber + " Rain %: " + this.gotRain);

};

Seed.prototype.draw = function (ctx) {
    // this.ctx.drawImage(this.spritesheet,
    //                this.x, this.y);



            ctx.lineWidth = 3;
            ctx.strokeStyle = "blue";
            ctx.strokeRect(this.x, this.y, 0, 0);


            if(!this.gotRain){
            ctx.fillStyle= "rgb(0,0,0)";

            }else{

            ctx.fillStyle = "rgb(255,255,255)";


            }


            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();


    //console.log("HERE")
};


function Cloud(game) {

    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/cloud.png"), 0, 0, 100, 75, 0.5, 1, true, false);
    this.seedpatch = game.seedPatch[0];
    this.nX = Math.round(Math.random()) * 2 - 1;
    this.nY = Math.round(Math.random()) * 2 - 1;
    this.boundingbox = new BoundingBox(this.x, this.y, 100, 75);
    Entity.call(this, game, Math.floor(Math.random() * 701), Math.floor(Math.random() * 626));

    
}

Cloud.prototype = new Entity();
Cloud.prototype.constructor = Cloud;


Cloud.prototype.reset = function() {

}

Cloud.prototype.update = function () {



    
    this.x -= this.nX;
    this.y -= this.nY;


    if(this.x < 0){

        this.nX = -1;
    }

    if(this.y < 0){

        this.nY = -1;
    }

    if(this.x > 700){

        this.nX = 1;

    }

    if(this.y > 625){

        this.nY = 1;
    }



    for(let i = 0; i < this.game.seedPatch.length; i++){
        let CurrentSeed = this.game.seedPatch[i];
        if(this.boundingbox.collide(CurrentSeed.boundingbox));

        CurrentSeed.gotRain = true;
        console.log("SEED #: " + CurrentSeed.seedNumber + " got rain: " + CurrentSeed.gotRain);


    }

    // this.boundingbox = new BoundingBox(this.x, this.y, 100, 75);

}

Cloud.prototype.draw = function (ctx) {
    

    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.strokeRect(this.x, this.y, 100,75);
    
    this.animation.drawFrame(this.game.clockTick, ctx, this.x,this.y);
    // ctx.lineWidth = 3;
    // ctx.strokeStyle = "blue";
    // ctx.strokeRect(this.x, this.y, 100, 75);
    Entity.prototype.draw.call(this);
}


var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.queueDownload("./img/cloud.png");

ASSET_MANAGER.queueDownload("./img/background.jpg");
ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");  

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.addEntity(new Background(gameEngine));   

    var seedPatch = [];
    gameEngine.seedPatch = seedPatch;

    let seeds;


    var i = 1;

    for(let row = 0; row < 8; row ++){
        for(let col = 0; col < 7; col++){

            

            seeds = new Seed(gameEngine, 50 + 100 * row, 50 + 100 * col, i, false);
            console.log("row" + row);
            console.log(col);
            gameEngine.addEntity(seeds);
            seedPatch.push(seeds);

            i += 1;

        }
    }

    gameEngine.addEntity(new Cloud(gameEngine)); 

    console.log("All Done!");
});