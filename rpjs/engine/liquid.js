export default class LiquidClass {

    constructor(map,imgTop,imgFill,y,waveSize) {
        this.map=map;
        this.imgTop=imgTop;
        this.imgFill=imgFill;
        this.y=y;
        this.waveSize=waveSize;
        
        this.toY=-1;
        this.moveSpeed=0;
        
        this.waveHigh=0;
        this.waveOffsetX=0;
    }
    
    getY() {
        return(this.y);
    }
    
    setY() {
        this.y=y;
    }
    
    moveLiquidTo(toY,moveSpeed) {
        this.toY=toY;
        this.moveSpeed=moveSpeed;
    }
    
    runInternal(tick) {
        let triggerEvent=false; // triggers the liquid move done event
        
        // move any liquid
        if (this.toY!==-1) {
        
            if (this.toY<this.y) {
                this.y-=this.moveSpeed;
                if (this.y<this.toY) {
                    this.y=this.toY;
                    this.toY=-1;
                    triggerEvent=true;
                }
            }
            else {
                this.y+=this.moveSpeed;
                if (this.y>this.toY) {
                    this.y=this.toY;
                    this.toY=-1;
                    triggerEvent=true;
                }
            }
            
            // no waves when moving as it makes movement look weird
            this.waveHigh=0;
        }
        else {
            this.waveHigh=Math.sin(((tick%120)/120.0)*(2.0*Math.PI))*this.waveSize;
        }
        
        // wave offset
        this.waveOffsetX=Math.cos(((tick%160)/160.0)*(2.0*Math.PI))*this.waveSize;
        
        return(triggerEvent);
    }
    
    draw(ctx,offsetX,offsetY) {
        let x,dx,xStamp;
        let topY,fillY,dy,drawTop,drawFill;
        let imgWid=this.imgFill.width;
        let topHigh=this.imgTop.height;
        let canvasWid=this.map.game.canvasWidth;
        let canvasHigh=this.map.game.canvasHeight;
        
        // get position
        dx=-Math.trunc((offsetX%imgWid)+this.waveOffsetX);
        if (dx>0) dx-=imgWid;
        dy=Math.trunc((this.y-offsetY)+this.waveHigh);
        
        // wave height
        Math.sin()
        
        // figure out what parts to draw
        if (dy<0) {
            drawTop=false;
            drawFill=true;
            fillY=0;
        }
        else {
            if (dy>=canvasHigh) {
                drawFill=false;
                topY=dy-topHigh;
                drawTop=(topY<canvasHigh);
            }
            else {
                drawFill=true;
                fillY=dy;
                drawTop=true;
                topY=dy-topHigh;
            }
        }

        // get the stamping
        xStamp=Math.trunc(canvasWid/imgWid);
        while ((dx+(xStamp*imgWid))<canvasWid) xStamp++;
        
        // draw the liquid
        for (x=0;x!=xStamp;x++) {
            if (drawFill) ctx.drawImage(this.imgFill,dx,fillY);
            if (drawTop) ctx.drawImage(this.imgTop,dx,topY);
            dx+=imgWid;
        }
    }
    
}
