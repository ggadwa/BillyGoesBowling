import OverlayClass from './overlay.js';
import SpriteClass from './sprite.js';
import ParticleClass from './particle.js';
import LiquidClass from './liquid.js';

export default class MapClass {

    static MAP_TILE_WIDTH=256;
    static MAP_TILE_HEIGHT=128;
    static MAP_TILE_SIZE=64;
    
    static CAMERA_TYPE_NONE=0;
    static CAMERA_TYPE_SIDESCROLL=1;
    static CAMERA_TYPE_OVERHEAD=2;
    static CAMERA_SIDESCROLL_NATURAL_MAP_HEIGHT_OFFSET=0.7;

    constructor(game) {
        this.game=game;
        this.name='';
        
        // variables
        this.width=MapClass.MAP_TILE_WIDTH*MapClass.MAP_TILE_SIZE;
        this.height=MapClass.MAP_TILE_HEIGHT*MapClass.MAP_TILE_SIZE;
        this.rightEdge=0;
        
        this.cameraSprite=null;
        this.cameraType=MapClass.CAMERA_TYPE_NONE;
        
        this.offsetX=0;
        this.offsetY=0;
        this.sideScrollMapY=0;
            
        this.liquid=null;
        
        this.shakeCount=-1;
        
        this.tileData=null; // tile data for map
        this.sprites=null; // sprites in map
        
        this.createTileData=null; // these are used to make the initial tile and sprite data, and moved to a working copy as they can change
        this.createSpriteData=null;
        
        this.playerSprite=null;
        
        this.overlays=[];
        this.particles=[];
    }
    
    initialize() {
        let x,y,edgeX;
        let sprite;
        
        // now copy the create arrays to the working arrays
        this.tileData=this.getTileData();
        this.sprites=this.getSpriteData();
        
        // find the player sprite
        this.playerSprite=null;
        for (sprite of this.sprites) {
            if ((sprite.isPlayer()) && (this.playerSprite==null)) this.playerSprite=sprite;
        }
        
        if (this.playerSprite==null) console.log('No player in map');
        
        // find the right edge of map
        this.rightEdge=0;
        
        for (y=0;y!==MapClass.MAP_TILE_HEIGHT;y++) {
            for (x=(MapClass.MAP_TILE_WIDTH-1);x>0;x--) {
                if (this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]!==0) {
                    edgeX=x*MapClass.MAP_TILE_SIZE;
                    if (edgeX>this.rightEdge) this.rightEdge=edgeX;
                    break;
                }
            }
        }
        
        // clear any overlays
        this.overlays=[];

        // call any custom map startup
        this.onMapStart();

