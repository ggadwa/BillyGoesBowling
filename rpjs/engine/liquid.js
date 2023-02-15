export default class LiquidClass {
    constructor(game) {
        this.game=game;
    }
    
    draw(ctx) {
        let map=this.game.map;
        let liquidY=map.liquidY;
        let r,g,b;
        let tintDarken=map.liquidTintDarken;
        let waveHigh;
        let x,y,cy,rad,liquidHigh,idx;
        let wid=this.game.canvasWidth;
        let high=this.game.canvasHeight;
        let imgData,data;
        
        // any liquid to draw?
        if (liquidY===-1) return;
        
        // get liquid Y
        liquidY=Math.trunc(liquidY-map.offsetY);
        liquidHigh=high-liquidY;
        if (liquidHigh<=0) return;
        
        // get wave height
        waveHigh=Math.abs(Math.sin(((this.game.timestamp%5000)*(2*Math.PI))/5000.0));
        waveHigh=(waveHigh*0.5)+0.5;
        waveHigh=map.liquidWaveHeight*waveHigh;
            
        // draw the water
        imgData=ctx.getImageData(0,liquidY,wid,liquidHigh);
        data=imgData.data;

        rad=((this.game.timestamp%2000)*(2*Math.PI))/2000.0;
        rad+=(map.offsetX*0.1);
        
        for (x=0;x!==wid;x++) {
            
            cy=Math.trunc((Math.cos(rad)+1.0)*waveHigh);
            
            r=map.liquidRTintFactor;
            g=map.liquidGTintFactor;
            b=map.liquidBTintFactor;
            
            for (y=cy;y<liquidHigh;y++) {
                idx=((y*4)*wid)+(x*4);
                data[idx]=Math.trunc(data[idx++]*r);
                data[idx]=Math.trunc(data[idx++]*g);
                data[idx]=Math.trunc(data[idx++]*b);
                
                r-=tintDarken;
                g-=tintDarken;
                b-=tintDarken;
            }
            
            rad+=0.1;
        }
        
        ctx.putImageData(imgData,0,liquidY);
    }
    
}
