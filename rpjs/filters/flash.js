import FilterClass from './filter.js';

export default class FlashFilterClass extends FilterClass
{
    draw(ctx,img,x,y,animationFactor,timestamp)
    {
        if (animationFactor<0.5) {
            ctx.globalAlpha=((timestamp&0x8)===0)?0.5:0.9;
        }
        else {
            ctx.globalAlpha=((timestamp&0x4)===0)?0.5:0.9;
        }
        
        ctx.drawImage(img,x,y,img.width,img.height);
        
        ctx.globalAlpha=1.0;
    }
}