        for (sprite of this.sprites) {
            sprite.onMapStart();
        }
    }
    
    /**
     * Override this to return a Uint16Array of MAP_TILE_WIDTH*MAP_TILE_HEIGHT that is the tile list for the map.
     */
    getTileData() {
        return(null);
    }
    
    /**
     * Override this to return an array of sprites in the map.
     */
    getSpriteData() {
        return(null);
    }
    
    /**
     * Override this to deal with any setup when a map is started, like
     * moving sprites around for save states, etc.  All sprites in a map
     * also get this call.
     */
    onMapStart() {   
    }
    
    /**
     * Override this to detected when a liquid movement
     * has finished.
     */
    onLiquidMoveDone() {
    }
        
    /**
     * Override this for once per tick processing.
     */
    onRun(tick) { 
    }
    
    /**
     * Adds a sprite in-game.
     * 
     * @param {typeClass} The sprite to add to the map
     * @returns The sprite
     */
    addSprite(typeClass,x,y,data) {
        let sprite=Reflect.construct(typeClass,[this.game,x,y,data]);
        this.sprites.push(sprite);
        return(sprite);
    }
    
    getPlayerSprite() {
        return(this.playerSprite);
    }
    
    getSpritesOfType(typeClass) {
        let sprite;
        let list=[];

        for (sprite of this.sprites) {
            if (sprite instanceof typeClass) list.push(sprite);
        }
        
        return(list);
    }
    
    getFirstSpriteOfType(typeClass) {
        let sprite;

        for (sprite of this.sprites) {
            if (sprite instanceof typeClass) return(sprite);
        }
        
        return(null);
    }
    
    getFirstSpriteWithData(name,value) {
        let sprite;

        for (sprite of this.sprites) {
            if (sprite.data.get(name)===value) return(sprite);
        }
        
        return(null);
    }
    
    addParticle(x,y,particleDef) {
        let particle;
        
        particle=new ParticleClass(this.game,x,y,particleDef);
        this.particles.push(particle);
        particle.start();
        
        return(particle);
    }
    
    addOverlay(overlayDef) {
        let overlay;
        
        overlay=new OverlayClass(this.game,overlayDef);
        this.overlays.push(overlay);
        overlay.start();
    }
    
    changeTile(x,y,tileIdx) {
        this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]=tileIdx;
    }
    
    shake(tickCount) {
        if (this.shakeCount!==-1) {
            if (tickCount<this.shakeCount) return;
        }
        this.shakeCount=tickCount;
    }
    
    playSoundGlobal(name) {
        this.game.soundList.play(name);
    }
    
    addLiquid(imgTop,imgFill,y,waveSize) {
        this.liquid=new LiquidClass(this,imgTop,imgFill,y,waveSize);
    }
    
    /**
     * Get current liquid height.
     */
    getLiquidY() {
        if (this.liquid==null) return(-1);
        return(this.liquid.getY());
    }
    
    /**
     * Set liquid height.
     */
    setLiquidY(y) {
        if (this.liquid!=null) this.liquid.setY(y);
    }
    
    /**
     * Start a liquid movement.
     */
    moveLiquidTo(toY,moveSpeed) {
        if (this.liquid!=null) this.liquid.moveLiquidTo(toY,moveSpeed);
    }
    
    isInIgnoreList(sprite,ignoreList) {
        let ignore,ignoreClass;
        
        if (ignoreList==null) return(false);

        ignore=false;

        for (ignoreClass of ignoreList) {
            if (sprite instanceof ignoreClass) return(true);
        }

        return(false);
    }
    
    checkCollision(checkSprite) {
        let sprite,tileIdx,ignoreTileIdx;
        let ignore;
        let lx,rx,ty,by,dx,dy,gx,gy;
        let lft,top,rgt,bot;
        
        // clear flags
        checkSprite.collideSprite=null;
        checkSprite.collideTileIdx=-1;
        
        // check sprites
        for (sprite of this.sprites) {
            if (sprite===checkSprite) continue;
            if (!sprite.show) continue;
            if (!sprite.canCollide) continue;
            
            // check collision first, this is probably faster
            if (!checkSprite.collide(sprite)) continue;
            
            // now check ignore list
            if (this.isInIgnoreList(sprite,checkSprite.spriteClassCollideIgnoreList)) continue;
            if (this.isInIgnoreList(checkSprite,sprite.spriteClassCollideIgnoreList)) continue;
             
            // otherwise it is a hit
            checkSprite.collideSprite=sprite;
            sprite.stageEventCollideSprite(checkSprite);
            checkSprite.stageEventCollideSprite(sprite);
            return(true);
        }
        
        // check map
        lft=checkSprite.x;
        top=checkSprite.y-checkSprite.height;
        rgt=checkSprite.x+checkSprite.width;
        bot=checkSprite.y;
            
        lx=Math.trunc(lft/MapClass.MAP_TILE_SIZE);
        if (lx<0) lx=0;
        rx=Math.trunc(rgt/MapClass.MAP_TILE_SIZE)+1;
        if (rx>MapClass.MAP_TILE_WIDTH) rx=MapClass.MAP_TILE_WIDTH;
        
        ty=Math.trunc(top/MapClass.MAP_TILE_SIZE);
        if (ty<0) ty=0;
        
        by=Math.trunc(bot/MapClass.MAP_TILE_SIZE);
        if (by>MapClass.MAP_TILE_HEIGHT) by=MapClass.MAP_TILE_HEIGHT;
        
        for (gy=ty;gy<=by;gy++) {
                
            dy=gy*MapClass.MAP_TILE_SIZE;
            if ((bot<=dy) || (top>(dy+MapClass.MAP_TILE_SIZE))) continue;

            for (gx=lx;gx<=rx;gx++) {
                tileIdx=this.tileData[(gy*MapClass.MAP_TILE_WIDTH)+gx];
                if (tileIdx===0) continue;
                
                dx=gx*MapClass.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+MapClass.MAP_TILE_SIZE))) continue;
                
                // now check ignore list
                if (checkSprite.tileIndexIgnoreList!=null) {
                    ignore=false;

                    for (ignoreTileIdx of checkSprite.tileIndexIgnoreList) {
                        if (tileIdx===ignoreTileIdx) {
                            ignore=true;
                            break;
                        }
                    }

                    if (ignore) continue;
                }
                
                // tile contact
                checkSprite.collideTileIdx=tileIdx;
                checkSprite.collideTileLeft=dx;
                checkSprite.collideTileRight=dx+MapClass.MAP_TILE_SIZE;
                checkSprite.stageEventCollideTile(gx,gy,tileIdx);
                
                return(true);
            }
        }
        
        return(false);
    }
    
    checkCollisionStand(checkSprite,dist) {
        let sprite,tileIdx,ignoreTileIdx,ignoreClass;
        let ignore;
        let ty=-1;
        let y,dx,dy,gx,gy,leftTileX,rightTileX;
        let lft,top,rgt,bot;
        
        // always fall at least 1
        if (dist<1) dist=1;
        
        // clear flags
        checkSprite.standSprite=null;
        checkSprite.standTileIdx=-1;
        
        // check sprites
        for (sprite of this.sprites) {
            if (sprite===checkSprite) continue;
            if (!sprite.show) continue;
            if (!sprite.canStandOn) continue;
            
            if (checkSprite.collideStand(sprite,dist)) {
                y=sprite.y-sprite.height;
                if ((y<ty) || (ty===-1)) {
                    
                    // now check ignore list
                    if (this.isInIgnoreList(sprite,checkSprite.spriteClassStandOnIgnoreList)) continue;
                    if (this.isInIgnoreList(checkSprite,sprite.spriteClassStandOnIgnoreList)) continue;

                    // standing on sprite
                    checkSprite.standSprite=sprite;
                    checkSprite.stageEventStandOnSprite(sprite);
                    sprite.stageEventStoodOnSprite(checkSprite);
                    ty=y;
                }
            }
        }
        
        // any collision with a sprite
        // outweights any map collision because
        // we expect objects to be outside of map
        // to hit another sprite
        if (ty!==-1) return(ty);
        
        // check map
        lft=checkSprite.x;
        top=(checkSprite.y-checkSprite.height)+dist;
        rgt=checkSprite.x+checkSprite.width;
        bot=checkSprite.y+dist;
        
        leftTileX=Math.trunc(lft/MapClass.MAP_TILE_SIZE)-1;
        rightTileX=Math.trunc(rgt/MapClass.MAP_TILE_SIZE)+1;
        y=Math.trunc(bot/MapClass.MAP_TILE_SIZE);
        
        if (leftTileX<0) leftTileX=0;
        if (y<0) y=0;
        if (rightTileX>MapClass.MAP_TILE_WIDTH) rightTileX=MapClass.MAP_TILE_WIDTH-1;
        if ((y+2)>MapClass.MAP_TILE_HEIGHT) y=MapClass.MAP_TILE_HEIGHT-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            
            dy=gy*MapClass.MAP_TILE_SIZE;
            if ((bot<dy) || (bot>((dy+MapClass.MAP_TILE_SIZE)+dist))) continue;              

            for (gx=leftTileX;gx<rightTileX;gx++) {
                tileIdx=this.tileData[(gy*MapClass.MAP_TILE_WIDTH)+gx];
                if (tileIdx===0) continue;
                
                dx=gx*MapClass.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+MapClass.MAP_TILE_SIZE))) continue;
                
                if ((dy<ty) || (ty===-1)) {
                    
                    // now check ignore list
                    if (checkSprite.tileIndexIgnoreList!=null) {
                        ignore=false;

                        for (ignoreTileIdx of checkSprite.tileIndexIgnoreList) {
                            if (tileIdx===ignoreTileIdx) {
                                ignore=true;
                                break;
                            }
                        }

                        if (ignore) continue;
                    }

                    // standing on
                    checkSprite.standSprite=null;
                    checkSprite.standTileIdx=tileIdx;
                    checkSprite.stageEventStandOnTile(gx,gy,tileIdx);
                    ty=dy;
                }
            }
        }
        
        return(ty);
    }
    
    checkCollisionRise(checkSprite,dist) {
        let sprite,tileIdx,ignoreTileIdx;
        let ignore;
        let ty=-1;
        let x,y,dx,dy,gx,gy,leftTileX,rightTileX;
        let lft,top,rgt,bot;
        
        // clear flags
        checkSprite.riseSprite=null;
        checkSprite.riseTileIdx=-1;
        
        // check sprites
        for (sprite of this.sprites) {
            if (sprite===checkSprite) continue;
            if (!sprite.show) continue;
            if (!sprite.canRiseBlock) continue;
            
            if (checkSprite.collideRise(sprite,dist)) {
                y=sprite.y;
                if ((y<ty) || (ty===-1)) {
                    
                    // now check ignore list
                    if (this.isInIgnoreList(sprite,checkSprite.spriteClassCollideIgnoreList)) continue;
                    if (this.isInIgnoreList(checkSprite,sprite.spriteClassCollideIgnoreList)) continue;
                    
                    // rise collision
                    checkSprite.riseSprite=sprite;
                    checkSprite.stageEventRiseIntoSprite(sprite);
                    ty=y;
                }
            }
        }
        
        // any collision with a sprite
        // outweights any map collision because
        // we expect objects to be outside of map
        // to hit another sprite  
        if (ty!==-1) return(ty);
        
        // check map
        lft=checkSprite.x;
        top=(checkSprite.y-checkSprite.height)+dist;
        rgt=checkSprite.x+checkSprite.width;
        bot=checkSprite.y+dist;
        
        leftTileX=Math.trunc(lft/MapClass.MAP_TILE_SIZE)-1;
        rightTileX=Math.trunc(rgt/MapClass.MAP_TILE_SIZE)+1;
        y=Math.trunc(top/MapClass.MAP_TILE_SIZE);
        
        if (leftTileX<0) leftTileX=0;
        if (y<0) y=0;
        rightTileX=Math.trunc(rgt/MapClass.MAP_TILE_SIZE)+1;
        if ((y+2)>MapClass.MAP_TILE_HEIGHT) y=MapClass.MAP_TILE_HEIGHT-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            
            dy=gy*MapClass.MAP_TILE_SIZE;
            if ((top<(dy+dist)) || (top>(dy+MapClass.MAP_TILE_SIZE))) continue;              

            for (gx=leftTileX;gx<rightTileX;gx++) {
                tileIdx=this.tileData[(gy*MapClass.MAP_TILE_WIDTH)+gx];
                if (tileIdx===0) continue;
                
                dx=gx*MapClass.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+MapClass.MAP_TILE_SIZE))) continue;
                
                if ((dy<ty) || (ty===-1)) {
                    // now check ignore list
                    if (checkSprite.tileIndexIgnoreList!=null) {
                        ignore=false;

                        for (ignoreTileIdx of checkSprite.tileIndexIgnoreList) {
                            if (tileIdx===ignoreTileIdx) {
                                ignore=true;
                                break;
                            }
                        }

                        if (ignore) continue;
                    }
                    
                    // rise collision
                    checkSprite.riseSprite=null;
                    checkSprite.riseTileIdx=tileIdx;
                    checkSprite.stageEventRiseIntoTile(gx,gy,tileIdx);
                    ty=dy+MapClass.MAP_TILE_SIZE;
                }
            }
        }
        
        return(ty);
    }
    
    findSpriteStandingOn(checkSprite) {
        let sprite;

        for (sprite of this.sprites) {
            if (sprite===checkSprite) continue;
            if (sprite.standSprite===checkSprite) return(sprite);
        }
        
        return(null);
    }
    
    getSpritesWithinBox(lft,top,rgt,bot,ignoreSprite,filterClass) {
        let sprite;
        let sprites=[];
            
        for (sprite of this.sprites) {
            if (!sprite.show) continue;

            if (ignoreSprite!==null) {
                if (sprite===ignoreSprite) continue;
            }
            if (filterClass!==null) {
                if (!(sprite instanceof filterClass)) continue;
            }
            
            if (sprite.collideRect(lft,top,rgt,bot)) sprites.push(sprite);
        }
        
        return(sprites);
    }
    
    getTileUnderSprite(checkSprite) {
        let x=Math.trunc((checkSprite.x+Math.trunc(checkSprite.width*0.5))/MapClass.MAP_TILE_SIZE);
        let y=Math.trunc((checkSprite.y+1)/MapClass.MAP_TILE_SIZE);
        
        return(this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]);
    }
    
    countSpriteOfType(spriteClass) {
        let sprite;
        let count=0;

        for (sprite of this.sprites) {
            if (sprite instanceof spriteClass) count++;
        }
        
        return(count);
    }
    
    getMapViewportLeftEdge() {
        let sprite,x;
        let wid=this.game.canvasWidth;

        x=this.playerSprite.x-Math.trunc(wid*0.5);
        if (x<0) x=0;
        
        return(x);
    }
    
    getMapViewportRightEdge() {
        return(this.getMapViewportLeftEdge()+this.game.canvasWidth);
    }
    
    getMapViewportTopEdge() {
        let y;
        let high=this.game.canvasHeight;

        y=this.playerSprite.y-Math.trunc(high*0.5);
        if (y<0) y=0;
        
        return(y);
    }
    
    getMapViewportBottomEdge() {
        return(this.getMapViewportTopEdge()+this.game.canvasHeight);
    }
    
    // cameras
    setCamera(cameraSprite,cameraType) {
        this.cameraSprite=cameraSprite;
        this.cameraType=cameraType;
        
        this.resetCamera();
    }
    
    resetCamera() {
        this.sideScrollMapY=this.cameraSprite.y-Math.trunc(this.game.canvasHeight*MapClass.CAMERA_SIDESCROLL_NATURAL_MAP_HEIGHT_OFFSET);
    }
    
    cameraCalcOffset() {
        // no camera sprite or none camera, do nothing
        if ((this.cameraSprite==null) || (this.cameraType===MapClass.CAMERA_TYPE_NONE)) {
            this.offsetX=0;
            this.offsetY=0;
            return;
        }
        
        // other modes
        switch (this.cameraType) {
            case MapClass.CAMERA_TYPE_SIDESCROLL:
                this.cameraCalcOffsetSideScroll();
                break;
            case MapClass.CAMERA_TYPE_OVERHEAD:
                this.cameraCalcOffsetOverHead();
                break;
        }
    }
            
    cameraCalcOffsetSideScroll() {
        let offX,offY,playerY;
        let wid=this.game.canvasWidth;
        let rgt=this.game.map.width-wid;
        let high=this.game.canvasHeight;
        let bot=this.game.map.height-high;
        
        // the X offset follows the sprite
        offX=this.cameraSprite.x-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        this.offsetX=offX;
        
        // we only change the current
        // map Y if the sprite gets too close to edges
        playerY=this.cameraSprite.y-(this.cameraSprite.height*2);
        if (playerY<this.sideScrollMapY) this.sideScrollMapY=playerY;
        
        playerY=this.cameraSprite.y-Math.trunc(high*MapClass.CAMERA_SIDESCROLL_NATURAL_MAP_HEIGHT_OFFSET);
        if (playerY>this.sideScrollMapY) this.sideScrollMapY=playerY;
        
        offY=this.sideScrollMapY;
        if (offY<0) offY=0;
        if (offY>bot) offY=bot;
        
        this.offsetY=offY;
    }
    
    cameraCalcOffsetOverHead() {
        let offX,offY;
        let wid=this.game.canvasWidth;
        let rgt=this.game.map.width-wid;
        let high=this.game.canvasHeight;
        let bot=this.game.map.height-high;
        
        // the offset tries to center on the sprite
        offX=(this.cameraSprite.x+Math.trunc(this.cameraSprite.width*0.5))-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        this.offsetX=offX;
        
        offY=(this.cameraSprite.y-Math.trunc(this.cameraSprite.height*0.5))-Math.trunc(high*0.5);
        if (offY<0) offY=0;
        if (offY>bot) offY=bot;
        
        this.offsetY=offY;
    }

    // internal run loop
    runInternal(tick) {
        let n;
        let sprite;
        
        // project event
        this.onRun(tick);
        
        // liquids
        if (this.liquid!=null) {
            if (this.liquid.runInternal(tick)) {
                this.onLiquidMoveDone();
            }
        }
        
        // clear all the events, events are staged until
        // the run finishes so they don't effect state within a run
        for (sprite of this.sprites) {
            sprite.clearStageEvents();
        }
        
        // run through all the sprites   
        for (sprite of this.sprites) {
            sprite.onRun(tick); 
        }
        
        // now run the events
        for (sprite of this.sprites) {
            sprite.runStageEvents();
        }
        
        // delete any finished sprites
        n=0;
        while (n<this.sprites.length) {
            if (this.sprites[n].isDeleted()) {
                this.sprites.splice(n,1);
            }
            else {
                n++;
            }
        }
        
        // delete any finished particles
        n=0;
        while (n<this.particles.length) {
            if (this.particles[n].isFinished()) {
                this.particles.splice(n,1);
            }
            else {
                n++;
            }
        }
    }
    
    draw(ctx) {
        let x,y,offX,offY;
        let lx,rx,ty,by;
        let overlay,tile,sprite,particle;
        let tilePerWidth,tilePerHeight;
        
        // get the map offsets
        this.cameraCalcOffset();
        
        if (this.shakeCount!==-1) {
            this.shakeCount--;
            
            this.offsetY+=(5-(Math.random()*10));
        }
        
        // need to make sure stuff lands on pixels
        offX=Math.trunc(this.offsetX);
        offY=Math.trunc(this.offsetY);

        // background overlays
        for (overlay of this.overlays) {
            if (overlay.def.layer===OverlayClass.BACKGROUND_LAYER) overlay.draw(ctx,offX,offY);
        }
        
        // liquids
        if (this.liquid!=null) this.liquid.draw(ctx,offX,offY);

        // draw the under the map sprites
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.layer===sprite.UNDER_MAP_TILES_LAYER)) sprite.draw(ctx,offX,offY);
        }
        
        // draw size
        tilePerWidth=Math.trunc(this.game.canvasWidth/MapClass.MAP_TILE_SIZE);
        tilePerHeight=Math.trunc(this.game.canvasHeight/MapClass.MAP_TILE_SIZE);
            
        // draw the map
        lx=Math.trunc(offX/MapClass.MAP_TILE_SIZE)-1;
        if (lx<0) lx=0;
        
        rx=(lx+tilePerWidth)+2;
        if (rx>MapClass.MAP_TILE_WIDTH) rx=MapClass.MAP_TILE_WIDTH;
        
        ty=Math.trunc(offY/MapClass.MAP_TILE_SIZE)-1;
        if (ty<0) ty=0;
        
        by=(ty+tilePerHeight)+2;
        if (by>MapClass.MAP_TILE_HEIGHT) by=MapClass.MAP_TILE_HEIGHT;
        
        for (y=ty;y<by;y++) {
            
            for (x=lx;x<rx;x++) {
                tile=this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x];
                if (tile===0) continue;
                
                ctx.drawImage(this.game.tileImageList[tile-1],((x*MapClass.MAP_TILE_SIZE)-offX),((y*MapClass.MAP_TILE_SIZE)-offY));
            }
        }
        
        // draw the before sprite particles
        for (particle of this.particles) {
            if (particle.def.layer===ParticleClass.BEFORE_SPRITES_LAYER) particle.draw(ctx,offX,offY);
        }
        
        // draw the background sprites
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.layer===sprite.BACKGROUND_LAYER)) sprite.draw(ctx,offX,offY);
        }
        
        // draw the foreground sprites
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.layer===sprite.FOREGROUND_LAYER)) sprite.draw(ctx,offX,offY);
        }
        
        // draw the after sprite particles
        for (particle of this.particles) {
            if (particle.def.layer===ParticleClass.AFTER_SPRITES_LAYER) particle.draw(ctx,offX,offY);
        }
        
        // foreground overlays
        for (overlay of this.overlays) {
            if (overlay.def.layer===OverlayClass.FOREGROUND_LAYER) overlay.draw(ctx,offX,offY);
        }
    }
    
}
