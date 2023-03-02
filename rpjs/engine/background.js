export default class BackgroundClass {

    constructor(map,img,x,y,xFactor,yFactor,xScroll,yScroll,tileType) {
        this.map=map;
        this.img=img;
        this.x=x;
        this.y=y;
        this.xFactor=xFactor;
        this.yFactor=yFactor;
        this.xScroll=xScroll;
        this.yScroll=yScroll;
        this.tileType=tileType;
    }
    
    drawTile(ctx,offsetX,offsetY) {
        let x,y,xOff,yOff,dx,dy;
        let img=this.img;
        let map=this.map;
        let game=map.game;
        let xStamp,yStamp;
        
        // tile offsets
        xOff=-(((game.timestamp*this.xScroll)+offsetX)%img.width);
        yOff=-(((game.timestamp*this.yScroll)+offsetY)%img.height);
        
        // tile stamps
        xStamp=Math.trunc(game.canvasWidth/img.width);
        while ((xOff+(xStamp*img.width))<game.canvasWidth) xStamp++;
        
        yStamp=Math.trunc(game.canvasHeight/img.height);
        while ((yOff+(yStamp*img.height))<game.canvasHeight) yStamp++;
        
        // tile drawing
        dy=yOff;
        
        for (y=0;y!=yStamp;y++) {
            dx=xOff;
            
            for (x=0;x!=xStamp;x++) {
                ctx.drawImage(img,dx,dy);
                dx+=img.width;
            }
            
            dy+=img.height;
        }
    }
    
    drawParallax(ctx,offsetX,offsetY) {
        let imgWid=this.img.width;
        let x=-(Math.trunc(offsetX*this.xFactor)%imgWid);
        
        ctx.drawImage(this.img,x,Math.trunc(this.y));
        if (x<0) ctx.drawImage(this.img,(x+imgWid),Math.trunc(this.y));
    }
    
    draw(ctx,offsetX,offsetY) {
        if (this.tileType) {
            this.drawTile(ctx,offsetX,offsetY);
        }
        else {
            this.drawParallax(ctx,offsetX,offsetY);
        }
    }
    
}
 