export default class ParticleClass {
    constructor(game,x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,image,count,reverse,lifeTick) {
        let n;
        
        this.game=game;
        this.x=x;
        this.y=y;
        this.startSize=startSize;
        this.endSize=endSize;
        this.startAlpha=startAlpha;
        this.endAlpha=endAlpha;
        this.moveFactor=moveFactor;
        this.image=image;
        this.count=count;
        this.reverse=reverse;
        this.lifeTick=lifeTick;
        
        this.startTimestamp=game.timestamp;
        
        // particle middle offsets
        this.middleOffsetX=Math.trunc(image.width*0.5);
        this.middleOffsetY=Math.trunc(image.height*0.5);
        
        // random particles
        this.xs=new Float32Array(count);
        this.ys=new Float32Array(count);
            
        for (n=0;n!==count;n++) {
            this.xs[n]=(((Math.random()*2.0)-1.0)*initialMoveRadius);
            this.ys[n]=(((Math.random()*2.0)-1.0)*initialMoveRadius);
        }
        
        Object.seal(this);
    }
    
    isFinished() {
        return(this.game.timestamp>(this.startTimestamp+this.lifeTick));
    }
    
    resetPosition(x,y) {
        this.x=x;
        this.y=y;
    }
    
    draw(ctx,offX,offY) {
        let n,dx,dy,sz,halfSize;
        let tick,movement;
        
        // are we done?
        tick=(this.game.timestamp-this.startTimestamp);
        if (tick>this.lifeTick) return;
        
        // save any context changes
        ctx.save();
        
        // the setups
        if (!this.reverse) {
            sz=this.startSize+Math.trunc(((this.endSize-this.startSize)*tick)/this.lifeTick);
            ctx.globalAlpha=this.startAlpha+(((this.endAlpha-this.startAlpha)*tick)/this.lifeTick);
            movement=1+(tick*this.moveFactor);
        }
        else {
            sz=this.endSize+Math.trunc(((this.startSize-this.endSize)*tick)/this.lifeTick);
            ctx.globalAlpha=this.endAlpha+(((this.startAlpha-this.endAlpha)*tick)/this.lifeTick);
            movement=1+((this.lifeTick-tick)*this.moveFactor);
        }
            
        // draw it
        halfSize=Math.trunc(sz*0.5);
        
        for (n=0;n!==this.count;n++) {
            dx=(((this.x+Math.trunc(this.xs[n]*movement))-this.middleOffsetX)-offX)-halfSize;
            dy=(((this.y+Math.trunc(this.ys[n]*movement))-this.middleOffsetY)-offY)-halfSize;
            
            // clip anything offscreen
            if ((dx>=this.game.canvasWidth) || ((dx+sz)<=0)) continue;
            if ((dy>=this.game.canvasHeight) || ((dy+sz)<=0)) continue;
            
            // random rotation
            ctx.setTransform(1, 0, 0, 1, dx, dy);
            ctx.rotate((tick/5)*(Math.PI/180.0));

            // draw particle
            ctx.drawImage(this.image,-halfSize,-halfSize,sz,sz);
        }
        
        ctx.restore();
    }
}
