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
        this.standSprite=null;
        this.standTileIdx=-1;
        this.riseSprite=null;
        this.riseTileIdx=-1;
        
        this.canCollide=true;
        this.canStandOn=true;
        this.canRiseBlock=true;
        
        this.removeFlag=false; // make this private
        
        // can't seal this object as it's extended
    }
    
    /**
     * Override this so editor can create another object of this type
     * at a given position.
     */
    duplicate(x,y) {
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
    mapStartup() {
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
     * Called when another sprite is interacting with this one, this
     * is up to the game developer what this means.
     */
    interactWithSprite(interactSprite,dataObj) {
    }
    
    /**
     * Override this to listen to messages from other sprites, this
     * is up to the game developer as how to use cmd and data.
     */
    processMessage(fromSprite, cmd, data) {
    }
    
    /**
     * Override this to change the per-tick AI of object.
     */
    run() {
    }
    
    sendMessage(toSprite,cmd,data) {
        toSprite.processMessage(this,cmd,data);
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
    
    addSprite(sprite) {
        return(this.game.map.addSprite(sprite));
    }
    
    addParticle(x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,imageName,count,rotateFactor,reverse,lifeTick) {
        return(this.game.map.addParticle(x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,imageName,count,rotateFactor,reverse,lifeTick));
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
            this.x-=mx;
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
    
    stopAllGravity() {
        this.gravityFactor=0.0
        this.gravityMoveY=0;
        this.gravityPauseTick=0;
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
    
    draw(ctx,offX,offY) {
        let alpha,hasTransform;
        let dx,dy,wid,high;
        let x=(this.x+this.drawOffsetX)-offX;
        let y=((this.y-this.height)+this.drawOffsetY)-offY;
        
        // clip anything offscreen
        if ((x>=this.game.canvasWidth) || ((x+this.width)<=0)) return;
        if ((y>=this.game.canvasHeight) || ((y+this.height)<=0)) return;
        
        // flashing
        alpha=1.0;
        if (this.flash) {
            alpha=(((this.game.tick/this.flashRate)&0x1)===0)?0.5:0.9;
        }
        
        // shaking
        if (this.shake) {
            if (((this.game.tick/this.shakePeriodTick)&0x1)===0) {
                x+=(Math.random()*(this.shakeSize*2.0))-this.shakeSize;
                y+=(Math.random()*(this.shakeSize*2.0))-this.shakeSize;
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
