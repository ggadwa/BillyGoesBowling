export default class ParticleClass
{
    constructor(game,x,y,startSize,endSize,startAlpha,endAlpha,initialMoveRadius,moveFactor,image,count,lifeTick)
    {
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
        this.lifeTick=lifeTick;
        
        this.startTimestamp=game.getTimestamp();
        
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
    
    isFinished()
    {
        return(this.game.getTimestamp()>(this.startTimestamp+this.lifeTick));
    }
    
    draw(ctx,offX,offY)
    {
        let n,dx,dy,sz,halfSize;
        let tick,movement;
       
            // are we done?
        
        tick=(this.game.getTimestamp()-this.startTimestamp);
        if (tick>this.lifeTick) return;
        
            // the setups
            
        sz=this.startSize+Math.trunc(((this.endSize-this.startSize)*tick)/this.lifeTick);
        ctx.globalAlpha=this.startAlpha+(((this.endAlpha-this.startAlpha)*tick)/this.lifeTick);
        
        halfSize=Math.trunc(sz*0.5);
        
            // calculate and draw the particles
            
        movement=tick*this.moveFactor;
            
        for (n=0;n!==this.count;n++) {
            dx=(((this.x+Math.trunc(this.xs[n]*movement))-this.middleOffsetX)-offX)-halfSize;
            dy=(((this.y+Math.trunc(this.ys[n]*movement))-this.middleOffsetY)-offY)-halfSize;
            
                // clip anything offscreen
            
            if ((dx>=this.game.canvasWidth) || ((dx+sz)<=0)) continue;
            if ((dy>=this.game.canvasHeight) || ((dy+sz)<=0)) continue;

                // draw particle
                
            ctx.drawImage(this.image,dx,dy,sz,sz);
        }
        
        ctx.globalAlpha=1.0;
    }
}
