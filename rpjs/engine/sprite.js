import RandomClass from './random.js';

export default class SpriteClass {
        
    constructor(game,x,y,data) {
        this.game=game;
        this.x=x;
        this.y=y;
        this.data=(data===null)?new Map():data;
        
        this.UNDER_MAP_TILES_LAYER=0;
        this.BACKGROUND_LAYER=1;
        this.FOREGROUND_LAYER=2;
        
        this.currentImage=null;
        this.images=new Map();
        
        this.width=0;
        this.height=0;
        
        this.drawOffsetX=0;
        this.drawOffsetY=0;
        this.flipX=false;
        this.flipY=false;
        this.alpha=1.0;
        this.flash=false;
        this.flashRate=0;
        this.shake=false;
        this.shakeSize=0;
        this.shakePeriodTick=0;
        this.cameraOffsetX=0;
        this.cameraOffsetY=0;
        this.resizeX=1.0;
        this.resizeY=1.0;
        
        this.layer=this.FOREGROUND_LAYER;
        
        this.gravityFactor=0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.gravityAdd=0;
        this.gravityMoveY=0;
        this.gravityPauseTick=0;
        
        this.show=true;
        this.grounded=false;
        this.collideSprite=null;
        this.collideTileIdx=-1;
        this.collideTileLeft=0;
        this.collideTileRight=0;
        this.standSprite=null;
        this.standTileIdx=-1;
        this.riseSprite=null;
        this.riseTileIdx=-1;
        
        this.canCollide=true;
        this.canStandOn=true;
        this.canRiseBlock=true;
        
        this.spriteClassCollideIgnoreList=null;
        this.spriteClassStandOnIgnoreList=null;
        this.tileIndexIgnoreList=null;
        
        this.health=0;
        
        this.removeFlag=false; // make this private
        
        this.eventCollideSprite=null;
        this.eventCollideTileX=0;
        this.eventCollideTileY=0;
        this.eventCollideTileIdx=-1;
        this.eventStandSprite=null;
        this.eventStoodSprite=null;
        this.eventStandTileX=0;
        this.eventStandTileY=0;
        this.eventStandTileIdx=-1;
        this.eventRiseIntoSprite=null;
        this.eventRiseIntoTileX=0;
        this.eventRiseIntoTileY=0;
        this.eventRiseIntoTileIdx=-1;
        
        // can't seal this object as it's extended
    }
    
    /**
     * Override and set to true if this sprite is a player
     * sprite.  If there is more than one players sprite, the first
     * one encountered becomes the player.
     */
    isPlayer() {
        return(false);
    }
    
    /**
     * Override this to do any operations on this sprite
     * that happen when a map is started.
     */
    onMapStart() {
    }
    
    /**
     * Override this to react to this sprite hitting another sprite
     * (will need to call one of the checkcollisions or another sprite calling
     * that for this to happen.)
     */
    onCollideSprite(sprite) {
    }
    
    /**
     * Override this to react to this sprite hitting a tile
     * (will need to call one of the checkcollisions or another sprite calling
     * that for this to happen.)
     */
    onCollideTile(tileX,tileY,tileIdx) {
    }
    
    onStandOnSprite(sprite) {
    }
    
    onStoodOnSprite(sprite) {
    }
    
    onStandOnTile(tileX,tileY,tileIdx) {
    }
    
    onRiseIntoSprite(sprite) {
    }
    
    onRiseIntoTile(tileX,tileY,tileIdx) {
    }
    
    /**
     * Override this to listen to messages from other sprites, this
     * is up to the game developer as how to use cmd and data.
     */
    onMessage(fromSprite, cmd, data) {
    }
    
    /**
     * Override this to change the per-tick AI of object.
     */
    onRun(tick) {
    }
    
    sendMessage(toSprite,cmd,data) {
        toSprite.onMessage(this,cmd,data);
    }
    
