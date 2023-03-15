export default class OverlayClass {

    static TYPE_PARALLAX=0;
    static TYPE_TILE=1;
    
    static BACKGROUND_LAYER=0;
    static FOREGROUND_LAYER=1;
    
    constructor(game,def) {
        this.game=game;
        this.def=def;
        
        this.image=null;
    }
    
    start() {
        // load up the image
        this.image=this.game.imageList.get(this.def.imageName);
        if (this.image===undefined) {
            this.image=null;
            console.log('Unknown overlay image png: '+this.def.imageName);
        }
    }  
    
    draw(ctx,offsetX,offsetY) {
        if (this.image==null) return;

        switch(this.def.overlayType) {
            case OverlayClass.TYPE_PARALLAX:
                this.drawParallax(ctx,offsetX);
                return;
            case OverlayClass.TYPE_TILE:
                this.drawTile(ctx,offsetX,offsetY);
                return;
        }
    }
    
    drawTile(ctx,offsetX,offsetY) {
        let x,y,xOff,yOff,dx,dy;
        let xStamp,yStamp;
        
        // tile offsets
        xOff=-(Math.trunc((this.game.tick*this.def.xScroll)+(offsetX*this.def.xFactor))%this.image.width);
        yOff=-(Math.trunc((this.game.tick*this.def.yScroll)+(offsetY*this.def.yFactor))%this.image.height);
        
        // tile stamps
        xStamp=Math.trunc(this.game.canvasWidth/this.image.width);
        while ((xOff+(xStamp*this.image.width))<this.game.canvasWidth) xStamp++;
        
        yStamp=Math.trunc(this.game.canvasHeight/this.image.height);
        while ((yOff+(yStamp*this.image.height))<this.game.canvasHeight) yStamp++;
        
        // tile drawing
        dy=yOff;
        
        for (y=0;y!=yStamp;y++) {
            dx=xOff;
            
            for (x=0;x!=xStamp;x++) {
                ctx.drawImage(this.image,dx,dy);
                dx+=this.image.width;
            }
            
            dy+=this.image.height;
        }
    }
    
    drawParallax(ctx,offsetX) {
        let imgWid=this.image.width;
        let x=-(Math.trunc((this.game.tick*this.def.xScroll)+(offsetX*this.def.xFactor))%imgWid);
        
        ctx.drawImage(this.image,x,Math.trunc(this.def.yOffset));
        if (x<0) ctx.drawImage(this.image,(x+imgWid),Math.trunc(this.def.yOffset));
        if (x>0) ctx.drawImage(this.image,(x-imgWid),Math.trunc(this.def.yOffset));
    }
    
    
}
 