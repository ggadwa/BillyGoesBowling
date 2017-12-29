export default class ParticleClass
{
    constructor(game,x,y,initialRadius,moveFactor,image,count,lifeTick)
    {
        let n;
        
        this.game=game;
        this.x=x;
        this.y=y;
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
            this.xs[n]=(((Math.random()*2.0)-1.0)*initialRadius);
            this.ys[n]=(((Math.random()*2.0)-1.0)*initialRadius);
        }
        
        Object.seal(this);
    }
    
    isFinished()
    {
        return(this.game.getTimestamp()>(this.startTimestamp+this.lifeTick));
    }
    
    draw(ctx,offX,offY)
    {
        /*
        let x=this.x-offX;
        let y=(this.y-this.height)-offY;
        
        if ((x>=game.getCanvasWidth()) || ((x+this.width)<=0)) return;
        if ((y>=game.getCanvasHeight()) || ((x+this.height)<=0)) return;
        */
       
        let n,dx,dy;
        let tick,halfTick,movement;
       
            // are we done?
        
        tick=(this.game.getTimestamp()-this.startTimestamp);
        if (tick>this.lifeTick) return;
        
            // the fade alpha
        
        halfTick=Math.trunc(this.lifeTick*0.5);
        if (tick>halfTick) ctx.globalAlpha=1.0-((tick-halfTick)/halfTick);
        
            // calculate and draw the particles
            
        movement=tick*this.moveFactor;
            
        for (n=0;n!==this.count;n++) {
            dx=((this.x+Math.trunc(this.xs[n]*movement))-this.middleOffsetX)-offX;
            dy=((this.y+Math.trunc(this.ys[n]*movement))-this.middleOffsetY)-offY;
            
            ctx.drawImage(this.image,dx,dy);
        }
        
        if (tick>halfTick)ctx.globalAlpha=1.0;
    }
}
