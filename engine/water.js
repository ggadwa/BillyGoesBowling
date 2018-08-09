export default class WaterClass
{
    constructor(game)
    {
        this.game=game;
    }
    
    draw(ctx)
    {
        let map=this.game.map;
        let waterY=map.getWaterLevel();
        let x,y,cy,rad,waterHigh,idx;
        let wid=this.game.canvasWidth;
        let high=this.game.canvasHeight;
        let imgData,data;
        
            // any water to draw?
            
        if (waterY===-1) return;
        
        waterY-=map.offsetY;
        waterHigh=high-waterY;
        if (waterHigh<=0) return;
            
            // draw the water
            
        imgData=ctx.getImageData(0,waterY,wid,waterHigh);
        data=imgData.data;

        rad=((this.game.timestamp%2000)*(2*Math.PI))/2000.0;
        rad+=(map.offsetX*0.1);
        
        for (x=0;x!==wid;x++) {
            
            cy=Math.trunc((Math.cos(rad)+1.0)*8);
            
            for (y=cy;y<waterHigh;y++) {
                idx=((y*4)*wid)+(x*4);
                data[idx]=Math.trunc(data[idx++]*0.3);
                data[idx]=Math.trunc(data[idx++]*0.3);
                data[idx]=Math.trunc(data[idx++]*1.0);
            }
            
            rad+=0.1;
        }
        
        ctx.putImageData(imgData,0,waterY);
    }
    
}
