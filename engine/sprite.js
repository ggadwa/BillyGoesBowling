export default class SpriteClass
{
    constructor()
    {
        this.game=null;         // gets set when the map is created
        
        this.x=0;
        this.y=0;
        
        this.FACING_FORWARD=0;
        this.FACING_LEFT=1;
        this.FACING_RIGHT=2;
        
        this.currentImageIdx=0;
        this.images=[];
        
        this.width=0;
        this.height=0;
        
        this.gravityAdd=0.0;
        this.motion={x:0,y:0};
        this.facing=this.FACING_FORWARD;
        
        this.show=true;
        this.grounded=false;
        this.collideSprite=null;
        this.standSprite=null;
        
        // can't seal this object as it's extended
    }
    
    getGame()
    {
        return(this.game);
    }
    
    setGame(game)
    {
        this.game=game;
    }
    
    getMap()
    {
        return(this.game.getMap());
    }
    
    loadImage(filePath)
    {
        return(this.game.loadImage(filePath));
    }
    
    /**
     * Sets up this game sprite.  Add in images here.
     */
    initialize()
    {
    }
    
    /**
     * A gravity factor of 0.0 = object is static, no gravity
     */
    getGravityFactor()
    {
        return(0.0);
    }
    
    /**
     * Can this object collide with other objects?
     */
    canCollide()
    {
        return(true);
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
        
    addImage(filePath)
    {
        return(this.images.push(this.game.loadImage(filePath))-1);
    }
    
    setCurrentImage(imageIdx)
    {
        this.currentImageIdx=imageIdx;
        
        this.width=this.images[imageIdx].width;
        this.height=this.images[imageIdx].height;
    }
    
    getX()
    {
        return(this.x);
    }
    
    getY()
    {
        return(this.y);
    }
    
    getRectLeft()
    {
        return(this.x);
    }
    
    getRectRight()
    {
        return(this.x+this.width);
    }
    
    getRectTop()
    {
        return(this.y-this.height);
    }
    
    getRectBottom()
    {
        return(this.y);
    }
    
    getWidth()
    {
        return(this.width);
    }
    
    getHeight()
    {
        return(this.height);
    }
    
    getMiddleX()
    {
        return(this.x+Math.trunc(this.width*0.5));
    }
    
    getMiddleY()
    {
        return(this.y-Math.trunc(this.height*0.5));
    }
    
    setShow(show)
    {
        this.show=show;
    }
    
    getShow()
    {
        return(this.show);
    }
    
    collide(hitSprite)
    {
        if (this.getRectRight()<=hitSprite.getRectLeft()) return(false);
        if (this.getRectLeft()>=hitSprite.getRectRight()) return(false);
        if (this.getRectBottom()<=hitSprite.getRectTop()) return(false);
        return(this.getRectTop()<hitSprite.getRectBottom());
    }
    
    collideStand(hitSprite,dist)
    {
        let y;
        
        if (this.getRectRight()<=hitSprite.getRectLeft()) return(false);
        if (this.getRectLeft()>=hitSprite.getRectRight()) return(false);
        
        y=this.getRectBottom()+dist;                // for stand on collisions, the bottom of the standing object must intersect the top and bottom of check sprite
        if (y<hitSprite.getRectTop()) return(false);
        return(y<hitSprite.getRectBottom());
    }
    
    collideRect(lft,top,rgt,bot)
    {
        if (this.getRectRight()<=lft) return(false);
        if (this.getRectLeft()>=rgt) return(false);
        if (this.getRectBottom()<=top) return(false);
        return(this.getRectTop()<bot);
    }
    
    hasCollideSprite()
    {
        return(this.collideSprite!==null);
    }
    
    getCollideSprite()
    {
        return(this.collideSprite);
    }
    
    hasStandSprite()
    {
        return(this.standSprite!==null);
    }
    
    getStandSprite()
    {
        return(this.standSprite);
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
    
    setFacing(facing)
    {
        this.facing=facing;
    }
    
    getFacing()
    {
        return(this.facing);
    }
    
    isGrounded()
    {
        return(this.grounded);
    }
    
    run()
    {
        let y,gravityFactor;
        let map=this.game.getMap();
        
            // run any AI
            
        this.runAI();
        
            // add in motion
            
        this.x+=this.motion.x;
        this.y+=this.motion.y;
        this.grounded=true;
        
            // physics

        gravityFactor=this.getGravityFactor();
        if (gravityFactor!==0.0) {
            y=this.game.getMap().checkCollisionStand(this,Math.trunc(this.gravityAdd));
            if (y===-1) {
                this.y=Math.trunc(this.y+this.gravityAdd);
                if (this.gravityAdd<=0.0) this.gravityAdd=map.getMinGravityValue();
                this.gravityAdd+=(this.gravityAdd*gravityFactor);
                if (this.gravityAdd>map.getMaxGravityValue()) this.gravityAdd=map.getMaxGravityValue();
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
        
        if ((x>=this.game.getCanvasWidth()) || ((x+this.width)<=0)) return;
        if ((y>=this.game.getCanvasHeight()) || ((x+this.height)<=0)) return;
        
        ctx.drawImage(this.images[this.currentImageIdx],x,y);
    }
}
