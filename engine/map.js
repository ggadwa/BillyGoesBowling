import SpriteClass from './sprite.js';

export default class MapClass
{
    constructor(gridPixelSize)
    {
        this.gridPixelSize=gridPixelSize;
        
        this.grid=null;
        this.gridWidth=0;
        this.gridHeight=0;
        this.gridSpotPerWidth=0;
        this.gridSpotPerHeight=0;
        
        this.playerIdx=0;
        
        this.tiles=[];
        this.sprites=[];
    }
    
    initialize(game)
    {
    }
    
    prepare(game)
    {
        let sprite;
        
        for (sprite of this.sprites) {
            sprite.initialize(game);
        }
    }
    
    getGridWidth()
    {
        return(this.gridWidth);
    }
    
    getGridHeight()
    {
        return(this.gridHeight);
    }
    
    getWidth()
    {
        return(this.gridWidth*this.gridPixelSize);
    }
    
    getHeight()
    {
        return(this.gridHeight*this.gridPixelSize);
    }
    
    addTile(img)
    {
        return(this.tiles.push(img)-1);
    }
    
    addSprite(sprite)
    {
        return(this.sprites.push(sprite)-1);
    }
    
    getSprite(spriteIdx)
    {
        return(this.sprites[spriteIdx]);
    }
    
    getSpritePlayer()
    {
        return(this.sprites[this.playerIdx]);
    }
    
    /**
     * Override this to get a sprite object for an index in the map text.
     */
    createSpriteForCharacterIndex(idx)
    {
    }
    
    setMapFromText(game,mapText)
    {
        let x,y,row,rowStr,ch;
        let sprite,spriteIdx;
        let rowCount=mapText.length;
        let colCount=mapText[0].length;
        
        this.grid=[];
        
        for (y=0;y!==rowCount;y++) {
            row=new Int16Array(colCount);
            rowStr=mapText[y];
            
            for (x=0;x!==colCount;x++) {
                ch=rowStr.charCodeAt(x);
                row[x]=-1;
                
                    // space is nothing
                    
                if (ch===32) continue;
                
                    // A...Z is map tiles
                    
                if ((ch>=65) && (ch<=90)) {
                    row[x]=ch-65;
                    continue;
                }
                
                    // a..z is sprites
                    
                if ((ch>=97) && (ch<=122)) {
                    sprite=this.createSpriteForCharacterIndex(ch-97);
                    sprite.setPosition((x*this.gridPixelSize),((y+1)*this.gridPixelSize));              // sprites Y is on the bottom
                    spriteIdx=this.addSprite(sprite);        
                    if (ch===97) this.playerIdx=spriteIdx;
                    continue;
                }
            }
            
            this.grid.push(row);
        }
        
        this.gridWidth=colCount;
        this.gridHeight=rowCount;
        
        this.gridSpotPerWidth=(game.getCanvasWidth()/this.gridPixelSize);
        this.gridSpotPerHeight=(game.getCanvasHeight()/this.gridPixelSize);
    }
    
    checkCollision(checkSprite)
    {
        let sprite;
        let lx,rx,ty,by,dx,dy,gx,gy;
        let lft,top,rgt,bot;
        let row;
        
            // clear flags
            
        checkSprite.collideSprite=null;
        
            // check sprites
            
        for (sprite of this.sprites) {
            if (sprite===checkSprite) continue;
            if (!sprite.getShow()) continue;
            if (!sprite.canCollide()) continue;
            
            if (checkSprite.collide(sprite)) {
                checkSprite.collideSprite=sprite;
                return(true);
            }
        }
        
            // check map
            
        lft=checkSprite.getRectLeft();
        top=checkSprite.getRectTop();
        rgt=checkSprite.getRectRight();
        bot=checkSprite.getRectBottom();
            
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

            for (gx=lx;gx<=rx;gx++) {
                if (row[gx]===-1) continue;
                
                dx=gx*this.gridPixelSize;
                if ((rgt<=dx) || (lft>=(dx+this.gridPixelSize))) continue;
                
                dy=gy*this.gridPixelSize;
                if ((bot<=dy) || (top>(dy+this.gridPixelSize))) continue;
                
                return(true);
            }
        }
        
