import FilterClass from './filter.js';

export default class SquishFilterClass extends FilterClass
{
    draw(ctx,img,x,y,animationFactor,timeStamp)
    {
        let high;
        
        high=Math.trunc(img.height*(1.0-animationFactor));
        if (high<=0) return;
        
        ctx.drawImage(img,x,((y+img.height)-high),img.width,high);
    }
}
