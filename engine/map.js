import SpriteClass from './sprite.js';
import ParticleClass from './particle.js';

export default class MapClass
{
    constructor(game)
    {
        this.game=game;
        
            // constants
            
        this.MAP_TILE_WIDTH=256;        // todo -- these are here until we can have static class fields (replace with Map.X)
        this.MAP_TILE_HEIGHT=128;
        this.MAP_TILE_SIZE=64;
        
            // variables
            
        this.width=this.MAP_TILE_WIDTH*this.MAP_TILE_SIZE;
        this.height=this.MAP_TILE_HEIGHT*this.MAP_TILE_SIZE;
        this.rightEdge=0;
        
        this.offsetX=0;
        this.offsetY=0;
        
        this.liquidY=-1;                 // liquid settings of map (-1 for no liquid)
        this.liquidWaveHeight=5;
        this.liquidRTintFactor=0.3;
        this.liquidGTintFactor=0.3;
        this.liquidBTintFactor=1.0;
        this.liquidTintDarken=0.001;
        
        this.toLiquidY=-1;
        this.liquidMoveSpeed=0;
        
        this.shakeCount=-1;
        
        this.tileData=null;             // tile data for map
        this.sprites=null;              // sprites in map
        
        this.createTileData=null;
        this.createSpriteData=null;     // we have a creation copy (the editor makes) and a working copy, as game play changes these
        
        this.playerIdx=-1;
        
        this.particles=[];
    }
    
    initialize()
    {
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
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            for (x=(this.MAP_TILE_WIDTH-1);x>0;x--) {
                if (this.tileData[(y*this.MAP_TILE_WIDTH)+x]!==0) {
                    edgeX=x*this.MAP_TILE_SIZE;
                    if (edgeX>this.rightEdge) this.rightEdge=edgeX;
                    break;
                }
            }
        }

            // call any custom map startup
            