    sendMessageToSpritesAroundSprite(lftAdd,topAdd,rgtAdd,botAdd,filterClass,cmd,data) {
        let sprites, sprite;
        
        sprites=this.game.map.getSpritesWithinBox((this.x+lftAdd),((this.y-this.height)+topAdd),((this.x+this.width)+rgtAdd),(this.y+botAdd),this,filterClass);
        
        for (sprite of sprites) {
            this.sendMessage(sprite,cmd,data);
        }
    }
    
    sendMessageToAllSpritesOfType(spriteClass,cmd,data) {
        let sprite;
        
        for (sprite of this.game.map.sprites) {
            if (sprite instanceof spriteClass) this.sendMessage(sprite,cmd,data);
        }
    }
    
    sendMessageToGame(cmd,data) {
        this.game.onMessage(this,cmd,data);
    }
    
    getMapName() {
        return(this.game.map.name);
    }
    
    setCollideSpriteClassCollideIgnoreList(spriteClassCollideIgnoreList) {
        this.spriteClassCollideIgnoreList=spriteClassCollideIgnoreList;
    }
    
    setCollideSpriteClassStandOnIgnoreList(spriteClassStandOnIgnoreList) {
        this.spriteClassStandOnIgnoreList=spriteClassStandOnIgnoreList;
    }
    
    setCollideTileIndexIgnoreList(tileIndexIgnoreList) {
        this.tileIndexIgnoreList=tileIndexIgnoreList;
    }
        
    addImage(name) {
        let img=this.game.imageList.get(name);
        if (img===undefined) {
            console.log('Unknown image png: '+name);
            return;
        }
        
        this.images.set(name,img);
    }
    
    setCurrentImage(name) {
        let img=this.images.get(name);
        if (img===undefined) {
            console.log('Unknown image name: '+name);
            return;
        }
        
        this.currentImage=img;
        
        this.width=img.width;
        this.height=img.height;
    }
    
    addSprite(typeClass,x,y,data) {
        return(this.game.map.addSprite(typeClass,x,y,data));
    }
    
    addParticle(x,y,particleDef) {
        return(this.game.map.addParticle(x,y,particleDef));
    }
    
    collide(hitSprite) {
        if ((this.x+this.width)<=hitSprite.x) return(false);
        if (this.x>=(hitSprite.x+hitSprite.width)) return(false);
        if (this.y<=(hitSprite.y-hitSprite.height)) return(false);
        return((this.y-this.height)<hitSprite.y);
    }
    
    collideStand(hitSprite,dist) {
        let y;
        
        if ((this.x+this.width)<=hitSprite.x) return(false);
        if (this.x>=(hitSprite.x+hitSprite.width)) return(false);
        
        y=this.y+dist;                // for stand on collisions, the bottom of the standing object must intersect the top and bottom of check sprite
        if (y<(hitSprite.y-hitSprite.height)) return(false);  
        return(this.y<((hitSprite.y-hitSprite.height)+dist));
    }
    
    collideRise(hitSprite,dist) {
        let y;
        
        if ((this.x+this.width)<=hitSprite.x) return(false);
        if (this.x>=(hitSprite.x+hitSprite.width)) return(false);
        
        y=(this.y-this.height)+dist;                // for rise on collisions, the top of the rising object must intersect the top and bottom of check sprite
        if (y>hitSprite.y) return(false);
        return(y>(hitSprite.y-hitSprite.height));
    }
    
    collideRect(lft,top,rgt,bot) {
        if ((this.x+this.width)<=lft) return(false);
        if (this.x>=rgt) return(false);
        if (this.y<=top) return(false);
        return((this.y-this.height)<bot);
    }
    
