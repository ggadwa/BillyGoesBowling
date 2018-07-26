import SpriteClass from './sprite.js';
import ParticleClass from './particle.js';

export default class MapClass
{
    constructor(game)
    {
        this.game=game;
        
        this.MAP_TILE_WIDTH=256;        // todo -- these are here until we can have static class fields (replace with Map.X)
        this.MAP_TILE_HEIGHT=128;
        this.MAP_TILE_SIZE=64;
        
        this.width=this.MAP_TILE_WIDTH*this.MAP_TILE_SIZE;
        this.height=this.MAP_TILE_HEIGHT*this.MAP_TILE_SIZE;
        
        this.offsetX=0;
        this.offsetY=0;
        
        this.tileData=null;             // tile data for map
        this.sprites=null;              // sprites in map
        
        this.playerIdx=-1;
        
        this.particles=[];
    }
    
    initialize()
    {
        let n;
        let sprite;
        
            // create the map
            
        this.create();

            // call any map startup
            
        this.mapStartup();
        
            // call all the sprite map enter
        
        for (n=0;n!==this.sprites.length;n++) {
            sprite=this.sprites[n];

            sprite.mapStartup();
            if ((sprite.isPlayer()) && (this.playerIdx===-1)) this.playerIdx=n;
        }
        
        if (this.playerIdx===-1) console.log('No player in map');
        
            // we start the current map Y based on
            // the player position and move only
            // if player gets too close to edge
            
        this.currentMapY=this.sprites[this.playerIdx].y-Math.trunc(this.game.canvasHeight*0.9);
    }
    
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
    
    addParticle(x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,img,count,lifeTick)
    {
        let particle=new ParticleClass(this.game,x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,img,count,lifeTick);
        return(this.particles.push(particle)-1);
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
    
    checkCollision(checkSprite)
    {
        let sprite,tile;
        let lx,rx,ty,by,dx,dy,gx,gy;
        let lft,top,rgt,bot;
        
            // clear flags
            
        checkSprite.collideSprite=null;
        
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
                tile=this.tileData[(gy*this.MAP_TILE_WIDTH)+gx];
                if (tile===0) continue;
                
                dx=gx*this.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+this.MAP_TILE_SIZE))) continue;
                
                return(true);
            }
        }
        
        return(false);
    }
    
    checkCollisionStand(checkSprite,dist)
    {
        let sprite,tile;
        let ty=-1;
        let x,y,dx,dy,gx,gy;
        let lft,top,rgt,bot;
        
            // always fall at least 1
            
        if (dist<1) dist=1;
        
            // clear flags
            
        checkSprite.standSprite=null;
        
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
        top=checkSprite.y-checkSprite.height;
        rgt=checkSprite.x+checkSprite.width;
        bot=checkSprite.y;
        
        x=Math.trunc(((lft+rgt)*0.5)/this.MAP_TILE_SIZE);
        y=Math.trunc(bot/this.MAP_TILE_SIZE);
        
        if (x<0) x=0;
        if (y<0) y=0;
        if ((x+2)>this.MAP_TILE_WIDTH) x=this.MAP_TILE_WIDTH-2;
        if ((y+2)>this.MAP_TILE_HEIGHT) y=this.MAP_TILE_HEIGHT-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            
            dy=gy*this.MAP_TILE_SIZE;
            if ((bot<dy) || (bot>(dy+this.MAP_TILE_SIZE))) continue;              

            for (gx=0;gx!==(x+2);gx++) {
                tile=this.tileData[(gy*this.MAP_TILE_WIDTH)+gx];
                if (tile===0) continue;
                
                dx=gx*this.MAP_TILE_SIZE;
                if ((rgt<=dx) || (lft>=(dx+this.MAP_TILE_SIZE))) continue;
                
                if ((dy<ty) || (ty===-1)) {
                    checkSprite.standSprite=null;
                    ty=dy;
                }
            }
        }
        
        return(ty);
    }
    
    getSurroundSprites(checkSprite,radius)
    {
        let sprite,lft,top,rgt,bot;
        let sprites=[];
            
        lft=checkSprite.getMiddleX()-radius;
        rgt=lft+(radius*2);
        top=checkSprite.getMiddleY()-radius;
        bot=top+(radius*2);
        
        for (sprite of this.sprites) {
            if (sprite===checkSprite) continue;
            if (!sprite.show) continue;
            if (!sprite.canCollide) continue;
            
            if (sprite.collideRect(lft,top,rgt,bot)) sprites.push(sprite);
        }
        
        return(sprites);
    }
    
    getMapViewportLeftEdge()
    {
        let sprite,x;
        let wid=this.game.canvasWidth;
        let rgt=this.game.map.width-wid;

        sprite=this.sprites[this.playerIdx];
        x=sprite.x-Math.trunc(wid*0.5);
        if (x<0) x=0;
        if (x>rgt) x=rgt;
        
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
        let bot=this.game.map.height-high;

        sprite=this.sprites[this.playerIdx];
        y=sprite.y-Math.trunc(high*0.5);
        if (y<0) y=0;
        if (y>bot) y=bot;
        
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
        
            // draw size
            
        tilePerWidth=Math.floor(this.game.canvasWidth/this.MAP_TILE_SIZE);
        tilePerHeight=Math.floor(this.game.canvasHeight/this.MAP_TILE_SIZE);
            
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
