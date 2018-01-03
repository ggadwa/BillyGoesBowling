import SpriteClass from './sprite.js';
import ParticleClass from './particle.js';

export default class MapClass
{
    constructor(game,gridPixelSize)
    {
        this.game=game;
        this.gridPixelSize=gridPixelSize;
        
        this.grid=null;
        this.gridWidth=0;
        this.gridHeight=0;
        this.gridSpotPerWidth=0;
        this.gridSpotPerHeight=0;
        
        this.playerIdx=-1;
        
        this.sprites=[];
        this.particles=[];
    }
    
    getGame()
    {
        return(this.game);
    }
    
    initialize()
    {
    }
    
    prepare()
    {
        let sprite;
        
        for (sprite of this.sprites) {
            sprite.initialize(this.game);
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
    
    getGridPixelSize()
    {
        return(this.gridPixelSize);
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
    
    addParticle(x,y,initialRadius,moveFactor,img,count,lifeTick)
    {
        let particle=new ParticleClass(this.game,x,y,initialRadius,moveFactor,img,count,lifeTick);
        return(this.particles.push(particle)-1);
    }
    
    /**
     * Override this to return the minimum gravity start
     * value.  Usually 1.
     */
    getMinGravityValue()
    {
        return(1);
    }
    
    /**
     * Override this to return the maximum gravity value.
     */
    getMaxGravityValue()
    {
        return(15);
    }
    
    /**
     * Override this to return the map item for a character
     * in the map text.  Accepts Image and SpriteClass.
     */
    createMapItemForCharacter(ch)
    {
    }
    
    setMapFromText(playerCharacter,mapText)
    {
        let x,y,row,rowStr,ch,item;
        let idx;
        let rowCount=mapText.length;
        let colCount=mapText[0].length;
        
        this.grid=[];
        this.playerIdx=-1;
        
        for (y=0;y!==rowCount;y++) {
            row=new Array(colCount);
            rowStr=mapText[y];
            
            for (x=0;x!==colCount;x++) {
                row[x]=null;
                ch=rowStr.charAt(x);
                
                    // space is nothing
                    
                if (ch===32) continue;
                
                    // get the item
                    
                item=this.createMapItemForCharacter(ch);
                if (item===null) continue;
                
                    // a tile
                
                if (typeof(item)==='string') {
                    row[x]=this.game.getImageList().get(item);
                    continue;
                }
                
                    // a sprite
                    
                if (item instanceof SpriteClass) {
                    item.setGame(this.game);
                    item.setPosition((x*this.gridPixelSize),((y+1)*this.gridPixelSize));              // sprites Y is on the bottom
                    idx=this.addSprite(item);        
                    if (ch===playerCharacter) this.playerIdx=idx;
                    continue;
                }
            }
            
            this.grid.push(row);
        }
        
        this.gridWidth=colCount;
        this.gridHeight=rowCount;
        
        this.gridSpotPerWidth=(this.game.getCanvasWidth()/this.gridPixelSize);
        this.gridSpotPerHeight=(this.game.getCanvasHeight()/this.gridPixelSize);
        
            // quick system out if no player
            
        if (this.playerIdx===-1) console.log('No player in map data');
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
                if (row[gx]===null) continue;
                
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
            if (!sprite.canStandOn()) continue;
            
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
                if (row[gx]===null) continue;
                
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
            if (!sprite.getShow()) continue;
            if (!sprite.canCollide()) continue;
            
            if (sprite.collideRect(lft,top,rgt,bot)) sprites.push(sprite);
        }
        
        return(sprites);
    }
    
    getMapViewportLeftEdge()
    {
        let sprite,x;
        let wid=this.game.getCanvasWidth();
        let rgt=this.game.getMap().getWidth()-wid;

        sprite=this.sprites[this.playerIdx];
        x=sprite.getX()-Math.trunc(wid*0.5);
        if (x<0) x=0;
        if (x>rgt) x=rgt;
        
        return(x);
    }
    
    getMapViewportRightEdge()
    {
        return(this.getMapViewportLeftEdge()+this.game.getCanvasWidth());
    }
    
    getMapViewportTopEdge()
    {
        let sprite,y;
        let high=this.game.getCanvasHeight();
        let bot=this.game.getMap().getHeight()-high;

        sprite=this.sprites[this.playerIdx];
        y=0;
        if (y<0) y=0;
        if (y>bot) y=bot;
        
        return(y);
    }
    
    getMapViewportBottomEdge()
    {
        return(this.getMapViewportTopEdge()+this.game.getCanvasHeight());
    }
    
    run()
    {
        let n;
        let sprite,particle;
        let playerSprite=this.getSpritePlayer();
        
            // always run the player first
            
        playerSprite.run();

            // run through all the sprites
                
        for (sprite of this.sprites) {
            if (sprite!==playerSprite) {
                sprite.run();
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
        let sprite,particle;
        let wid=this.game.getCanvasWidth();
        let rgt=this.game.getMap().getWidth()-wid;
        
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
                if (row[x]!==null) ctx.drawImage(row[x],((x*this.gridPixelSize)-offX),((y*this.gridPixelSize)-offY));
            }
        }
        
            // draw the sprites
            
        for (sprite of this.sprites) {
            if (sprite.getShow()) sprite.draw(ctx,offX,offY);
        }
        
            // draw the particles
            
        for (particle of this.particles) {
            particle.draw(ctx,offX,offY);
        }
    }
    
}