    moveWithCollision(mx,my) {
        this.x+=mx;
        this.y+=my;
        if (this.game.map.checkCollision(this)) {
            
            // if we collided with a tile, move the x so we are next to tile
            if (this.collideTileIdx!==-1) {
                if (mx>0) {
                    this.x=this.collideTileLeft-this.width;
                }
                else {
                    if (mx<0) {
                        this.x=this.collideTileRight;
                    }
                    else {
                        this.x-=mx;
                    }
                }
            }
            else {
                this.x-=mx;
            }

            this.y-=my;
            return(true);
        }
        return(false);
    }
    
    checkCollision() {
        return(this.game.map.checkCollision(this));
    }
    
    clampX(min,max) {
        if (this.x<min) this.x=min;
        if (this.x>max) this.x=max;
    }
    
    clampY(min,max) {
        if (this.y<min) this.y=min;
        if (this.y>max) this.y=max;
    }
    
    getMapWidth() {
        return(this.game.map.width);
    }
    
    getPlayerSprite() {
        return(this.game.map.getPlayerSprite());
    }
    
    distanceToSprite(sprite) {
        let x=sprite.x-this.x;
        let y=sprite.y-this.y;

        return(Math.trunc(Math.sqrt((x*x)+(y*y))));
    }
    
    findSpriteStandingOn() {
        return(this.game.map.findSpriteStandingOn(this));
    }
    
    getTileUnderSprite() {
        return(this.game.map.getTileUnderSprite(this));
    }
    
    countSpriteOfType(spriteClass) {
        return(this.game.map.countSpriteOfType(spriteClass));
    }
    
    playSound(name) {
        this.game.soundList.playAtSprite(name,this);
    }
    
    playSoundGlobal(name) {
        this.game.soundList.play(name);
    }

    getLiquidY() {
        return(this.game.map.getLiquidY());
    }

    setLiquidY(y) {
        this.game.map.setLiquidY(y);
    }

    moveLiquidTo(toLiquidY,liquidMoveSpeed) {
        this.game.map.moveLiquidTo(toLiquidY,liquidMoveSpeed);
    }
    
    isInLiquid() {
        let liquidY=this.getLiquidY();
        
        if (liquidY===-1) return(false);
        return(this.y>=liquidY);
    }
    
    isUnderLiquid() {
        let liquidY=this.getLiquidY();
        
        if (liquidY===-1) return(false);
        return((this.y-this.height)>=liquidY);
    }
    
    shakeMap(tickCount) {
        this.game.map.shake(tickCount);
    }
    
    runGravity() {
        let y;
        
        this.grounded=true;
        
        if (this.gravityFactor!==0.0) {

            y=-1;
            if (this.gravityMoveY>=0) {
                y=this.game.map.checkCollisionStand(this,Math.trunc(this.gravityAdd));
            }
            else {
                this.standSprite=null;
                this.standTileIdx=-1;
            }

            if (y===-1) {
                if (this.gravityPauseTick===0) {
                    this.y=Math.trunc(this.y+this.gravityAdd);
                    if (this.gravityAdd<=0.0) {
                        this.gravityAdd=this.gravityMinValue*this.gravityFactor;
                    }
                    else {
                        this.gravityAdd+=(this.gravityAdd*this.gravityFactor);
                    }
                    if (this.gravityAdd>this.gravityMaxValue) this.gravityAdd=this.gravityMaxValue;
                }
                else {
                    this.gravityPauseTick--;
                }
                this.grounded=false;
            }
            else {
                this.y=y;
                this.gravityAdd=0.0;
                this.grounded=true;
                this.gravityMoveY=0.0;
            }
        }
             
        // rising   
        if (this.gravityMoveY<0) {
            y=this.game.map.checkCollisionRise(this,this.gravityMoveY);
            if (y!==-1) {
                this.y=y+this.height;
                this.gravityMoveY=0;
            }
            else {
                this.y+=this.gravityMoveY;
            }
        }
        
        // gravity slows down extra motion
        if (this.gravityMoveY<0.0) {
            this.gravityMoveY+=this.gravityAdd;
            if (this.gravityMoveY>=0.0) {
                this.gravityAdd=this.gravityMoveY;
                if (this.gravityAdd>this.gravityMaxValue) this.gravityAdd=this.gravityMaxValue;
                this.gravityMoveY=0.0;
            }
        }
    }
    