        this.mapStartup();
    }
    
    /**
     * Override this to return the map name.
     */
    getMapName()
    {
        return('');
    }
    
    /**
     * Override this to fill in the map data, which is the tile list
     * and sprites.
     */
    create()
    {
    }
    
    /**
     * Adds a sprite in-game.
     * 
     * @param {SpriteClass} The sprite to add to the map
     * @returns {number} The index of the sprite (do not save, can change)
     */
    addSprite(sprite)
    {
        return(this.sprites.push(sprite)-1);
    }
    
    removeSprite(spriteIdx)
    {
        this.sprites.splice(spriteIdx,1);
    }
    
    getSprite(spriteIdx)
    {
        return(this.sprites[spriteIdx]);
    }
    
    getSpritePlayer()
    {
        return(this.sprites[this.playerIdx]);
    }
    
    getSpritesOfType(typeClass)
    {
        let sprite;
        let list=[];

        for (sprite of this.sprites) {
            if (sprite instanceof typeClass) list.push(sprite);
        }
        
        return(list);
    }
    
    getFirstSpriteOfType(typeClass)
    {
        let sprite;

        for (sprite of this.sprites) {
            if (sprite instanceof typeClass) return(sprite);
        }
        
        return(null);
    }
    
    getFirstSpriteWithData(name,value)
    {
        let sprite;

        for (sprite of this.sprites) {
            if (sprite.data.get(name)===value) return(sprite);
        }
        
        return(null);
    }
    
    addParticle(x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,img,count,lifeTick)
    {
        let particle=new ParticleClass(this.game,x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,img,count,lifeTick);
        return(this.particles.push(particle)-1);
    }
    
    changeTile(x,y,tileIdx)
    {
        this.tileData[(y*this.MAP_TILE_WIDTH)+x]=tileIdx;
    }
    
    shake(tickCount)
    {
        if (this.shakeCount!==-1) {
            if (tickCount<this.shakeCount) return;
        }
        this.shakeCount=tickCount;
    }
    
    /**
     * Override this to deal with any setup when a map is started, like
     * moving sprites around for save states, etc.  All sprites in a map
     * also get this call.
     */
    mapStartup()
    {   
    }
    
    /**
     * Override this to set this.offsetX and this.offsetY which set the
     * top left coordinate of the map when drawing.  It's called every frame before
     * drawing the map.
     */
    calcOffset()
    {
    }
    
    /**
     * Start a liquid movement.
     */
    moveLiquidTo(toLiquidY,liquidMoveSpeed)
    {
        this.toLiquidY=toLiquidY;
        this.liquidMoveSpeed=liquidMoveSpeed;
    }
    
    /**
     * Override this to detected when a liquid movement
     * has finished.
     */
    liquidMoveDone()
    {
    }
    
    checkCollision(checkSprite)
    {
        let sprite,tileIdx;
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
            
            if (checkSprite.collide(sprite)) {
                checkSprite.collideSprite=sprite;
                return(true);
            }
        }
        
            // check map
            
        lft=checkSprite.x;
        top=checkSprite.y-checkSprite.height;
        rgt=checkSprite.x+checkSprite.width;
        bot=checkSprite.y;
            
        lx=Math.trunc(lft/this.MAP_TILE_SIZE);
        if (lx<0) lx=0;
        rx=Math.trunc(rgt/this.MAP_TILE_SIZE)+1;
        if (rx>this.MAP_TILE_WIDTH) rx=this.MAP_TILE_WIDTH;
        
        ty=Math.trunc(top/this.MAP_TILE_SIZE);
        if (ty<0) ty=0;
        
        by=Math.trunc(bot/this.MAP_TILE_SIZE);
        if (by>this.MAP_TILE_HEIGHT) by=this.MAP_TILE_HEIGHT;
        
        for (gy=ty;gy<=by;gy++) {
                
            dy=gy*this.MAP_TILE_SIZE;
            if ((bot<=dy) || (top>(dy+this.MAP_TILE_SIZE))) continue;

            for (gx=lx;gx<=rx;gx++) {
                tileIdx=this.tileData[(gy*this.MAP_TILE_WIDTH)+gx];
                if (tileIdx===0) continue;
                
                dx=gx*this.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+this.MAP_TILE_SIZE))) continue;
                
                checkSprite.collideTileIdx=tileIdx;
                
                return(true);
            }
        }
        
        return(false);
    }
    
    checkCollisionStand(checkSprite,dist)
    {
        let sprite,tileIdx;
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
                    checkSprite.standSprite=sprite;
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
        
        leftTileX=Math.trunc(lft/this.MAP_TILE_SIZE)-1;
        rightTileX=Math.trunc(rgt/this.MAP_TILE_SIZE)+1;
        y=Math.trunc(bot/this.MAP_TILE_SIZE);
        
        if (leftTileX<0) leftTileX=0;
        if (y<0) y=0;
        if (rightTileX>this.MAP_TILE_WIDTH) rightTileX=this.MAP_TILE_WIDTH-1;
        if ((y+2)>this.MAP_TILE_HEIGHT) y=this.MAP_TILE_HEIGHT-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            
            dy=gy*this.MAP_TILE_SIZE;
            if ((bot<dy) || (bot>((dy+this.MAP_TILE_SIZE)+dist))) continue;              

            for (gx=leftTileX;gx<rightTileX;gx++) {
                tileIdx=this.tileData[(gy*this.MAP_TILE_WIDTH)+gx];
                if (tileIdx===0) continue;
                
                dx=gx*this.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+this.MAP_TILE_SIZE))) continue;
                
                if ((dy<ty) || (ty===-1)) {
                    checkSprite.standSprite=null;
                    checkSprite.standTileIdx=tileIdx;
                    ty=dy;
                }
            }
        }
        
        return(ty);
    }
    
    checkCollisionRise(checkSprite,dist)
    {
        let sprite,tileIdx;
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
                    checkSprite.riseSprite=sprite;
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
        
        leftTileX=Math.trunc(lft/this.MAP_TILE_SIZE)-1;
        rightTileX=Math.trunc(rgt/this.MAP_TILE_SIZE)+1;
        y=Math.trunc(top/this.MAP_TILE_SIZE);
        
        if (leftTileX<0) leftTileX=0;
        if (y<0) y=0;
        rightTileX=Math.trunc(rgt/this.MAP_TILE_SIZE)+1;
        if ((y+2)>this.MAP_TILE_HEIGHT) y=this.MAP_TILE_HEIGHT-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            
            dy=gy*this.MAP_TILE_SIZE;
            if ((top<(dy+dist)) || (top>(dy+this.MAP_TILE_SIZE))) continue;              

            for (gx=leftTileX;gx<rightTileX;gx++) {
                tileIdx=this.tileData[(gy*this.MAP_TILE_WIDTH)+gx];
                if (tileIdx===0) continue;
                
                dx=gx*this.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+this.MAP_TILE_SIZE))) continue;
                
                if ((dy<ty) || (ty===-1)) {
                    checkSprite.riseSprite=null;
                    checkSprite.riseTileIdx=tileIdx;
                    ty=dy+this.MAP_TILE_SIZE;
                }
            }
        }
        
        return(ty);
    }
    
    getSpritesWithinBox(lft,top,rgt,bot,ignoreSprite,filterClass)
    {
        let sprite;
        let sprites=[];
            
        for (sprite of this.sprites) {
            if (!sprite.show) continue;
            if (!sprite.canCollide) continue;

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
    
    getTileUnderSprite(checkSprite)
    {
        let x=Math.trunc((checkSprite.x+Math.trunc(checkSprite.width*0.5))/this.MAP_TILE_SIZE);
        let y=Math.trunc((checkSprite.y+1)/this.MAP_TILE_SIZE);
        
        return(this.tileData[(y*this.MAP_TILE_WIDTH)+x]);
    }
    
    getMapViewportLeftEdge()
    {
        let sprite,x;
        let wid=this.game.canvasWidth;

        sprite=this.sprites[this.playerIdx];
        x=sprite.x-Math.trunc(wid*0.5);
        if (x<0) x=0;
        
        return(x);
    }
    
    getMapViewportRightEdge()
    {
        return(this.getMapViewportLeftEdge()+this.game.canvasWidth);
    }
    
    getMapViewportTopEdge()
    {
        let sprite,y;
        let high=this.game.canvasHeight;

        sprite=this.sprites[this.playerIdx];
        y=sprite.y-Math.trunc(high*0.5);
        if (y<0) y=0;
        
        return(y);
    }
    
    getMapViewportBottomEdge()
    {
        return(this.getMapViewportTopEdge()+this.game.canvasHeight);
    }
    
    run()
    {
        let n;
        let sprite;
        let playerSprite=this.getSpritePlayer();
        
            // move any liquid
            
        if (this.toLiquidY!==-1) {
            if (this.toLiquidY<this.liquidY) {
                this.liquidY-=this.liquidMoveSpeed;
                if (this.liquidY<this.toLiquidY) {
                    this.liquidY=this.toLiquidY;
                    this.toLiquidY=-1;
                    this.liquidMoveDone();
                }
            }
            else {
                this.liquidY+=this.liquidMoveSpeed;
                if (this.liquidY>this.toLiquidY) {
                    this.liquidY=this.toLiquidY;
                    this.toLiquidY=-1;
                    this.liquidMoveDone();
                }
            }
        }
        
            // always run the player first
            
        playerSprite.run();

            // run through all the sprites
                
        for (sprite of this.sprites) {
            if (sprite!==playerSprite) {
                sprite.run();
            }   
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
    
    draw(ctx)
    {
        let x,y;
        let lx,rx,ty,by;
        let tile,sprite,particle;
        let tilePerWidth,tilePerHeight;
        
            // get the map offsets
            
        this.calcOffset();
        
        if (this.shakeCount!==-1) {
            this.shakeCount--;
            
            this.offsetY+=(5-(Math.random()*10));
        }
        
            // draw size
            
        tilePerWidth=Math.trunc(this.game.canvasWidth/this.MAP_TILE_SIZE);
        tilePerHeight=Math.trunc(this.game.canvasHeight/this.MAP_TILE_SIZE);
            
            // draw the map
            
        lx=Math.trunc(this.offsetX/this.MAP_TILE_SIZE)-1;
        if (lx<0) lx=0;
        
        rx=(lx+tilePerWidth)+2;
        if (rx>this.MAP_TILE_WIDTH) rx=this.MAP_TILE_WIDTH;
        
        ty=Math.trunc(this.offsetY/this.MAP_TILE_SIZE)-1;
        if (ty<0) ty=0;
        
        by=(ty+tilePerHeight)+2;
        if (by>this.MAP_TILE_HEIGHT) by=this.MAP_TILE_HEIGHT;
        
        for (y=ty;y<by;y++) {
            
            for (x=lx;x<rx;x++) {
                tile=this.tileData[(y*this.MAP_TILE_WIDTH)+x];
                if (tile===0) continue;
                
                ctx.drawImage(this.game.tileImageList[tile-1],((x*this.MAP_TILE_SIZE)-this.offsetX),((y*this.MAP_TILE_SIZE)-this.offsetY));
            }
        }
        
            // draw the sprites
            
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.background)) sprite.draw(ctx,this.offsetX,this.offsetY);
        }
        
        for (sprite of this.sprites) {
            if ((sprite.show) && (!sprite.background)) sprite.draw(ctx,this.offsetX,this.offsetY);
        }
        
            // draw the particles
            
        for (particle of this.particles) {
            particle.draw(ctx,this.offsetX,this.offsetY);
        }
    }
    
}
