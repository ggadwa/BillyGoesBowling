export default class ParticleClass {
    
    static BEFORE_SPRITES_LAYER=0;
    static AFTER_SPRITES_LAYER=1;

    static ROTATE_TO_TICK_FACTOR=150.0;

    constructor(game,x,y,def) {
        this.game=game;
        this.x=x;
        this.y=y;
        this.def=def;
        
        this.image=null;
        
        this.startTick=0;
        
        // random particles
        this.xs=new Float32Array(def.count);
        this.ys=new Float32Array(def.count);
        this.rot=new Float32Array(def.count);
        this.rotAdd=new Float32Array(def.count);
        
        Object.seal(this);
    }
    
    start() {
        let n,rad;
        
        // load up the image
        this.image=this.game.imageList.get(this.def.imageName);
        if (this.image===undefined) {
            this.image=null;
            console.log('Unknown particle image png: '+this.def.imageName);
        }
        
        this.startTick=this.game.tick;
        
        // random particle starts
        rad=Math.PI*2.0;
            
        for (n=0;n!==this.def.count;n++) {
            this.xs[n]=(((Math.random()*2.0)-1.0)*this.def.initialMoveX);
            this.ys[n]=(((Math.random()*2.0)-1.0)*this.def.initialMoveY);
            this.rot[n]=(this.def.rotateFactor===0.0)?0.0:(Math.random()*rad);
            this.rotAdd[n]=Math.random(this.def.rotateFactor*2.0)-this.def.rotateFactor;
        }
    }
    
    isFinished() {
        return(this.game.tick>(this.startTick+this.def.lifeTick));
    }
    
    resetPosition(x,y) {
        this.x=x;
        this.y=y;
    }
    
    draw(ctx,offX,offY) {
        let n,dx,dy,sz,halfSize;
        let tick,moveX,moveY;
        
        // are we done?
        tick=(this.game.tick-this.startTick);
        if (tick>this.def.lifeTick) return;
        
        // if we couldn't load an image, then skip out on draw
        if (this.image==null) return;
        
        // save any context changes
        ctx.save();
        
        // the setups
        if (!this.def.reverse) {
            sz=this.def.startSize+Math.trunc(((this.def.endSize-this.def.startSize)*tick)/this.def.lifeTick);
            ctx.globalAlpha=this.def.startAlpha+(((this.def.endAlpha-this.def.startAlpha)*tick)/this.def.lifeTick);
            moveX=1+(tick*this.def.moveXFactor);
            moveY=1+(tick*this.def.moveYFactor);
        }
        else {
            sz=this.def.endSize+Math.trunc(((this.def.startSize-this.def.endSize)*tick)/this.def.lifeTick);
            ctx.globalAlpha=this.def.endAlpha+(((this.def.startAlpha-this.def.endAlpha)*tick)/this.def.lifeTick);
            moveX=1+((this.def.lifeTick-tick)*this.def.moveXFactor);
            moveY=1+((this.def.lifeTick-tick)*this.def.moveYFactor);
        }
            
        // draw it
        halfSize=Math.trunc(sz*0.5);
        
        for (n=0;n!==this.def.count;n++) {
            dx=(this.x+(this.xs[n]*moveX))-offX;
            dy=(this.y+(this.ys[n]*moveY))-offY;
            
            // clip anything offscreen
            if ((dx>=this.game.canvasWidth) || ((dx+sz)<=0)) continue;
            if ((dy>=this.game.canvasHeight) || ((dy+sz)<=0)) continue;
            
            // random rotation
            ctx.setTransform(1, 0, 0, 1, Math.trunc(dx), Math.trunc(dy));
            ctx.rotate(this.rot[n]+(this.rotAdd[n]*(tick/ParticleClass.ROTATE_TO_TICK_FACTOR)));

            // draw particle
            ctx.drawImage(this.image,-halfSize,-halfSize,sz,sz);
        }
        
        ctx.restore();
    }
}