    addGravity(gravityAdd,pauseTick) {
        this.gravityMoveY+=gravityAdd;
        this.gravityPauseTick=pauseTick;
    }
    
    getCurrentGravity() {
        return(this.gravityMoveY);
    }
    
    stopUpwardGravity() {
        if (this.gravityMoveY<0) this.gravityMoveY=0;
    }
    
    stopAllGravity() {
        this.gravityFactor=0.0
        this.gravityMoveY=0;
        this.gravityPauseTick=0;
    }
    
    clearInputState(inputConstant) {
        this.game.input.clearInputState(inputConstant);
    }
    
    getInputStateFloat(inputConstant) {
        return(this.game.input.getInputStateFloat(inputConstant));
    }
    
    getInputStateIsNegative(inputConstant) {
        return(this.game.input.getInputStateIsNegative(inputConstant));
    }
    
    getInputStateIsPositive(inputConstant) {
        return(this.game.input.getInputStateIsPositive(inputConstant));
    }
    
    getInputStateBoolean(inputConstant) {
        return(this.game.input.getInputStateBoolean(inputConstant));
    }
    
    delete() {
        this.removeFlag=true;
    }
    
    isDeleted() {
        return(this.removeFlag);
    }
    
    getData(name) {
        let val=this.data.get(name);
        return((val===undefined)?null:val);
    }
    
    setData(name,value) {
        this.data.set(name,value);
    }
    
    getCurrentSaveSlotData(name) {
        return(this.game.getCurrentSaveSlotData(name));
    }
    
    setCurrentSaveSlotData(name,value) {
        this.game.setCurrentSaveSlotData(name,value);
    }
    
    getCurrentSaveSlotDataCount(prefix) {
        return(this.game.getCurrentSaveSlotDataCount(prefix));
    }
    
    setCurrentSaveSlotDataIfLess(name,value) {
        this.game.setCurrentSaveSlotDataIfLess(name,value);
    }
    
    deleteCurrentSaveSlotData(name) {
        this.game.deleteCurrentSaveSlotData(name);
    }
    
    random() {
        return(RandomClass.random());
    }
    
    randomScaled(scale) {
        return(RandomClass.randomScaled(scale));
    }
    
    randomScaledInt(scale) {
        return(RandomClass.randomScaledInt(scale));
    }
    
    randomBoolean() {
        return(RandomClass.randomBoolean());
    }
    
    setCamera(cameraSprite,cameraType) {
        this.game.map.setCamera(cameraSprite,cameraType);
    }
    
    // event staging
    // we need to stage events so they only get called after the run, otherwise
    // they can interfere with the internal state during a run
    clearStageEvents() {
        this.eventCollideSprite=null;
        this.eventCollideTileIdx=-1;
        this.eventStandSprite=null;
        this.eventStoodSprite=null;
        this.eventStandTileIdx=-1;
        this.eventRiseIntoSprite=null;
        this.eventRiseIntoTileIdx=-1;        
    }
    
    runStageEvents() {
        if (this.eventCollideSprite!=null) this.onCollideSprite(this.eventCollideSprite);
        if (this.eventCollideTileIdx!==-1) this.onCollideTile(this.eventCollideTileX,this.eventCollideTileY,this.eventCollideTileIdx);
        if (this.eventStandSprite!=null) this.onStandOnSprite(this.eventStandSprite);
        if (this.eventStoodSprite!=null) this.onStoodOnSprite(this.eventStoodSprite);
        if (this.eventStandTileIdx!==-1) this.onStandOnTile(this.eventStandTileX,this.eventStandTileY,this.eventStandTileIdx);
        if (this.eventRiseIntoSprite!=null) this.onRiseIntoSprite(this.eventRiseIntoSprite);
        if (this.eventRiseIntoTileIdx!==-1) this.onRiseIntoTile(this.eventRiseIntoTileX,this.eventRiseIntoTileY,this.eventRiseIntoTileIdx);
    }

