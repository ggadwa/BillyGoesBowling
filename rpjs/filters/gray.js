import FilterClass from './filter.js';

export default class GrayFilterClass extends FilterClass
{
    constructor()
    {
        super();
    }
    
    draw(ctx,img,x,y,animationFactor,timestamp)
    {
        let dx,dy,b,ctxIdx,spriteIdx;
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
        
            // draw in gray scale
        
        ctxIdx=0;
        spriteIdx=0;
        
        for (dy=0;dy!==high;dy++) {
            for (dx=0;dx!==wid;dx++) {
                
                    // skip alphas
                    
                if (spriteData[spriteIdx+3]===0) {
                    ctxIdx+=4;
                    spriteIdx+=4;
                    continue;
                }
                
                    // gray scale
                    
                b=Math.trunc((spriteData[spriteIdx++]+spriteData[spriteIdx++]+spriteData[spriteIdx++])*0.33);
                ctxData[ctxIdx++]=b;
                ctxData[ctxIdx++]=b;
                ctxData[ctxIdx++]=b;
                
                ctxIdx++;
                spriteIdx++;
            }
        }
        
        ctx.putImageData(ctxImgData,x,y);
    }
}
