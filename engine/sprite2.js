export default class SpriteClass
{
    constructor(game)
    {
        this.game=game;
        
        this.x=0;
        this.y=0;
        
        this.gridSpawnX=0;
        this.gridSpawnY=0;
        
        this.FACING_FORWARD=0;
        this.FACING_LEFT=1;
        this.FACING_RIGHT=2;
        
        this.currentImageIdx=0;
        this.images=[];
        
        this.width=0;
        this.height=0;
        this.alpha=1.0;
        
        this.data=new Map();
        
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.gravityAdd=0.0;
        this.motion={x:0,y:0};
        this.facing=this.FACING_FORWARD;
        
        this.show=true;
        this.grounded=false;
        this.collideSprite=null;
        this.standSprite=null;
        
        this.canCollide=true;
        this.canStandOn=true;
        
        this.background=false;
        
        this.removeFlag=false;          // make this private
        
        // can't seal this object as it's extended
    }
    
    getGame()
    {
        return(this.game);
    }
    
    getMap()
    {
        return(this.game.getMap());
    }
    
    /**
     * Override this to do any operations on this sprite
     * that happen when a map is started.
     */
    mapStartup()
    {
    }
    
    /**
     * Called when another sprite is interacting with this one, this
     * is up to the game developer what this means.
     */
    interactWithSprite(interactSprite,dataObj)
    {
    }
    
    /**
     * Override this to change the per-tick AI of object.  Will need to call
     * super before or after.
     */
    runAI()
    {
    }
        
    addImage(name)
    {
        return(this.images.push(this.game.getImageList().get(name))-1);
    }
    
    setCurrentImage(imageIdx)
    {
        this.currentImageIdx=imageIdx;
        
        this.width=this.images[imageIdx].width;
        this.height=this.images[imageIdx].height;
    }
    
    getMiddleX()
    {
        return(this.x+Math.trunc(this.width*0.5));
    }
    
    getMiddleY()
    {
        return(this.y-Math.trunc(this.height*0.5));
    }
    
    collide(hitSprite)
    {
        if ((this.x+this.width)<=hitSprite.x) return(false);
        if (this.x>=(hitSprite.x+hitSprite.width)) return(false);
        if (this.y<=(hitSprite.y-hitSprite.height)) return(false);
        return((this.y-this.height)<hitSprite.y);
    }
    
    collideStand(hitSprite,dist)
    {
        let y;
        
        if ((this.x+this.width)<=hitSprite.x) return(false);
        if (this.x>=(hitSprite.x+hitSprite.width)) return(false);
        
        y=this.y+dist;                // for stand on collisions, the bottom of the standing object must intersect the top and bottom of check sprite
        if (y<(hitSprite.y-hitSprite.height)) return(false);
        return(y<hitSprite.y);
    }
    
    collideRect(lft,top,rgt,bot)
    {
        if ((this.x+this.width)<=lft) return(false);
        if (this.x>=rgt) return(false);
        if (this.y<=top) return(false);
        return((this.y-this.height)<bot);
    }
    
    setGridSpawnPoint(gridSpawnX,gridSpawnY)
    {
        this.gridSpawnX=gridSpawnX;
        this.gridSpawnY=gridSpawnY;
    }
    
    setPosition(x,y)
    {
        this.x=x;
        this.y=y;
    }
    
    move(mx,my)
    {
        this.x+=mx;
        this.y+=my;
    }
    
    moveWithCollision(mx,my)
    {
        this.move(mx,my);
        if (this.game.getMap().checkCollision(this)) this.move(-mx,-my);
    }
    
    addMotion(mx,my)
    {
        this.motion.x=mx;
        this.motion.y=my;
    }
    
    clampX(min,max)
    {
        if (this.x<min) this.x=min;
        if (this.x>max) this.x=max;
    }
    
    clampY(min,max)
    {
        if (this.y<min) this.y=min;
        if (this.y>max) this.y=max;
    }
    
    setFacing(facing)
    {
        this.facing=facing;
    }
    
    getFacing()
    {
        return(this.facing);
    }
    
    delete()
    {
        this.removeFlag=true;
    }
    
    isDeleted()
    {
        return(this.removeFlag);
    }
    
    getData(name)
    {
        let val=this.data.get(name);
        return((val===undefined)?null:val);
    }
    
    setData(name,value)
    {
        this.data.set(name,value);
    }
    
    run()
    {
        let y;
        let map=this.game.getMap();
        
            // run any AI
            
        this.runAI();
        
            // if not shown, skip the rest of this
            
        if (!this.show) return;
        
            // add in motion
            
        this.x+=this.motion.x;
        this.y+=this.motion.y;
        this.grounded=true;
        
            // physics
            
        if (this.gravityFactor!==0.0) {
            y=map.checkCollisionStand(this,Math.trunc(this.gravityAdd));
            if (y===-1) {
                this.y=Math.trunc(this.y+this.gravityAdd);
                if (this.gravityAdd<=0.0) this.gravityAdd=this.gravityMinValue;
                this.gravityAdd+=(this.gravityAdd*this.gravityFactor);
                if (this.gravityAdd>this.gravityMaxValue) this.gravityAdd=this.gravityMaxValue;
                this.grounded=false;
            }
            else {
                this.y=y;
                this.gravityAdd=0.0;
                this.grounded=true;
            }
        }
        
            // gravity slows down motion
            
        if (this.motion.y<0) {
            this.motion.y+=this.gravityAdd;
            if (this.motion.y>=0) this.gravityAdd=this.motion.y;
        }
    }
    
    draw(ctx,offX,offY)
    {
        let x=this.x-offX;
        let y=(this.y-this.height)-offY;
        
        if ((x>=this.game.canvasWidth) || ((x+this.width)<=0)) return;
        if ((y>=this.game.canvasHeight) || ((x+this.height)<=0)) return;
        
        if (this.alpha!==1.0) {
            ctx.globalAlpha=this.alpha;
            ctx.drawImage(this.images[this.currentImageIdx],x,y);
            ctx.globalAlpha=1.0;
        }
        else {
            ctx.drawImage(this.images[this.currentImageIdx],x,y);
        }
    }
}
