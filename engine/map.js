import SpriteClass from './sprite.js';
import ParticleClass from './particle.js';
import GridSpotClass from './grid_spot.js';

export default class MapClass
{
    constructor(game)
    {
        this.game=game;
        this.gridPixelSize=64;
        
        this.width=0;
        this.height=0;
        
        this.tileData=null;             // tile data for map
        this.sprites=null;              // sprites in map
        
        this.grid=null;
        this.gridWidth=0;
        this.gridHeight=0;
        this.gridSpotPerWidth=0;
        this.gridSpotPerHeight=0;
        
        this.playerIdx=-1;
        
        this.particles=[];
    }
    
    initialize()
    {
        let sprite;

        this.setMapFromArray();
        this.mapStartup();
        
            // call all the sprite map enter
            
        for (sprite of this.sprites) {
            sprite.mapStartup();
        }
    }
    
    getGame()
    {
        return(this.game);
    }
    
    getMapName()
    {
        return('');
    }
    
    getGridWidth()
    {
        return(this.gridWidth);
    }
    
    getGridHeight()
    {
        return(this.gridHeight);
    }
    
    getGridPixelSize()
    {
        return(this.gridPixelSize);
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

    setMapFromArray()
    {
        let x,y,row,tileRowStr,spriteRowStr,ch,tile,sprite;
        let idx;
        let mapTileLayou=this.getMapTileLayout();
        let mapSpriteLayout=this.getMapSpriteLayout();
        let rowCount=mapTileLayou.length;
        let colCount=0;
        
            // find longest horizontal line
            // and pad all lines to that size
        
        for (y=0;y!==rowCount;y++) {
            if (mapTileLayou[y].length>colCount) colCount=mapTileLayou[y].length;
            if (mapSpriteLayout[y].length>colCount) colCount=mapSpriteLayout[y].length;
        }
        
        for (y=0;y!==rowCount;y++) {
            mapTileLayou[y]=mapTileLayou[y].padEnd(colCount,' ');
            mapSpriteLayout[y]=mapSpriteLayout[y].padEnd(colCount,' ');
        }

            // translate to grid
            
        this.grid=[];
        this.playerIdx=-1;
        
        for (y=0;y!==rowCount;y++) {
            row=new Array(colCount);
            
            tileRowStr=mapTileLayou[y];
            spriteRowStr=mapSpriteLayout[y];
            
            for (x=0;x!==colCount;x++) {
                
                    // get the tile
                    
                row[x]=null;
                    
                ch=tileRowStr.charAt(x);
                if (ch!==32) {
                    tile=this.createMapTileForCharacter(ch);
                    if (tile!==null) row[x]=tile;
                }
                
                    // a sprite
                
                ch=spriteRowStr.charAt(x);
                if (ch!==32) {
                    sprite=this.createMapSpriteForCharacter(ch);
                    if (sprite!==null) {
                        sprite.setPosition((x*this.gridPixelSize),((y+1)*this.gridPixelSize));              // sprites Y is on the bottom
                        idx=this.addSprite(sprite);
                        sprite.setGridSpawnPoint(x,y);
                        if (ch==='*') this.playerIdx=idx;
                    }
                }
            }
            
            this.grid.push(row);
        }
        
        this.gridWidth=colCount;
        this.gridHeight=rowCount;
        
        this.gridSpotPerWidth=(this.game.canvasWidth/this.gridPixelSize);
        this.gridSpotPerHeight=(this.game.canvasHeight/this.gridPixelSize);
        
        this.width=this.gridWidth*this.gridPixelSize;
        this.height=this.gridHeight*this.gridPixelSize;
        
            // quick system out if no player
            
        if (this.playerIdx===-1) console.log('No player in map data');
    }
    
    checkCollision(checkSprite)
    {
        let sprite,gridSpot;
        let lx,rx,ty,by,dx,dy,gx,gy;
        let lft,top,rgt,bot;
        let row;
        
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
            
        lx=Math.trunc(lft/this.gridPixelSize);
        if (lx<0) lx=0;
        rx=Math.trunc(rgt/this.gridPixelSize)+1;
        if (rx>this.gridWidth) rx=gridWidth;
        
        ty=Math.trunc(top/this.gridPixelSize);
        if (ty<0) ty=0;
        
        by=Math.trunc(bot/this.gridPixelSize);
        if (by>this.gridHeight) by=this.gridHeight;
        
        for (gy=ty;gy<=by;gy++) {
            row=this.grid[gy];
                
            dy=gy*this.gridPixelSize;
            if ((bot<=dy) || (top>(dy+this.gridPixelSize))) continue;

            for (gx=lx;gx<=rx;gx++) {
                if (row[gx]===null) continue;
                
                gridSpot=row[gx];
                if ((!gridSpot.show) || (!gridSpot.canCollide)) continue;
                
                dx=gx*this.gridPixelSize;
                if ((rgt<=dx) || (lft>=(dx+this.gridPixelSize))) continue;
                
                return(true);
            }
        }
        
        return(false);
    }
    
    checkCollisionStand(checkSprite,dist)
    {
        let sprite,gridSpot;
        let ty=-1;
        let x,y,dx,dy,gx,gy;
        let lft,top,rgt,bot;
        let row;
        
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
        
        x=Math.trunc(((lft+rgt)*0.5)/this.gridPixelSize);
        y=Math.trunc(bot/this.gridPixelSize);
        
        if (x<0) x=0;
        if (y<0) y=0;
        if ((x+2)>this.gridWidth) x=this.gridWidth-2;
        if ((y+2)>this.gridHeight) y=this.gridHeight-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            row=this.grid[gy];
            
            dy=gy*this.gridPixelSize;
            if ((bot<dy) || (bot>(dy+this.gridPixelSize))) continue;              

            for (gx=0;gx!==(x+2);gx++) {
                if (row[gx]===null) continue;
                
                gridSpot=row[gx];
                if ((!gridSpot.show) || (!gridSpot.canCollide)) continue;
                
                dx=gx*this.gridPixelSize;
                if ((rgt<=dx) || (lft>=(dx+this.gridPixelSize))) continue;
                
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
        let rgt=this.game.getMap().width-wid;

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
        let bot=this.game.getMap().height-high;

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
        let row,lx,rx,ty,by,offX,offY;
        let sprite,particle,gridSpot;
        let wid=this.game.canvasWidth;
        let rgt=this.game.getMap().width-wid;
        let high=this.game.canvasHeight;
        let bot=this.game.getMap().height-high;
        
            // get offset
            
        sprite=this.sprites[this.playerIdx];
        offX=sprite.x-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        offY=sprite.y-Math.trunc(high*0.5);
        if (offY<0) offY=0;
        if (offY>bot) offY=bot;
            
            // draw the map
            
        lx=Math.trunc(offX/this.gridPixelSize)-1;
        if (lx<0) lx=0;
        
        rx=(lx+this.gridSpotPerWidth)+2;
        if (rx>this.gridWidth) rx=this.gridWidth;
        
        ty=Math.trunc(offY/this.gridPixelSize)-1;
        if (ty<0) ty=0;
        
        by=(ty+this.gridSpotPerHeight)+2;
        if (by>this.gridHeight) by=this.gridHeight;
        
        for (y=ty;y<by;y++) {
            row=this.grid[y];
            
            for (x=lx;x<rx;x++) {
                if (row[x]===null) continue;
                
                gridSpot=row[x];
                if (!gridSpot.show) continue;
                    
                ctx.drawImage(gridSpot.image,((x*this.gridPixelSize)-offX),((y*this.gridPixelSize)-offY));
            }
        }
        
            // draw the sprites
            
        for (sprite of this.sprites) {
            if ((sprite.show) && (sprite.background)) sprite.draw(ctx,offX,offY);
        }
        
        for (sprite of this.sprites) {
            if ((sprite.show) && (!sprite.background)) sprite.draw(ctx,offX,offY);
        }
        
            // draw the particles
            
        for (particle of this.particles) {
            particle.draw(ctx,offX,offY);
        }
    }
    
}