    stageEventCollideSprite(sprite) {
        this.eventCollideSprite=sprite;
    }
    
    stageEventCollideTile(x,y,tileIdx) {
        this.eventCollideTileX=x;
        this.eventCollideTileY=y;
        this.eventCollideTileIdx=tileIdx;
    }
    
    stageEventStandOnSprite(sprite) {
        this.eventStandSprite=sprite;
    }
    
    stageEventStoodOnSprite(sprite) {
        this.eventStoodSprite=sprite;
    }
    
    stageEventStandOnTile(x,y,tileIdx) {
        this.eventStandTileX=x;
        this.eventStandTileY=y;
        this.eventStandTileIdx=tileIdx;
    }
    
    stageEventRiseIntoSprite(sprite) {
        this.eventRiseIntoSprite=sprite;
    }
    
    stageEventRiseIntoTile(x,y,tileIdx) {
        this.eventRiseIntoTileX=x;
        this.eventRiseIntoTileY=y;
        this.eventRiseIntoTileIdx=tileIdx;
    }
    
    // draw sprite
    draw(ctx,offX,offY) {
        let alpha,hasTransform;
        let dx,dy,wid,high;
        let x=(this.x+this.drawOffsetX)-offX;
        let y=((this.y-this.height)+this.drawOffsetY)-offY;
        
        // clip anything offscreen
        if ((x>=this.game.canvasWidth) || ((x+this.width)<=0)) return;
        if ((y>=this.game.canvasHeight) || ((y+this.height)<=0)) return;
        
        // flashing
        alpha=this.alpha;
        if (this.flash) {
            alpha=(((this.game.tick/this.flashRate)&0x1)===0)?0.5:0.9;
        }
        
        // shaking
        if (this.shake) {
            if (((this.game.tick/this.shakePeriodTick)&0x1)===0) {
                x+=(this.game.randomScaled(this.shakeSize*2.0)-this.shakeSize);
                y+=(this.game.randomScaled(this.shakeSize*2.0)-this.shakeSize);
            }
        }
        
        // any transforms
        hasTransform=(this.flipX) || (this.flipY) || (alpha!==1.0);
        if (hasTransform) {
            ctx.save();
            
            if ((this.flipX) && (this.flipY)) {
                ctx.translate(Math.trunc(x+this.currentImage.width),Math.trunc(y+this.currentImage.height));
                ctx.scale(-1,-1);
                x=0;
                y=0;
            }
            else {
                if (this.flipX) {
                    ctx.translate(Math.trunc(x+this.currentImage.width),Math.trunc(y));
                    ctx.scale(-1,1);
                    x=0;
                    y=0;
                }
                else {
                    if (this.flipY) {
                        ctx.translate(Math.trunc(x),Math.trunc(y+this.currentImage.height));
                        ctx.scale(1,-1);
                        x=0;
                        y=0;
                    }
                }
            }
            
            if (alpha!==1.0) ctx.globalAlpha=alpha;
        }
        
        // any resize?
        if ((this.resizeX!==1.0) || (this.resizeY!==1.0)) {
            wid=Math.trunc(this.width*this.resizeX);
            dx=Math.trunc(x+((this.width-wid)/2));
            
            high=Math.trunc(this.height*this.resizeY); // resizeY is from floor
            dy=y+(this.height-high);
            
            ctx.drawImage(this.currentImage,dx,dy,wid,high);
        }

        // otherwise regular drawing
        else {
            ctx.drawImage(this.currentImage,Math.trunc(x),Math.trunc(y));
        }
        
        // restore any transforms
        if (hasTransform) {
            ctx.restore();
        }
    }
}
