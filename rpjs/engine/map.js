import BackgroundClass from './background.js';
import SpriteClass from './sprite.js';
import ParticleClass from './particle.js';

export default class MapClass {

    static MAP_TILE_WIDTH=256;
    static MAP_TILE_HEIGHT=128;
    static MAP_TILE_SIZE=64;

    constructor(game) {
        this.game=game;
        this.name='';
        
        // variables
        this.width=MapClass.MAP_TILE_WIDTH*MapClass.MAP_TILE_SIZE;
        this.height=MapClass.MAP_TILE_HEIGHT*MapClass.MAP_TILE_SIZE;
        this.rightEdge=0;
        
        this.offsetX=0;
        this.offsetY=0;
        
        this.backgrounds=[];
        
        this.liquidY=-1; // liquid settings of map (-1 for no liquid)
        this.liquidWaveHeight=5;
        this.liquidRTintFactor=0.3;
        this.liquidGTintFactor=0.3;
        this.liquidBTintFactor=1.0;
        this.liquidTintDarken=0.001;
        
        this.toLiquidY=-1;
        this.liquidMoveSpeed=0;
        
        this.shakeCount=-1;
        
        this.tileData=null; // tile data for map
        this.sprites=null; // sprites in map
        
        this.createTileData=null;
        this.createSpriteData=null; // we have a creation copy (the editor makes) and a working copy, as game play changes these
        
        this.playerIdx=-1;
        
        this.particles=[];
    }
    
    initialize() {
        let n,x,y,edgeX;
        let sprite;
        
        // create the map
        this.create();
        
        // now copy the create arrays to the working arrays
        this.tileData=this.createTileData.slice();
        this.sprites=this.createSprites.slice();
        
        // call all the sprite map enter
        this.playerIdx=-1;
        
        for (n=0;n!==this.sprites.length;n++) {
            sprite=this.sprites[n];

            sprite.mapStartup();
            if ((sprite.isPlayer()) && (this.playerIdx===-1)) this.playerIdx=n;
        }
        
        if (this.playerIdx===-1) console.log('No player in map');
        
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
        
        // clear any backgrouns
        this.backgrounds=[];

        // call any custom map startup
        this.mapStartup();
    }
    
    /**
     * Override this to fill in the map data, which is the tile list
     * and sprites.
     */
    create() {
    }
    
    /**
     * Adds a sprite in-game.
     * 
     * @param {SpriteClass} The sprite to add to the map
     * @returns {number} The index of the sprite (do not save, can change)
     */
    addSprite(sprite) {
        return(this.sprites.push(sprite)-1);
    }
    
    removeSprite(spriteIdx) {
        this.sprites.splice(spriteIdx,1);
    }
    
    getSprite(spriteIdx) {
        return(this.sprites[spriteIdx]);
    }
    
