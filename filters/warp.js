import FilterClass from './filter.js';

export default class WarpFilterClass extends FilterClass
{
    constructor()
    {
        super();
        
        this.FADE_SIZE=15;
    }
    
    draw(ctx,img,x,y,animationFactor)
    {
        let dx,dy,fadeTopY,fadeBotY,ctxIdx,spriteIdx,alpha,alpha2;
        let imgCanvas,imgCTX;
        let ctxImgData,ctxData,spriteImgData,spriteData;
        let wid=img.width;
        let high=img.height;
        
            // to get the image data we need to draw
            // it to a canvas.  This is ugh and slow but
            // it's the only way right now
            
        imgCanvas=document.createElement('canvas');
        imgCanvas.width=wid;
        imgCanvas.height=high;
        
        imgCTX=imgCanvas.getContext('2d');
        imgCTX.drawImage(img,0,0);
            
        spriteImgData=imgCTX.getImageData(0,0,wid,high);
        spriteData=spriteImgData.data;    
        
            // get the data chunk to draw into
            
        ctxImgData=ctx.getImageData(x,y,wid,high);
        ctxData=ctxImgData.data;
        
            // fadeY
            
        fadeTopY=Math.trunc(high*animationFactor);
        if (fadeTopY>=high) return;
        
        fadeBotY=fadeTopY+this.FADE_SIZE;
        if (fadeBotY>high) fadeBotY=high;

            // draw the warp animation
        
        ctxIdx=spriteIdx=(fadeTopY*4)*wid;
        
        for (dy=fadeTopY;dy!==high;dy++) {
            for (dx=0;dx!==wid;dx++) {
                
                    // skip alphas
                    
                if (spriteData[spriteIdx+3]===0) {
                    ctxIdx+=4;
                    spriteIdx+=4;
                    continue;
                }
                
                    // are we not in the fade?
                    
                if (dy>fadeBotY) {
                    ctxData[ctxIdx++]=spriteData[spriteIdx++];
                    ctxData[ctxIdx++]=spriteData[spriteIdx++];
                    ctxData[ctxIdx++]=spriteData[spriteIdx++];
                    
                    ctxIdx++;
                    spriteIdx++;
                
                    continue;
                }
                
                    // the fade
                    
                alpha=(dy-fadeTopY)/this.FADE_SIZE;
                alpha2=1.0-alpha;
                    
                ctxData[ctxIdx]=Math.trunc((ctxData[ctxIdx++]*alpha2)+(spriteData[spriteIdx++]*alpha));
                ctxData[ctxIdx]=Math.trunc((ctxData[ctxIdx++]*alpha2)+(spriteData[spriteIdx++]*alpha));
                ctxData[ctxIdx]=Math.trunc((ctxData[ctxIdx++]*alpha2)+(spriteData[spriteIdx++]*alpha));
                
                ctxIdx++;
                spriteIdx++;
            }
        }
        
        ctx.putImageData(ctxImgData,x,y);
    }
}