        return(false);
    }
    
    checkCollisionStand(checkSprite,dist)
    {
        let sprite;
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
            if (!sprite.getShow()) continue;
            if (!sprite.canCollide()) continue;
            
            if (checkSprite.collideStand(sprite,dist)) {
                y=sprite.getRectTop();
                if ((y<ty) || (ty===-1)) {
                    checkSprite.standSprite=sprite;
                    ty=y;
                }
            }
        }
        
            // check map
            
        lft=checkSprite.getRectLeft();
        top=checkSprite.getRectTop();
        rgt=checkSprite.getRectRight();
        bot=checkSprite.getRectBottom();
        
        x=Math.trunc(((lft+rgt)*0.5)/this.gridPixelSize);
        y=Math.trunc(bot/this.gridPixelSize);
        
        if (x<0) x=0;
        if (y<0) y=0;
        if ((x+2)>this.gridWidth) x=this.gridWidth-2;
        if ((y+2)>this.gridHeight) y=this.gridHeight-2;
        
        for (gy=y;gy!==(y+2);gy++) {
            row=this.grid[gy];

            for (gx=0;gx!==(x+2);gx++) {
                if (row[gx]===-1) continue;
                
                dx=gx*this.gridPixelSize;
                if ((rgt<=dx) || (lft>=(dx+this.gridPixelSize))) continue;
                
                dy=gy*this.gridPixelSize;
                if ((bot<dy) || (bot>(dy+this.gridPixelSize))) continue;
                
                if ((dy<ty) || (ty===-1)) {
                    checkSprite.standSprite=null;
                    ty=dy;
                }
            }
        }
        
        return(ty);
    }
    
    getMapViewportLeftEdge(game)
    {
        let sprite,x;
        let wid=game.getCanvasWidth();
        let rgt=game.getMap().getWidth()-wid;

        sprite=this.sprites[this.playerIdx];
        x=sprite.getX()-Math.trunc(wid*0.5);
        if (x<0) x=0;
        if (x>rgt) x=rgt;
        
        return(x);
    }
    
    getMapViewportRightEdge(game)
    {
        return(this.getMapViewportLeftEdge(game)+game.getCanvasWidth());
    }
    
    getMapViewportTopEdge(game)
    {
        let sprite,y;
        let high=game.getCanvasHeight();
        let bot=game.getMap().getHeight()-high;

        sprite=this.sprites[this.playerIdx];
        y=0;
        if (y<0) y=0;
        if (y>bot) y=bot;
        
        return(y);
    }
    
    getMapViewportBottomEdge(game)
    {
        return(this.getMapViewportTopEdge(game)+game.getCanvasHeight());
    }
    
    run(game,timestamp)
    {
        let sprite;
        let playerSprite=this.getSpritePlayer();
        
            // always run the player first
            
        playerSprite.run(game,timestamp);

            // run through all the sprites
                
        for (sprite of this.sprites) {
            if (sprite!==playerSprite) {
                if (sprite.getShow()) sprite.run(game,timestamp);
            }   
        }
    }
    
    draw(game,ctx,timestamp)
    {
        let x,y,idx;
        let row,lx,rx,ty,by,offX,offY;
        let sprite;
        let wid=game.getCanvasWidth();
        let rgt=game.getMap().getWidth()-wid;
        
            // get offset
            
        sprite=this.sprites[this.playerIdx];
        offX=sprite.getX()-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        offY=0;
            
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
                idx=row[x];
                if (idx>=0) ctx.drawImage(this.tiles[idx],((x*this.gridPixelSize)-offX),((y*this.gridPixelSize)-offY));
            }
        }
        
            // draw the sprites
            
        for (sprite of this.sprites) {
            if (sprite.getShow()) sprite.draw(game,ctx,offX,offY);
        }
    
    }
    
}
