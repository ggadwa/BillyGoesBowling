export default class ParallaxBackgroundClass
{
    constructor(img,y,xFactor)
    {
        this.img=img;
        this.y=y;
        this.xFactor=xFactor;
    }
    
    draw(ctx,offsetX)
    {
        let imgWid=this.img.width;
        let x=-(Math.trunc(offsetX*this.xFactor)%imgWid);
        
        ctx.drawImage(this.img,x,this.y);
        if (x<0) ctx.drawImage(this.img,(x+imgWid),this.y);
        
    }
    
}
 