    getPlayerSprite() {
        return(this.sprites[this.playerIdx]);
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
    
    addParticle(x,y,layer,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,imageName,count,rotateFactor,reverse,lifeTick) {
        let img,particle;
        
        img=this.game.imageList.get(imageName);
        if (img===undefined) {
            console.log('Unknown particle image png: '+imageName);
            return;
        }
        
        particle=new ParticleClass(this.game,x,y,layer,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,img,count,rotateFactor,reverse,lifeTick);
        this.particles.push(particle);
        
        return(particle);
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
    
    /**
     * Adds a single parallax background image to this map, to be drawn
     * in add order.  Y is the y offset to draw at, and xFactor is how it moves
     * along with the horizontal movement.  0.0 is no movement, 1.0 is movement
     * at the same speed
     */
    addParallaxBackground(img,y,xFactor) {
        this.backgrounds.push(new BackgroundClass(this,img,0,y,xFactor,0.0,0.0,0.0,false));
    }
    
    /**
     * Adds a single tile background image to this map.  xFactor/yFactor is how
     * it follows the camera, and xScroll/yScroll is any automatic scrolling.
     */
    addTileBackground(img,xFactor,yFactor,xScroll,yScroll) {
        this.backgrounds.push(new BackgroundClass(this,img,0,0,xFactor,yFactor,xScroll,yScroll,true));
    }
    
    /**
     * Override this to deal with any setup when a map is started, like
     * moving sprites around for save states, etc.  All sprites in a map
     * also get this call.
     */
    mapStartup() {   
    }
    
    /**
     * Override this to set this.offsetX and this.offsetY which set the
     * top left coordinate of the map when drawing.  It's called every frame before
     * drawing the map.
     */
    calcOffset() {
    }
    
    /**
     * Get current liquid height.
     */
    getLiquidY() {
        return(this.liquidY);
    }
    
    /**
     * Set liquid height.
     */
    setLiquidY(y) {
        this.liquidY=y;
    }
    
    /**
     * Start a liquid movement.
     */
    moveLiquidTo(toLiquidY,liquidMoveSpeed) {
        this.toLiquidY=toLiquidY;
        this.liquidMoveSpeed=liquidMoveSpeed;
    }
    
    /**
     * Override this to detected when a liquid movement
     * has finished.
     */
    onLiquidMoveDone() {
    }
    
    checkCollision(checkSprite) {
        let sprite,tileIdx,ignoreTileIdx;
        let ignore,ignoreClass;
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
            if (checkSprite.spriteClassIgnoreList!=null) {
                ignore=false;

                for (ignoreClass of checkSprite.spriteClassIgnoreList) {
                    if (sprite instanceof ignoreClass) {
                        ignore=true;
                        break;
                    }
                }

                if (ignore) continue;
            }
            
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
        let x,y,dx,dy,gx,gy,leftTileX,rightTileX;
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
                    if (checkSprite.spriteClassIgnoreList!=null) {
                        ignore=false;

                        for (ignoreClass of checkSprite.spriteClassIgnoreList) {
                            if (sprite instanceof ignoreClass) {
                                ignore=true;
                                break;
                            }
                        }

                        if (ignore) continue;
                    }

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
        let sprite,tileIdx,ignoreTileIdx,ignoreClass;
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
                    if (checkSprite.spriteClassIgnoreList!=null) {
                        ignore=false;

                        for (ignoreClass of checkSprite.spriteClassIgnoreList) {
                            if (sprite instanceof ignoreClass) {
                                ignore=true;
                                break;
                            }
                        }

                        if (ignore) continue;
                    }
                    
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
    
    getMapViewportLeftEdge() {
        let sprite,x;
        let wid=this.game.canvasWidth;

        sprite=this.sprites[this.playerIdx];
        x=sprite.x-Math.trunc(wid*0.5);
        if (x<0) x=0;
        
        return(x);
    }
    
    getMapViewportRightEdge() {
        return(this.getMapViewportLeftEdge()+this.game.canvasWidth);
    }
    
    getMapViewportTopEdge() {
        let sprite,y;
        let high=this.game.canvasHeight;

        sprite=this.sprites[this.playerIdx];
        y=sprite.y-Math.trunc(high*0.5);
        if (y<0) y=0;
        
        return(y);
    }
    
    getMapViewportBottomEdge() {
        return(this.getMapViewportTopEdge()+this.game.canvasHeight);
    }
    
    onRun(tick) {
        let n;
        let sprite;
        
        // move any liquid
        if (this.toLiquidY!==-1) {
            if (this.toLiquidY<this.liquidY) {
                this.liquidY-=this.liquidMoveSpeed;
                if (this.liquidY<this.toLiquidY) {
                    this.liquidY=this.toLiquidY;
                    this.toLiquidY=-1;
                    this.onLiquidMoveDone();
                }
            }
            else {
                this.liquidY+=this.liquidMoveSpeed;
                if (this.liquidY>this.toLiquidY) {
                    this.liquidY=this.toLiquidY;
                    this.toLiquidY=-1;
                    this.onLiquidMoveDone();
                }
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
                if (n<this.playerIdx) this.playerIdx--;     // make sure player index doesn't change
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
        let x,y;
        let lx,rx,ty,by;
        let background,tile,sprite,particle;
        let tilePerWidth,tilePerHeight;
        
        // get the map offsets
        this.calcOffset();
        
        if (this.shakeCount!==-1) {
            this.shakeCount--;
            
            this.offsetY+=(5-(Math.random()*10));
        }
        
        // backgrounds
        for (background of this.backgrounds) {
            background.draw(ctx);
        }
        
        // draw the under the map sprites
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.layer===sprite.UNDER_MAP_TILES_LAYER)) sprite.draw(ctx,this.offsetX,this.offsetY);
        }
        
        // draw size
        tilePerWidth=Math.trunc(this.game.canvasWidth/MapClass.MAP_TILE_SIZE);
        tilePerHeight=Math.trunc(this.game.canvasHeight/MapClass.MAP_TILE_SIZE);
            
        // draw the map
        lx=Math.trunc(this.offsetX/MapClass.MAP_TILE_SIZE)-1;
        if (lx<0) lx=0;
        
        rx=(lx+tilePerWidth)+2;
        if (rx>MapClass.MAP_TILE_WIDTH) rx=MapClass.MAP_TILE_WIDTH;
        
        ty=Math.trunc(this.offsetY/MapClass.MAP_TILE_SIZE)-1;
        if (ty<0) ty=0;
        
        by=(ty+tilePerHeight)+2;
        if (by>MapClass.MAP_TILE_HEIGHT) by=MapClass.MAP_TILE_HEIGHT;
        
        for (y=ty;y<by;y++) {
            
            for (x=lx;x<rx;x++) {
                tile=this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x];
                if (tile===0) continue;
                
                ctx.drawImage(this.game.tileImageList[tile-1],((x*MapClass.MAP_TILE_SIZE)-this.offsetX),((y*MapClass.MAP_TILE_SIZE)-this.offsetY));
            }
        }
        
        // draw the before sprite particles
        for (particle of this.particles) {
            if (particle.layer===ParticleClass.BEFORE_SPRITES_LAYER) particle.draw(ctx,this.offsetX,this.offsetY);
        }
        
        // draw the background sprites
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.layer===sprite.BACKGROUND_LAYER)) sprite.draw(ctx,this.offsetX,this.offsetY);
        }
        
        // draw the foreground sprites
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.layer===sprite.FOREGROUND_LAYER)) sprite.draw(ctx,this.offsetX,this.offsetY);
        }
        
        // draw the after sprite particles
        for (particle of this.particles) {
            if (particle.layer===ParticleClass.AFTER_SPRITES_LAYER) particle.draw(ctx,this.offsetX,this.offsetY);
        }
    }
    
}
