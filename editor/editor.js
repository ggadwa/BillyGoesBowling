export default class EditorClass
{
    constructor(game)
    {
        this.game=game;
        
        this.MAP_TILE_WIDTH=256;
        this.MAP_TILE_HEIGHT=128;
        
        this.tileData=new Uint16Array(this.MAP_TILE_WIDTH*this.MAP_TILE_HEIGHT);
        this.spriteData=new Uint16Array(this.MAP_TILE_WIDTH*this.MAP_TILE_HEIGHT);
        
        this.mapCanvas=null;
        this.mapCTX=null;
        
        this.tileCanvas=null;
        this.tileCTX=null;
        
        this.spriteCanvas=null;
        this.spriteCTX=null;
        
        this.PALETTE_TILE=0;
        this.PALETTE_SPRITE=1;
        
        this.paletteSelType=this.PALETTE_TILE;
        this.paletteSelIndex=-1;
    }
    
    initialize()
    {
        this.mapCanvas=document.getElementById('editorMapCanvas');
        this.mapCanvas.onclick=this.clickMapCanvas.bind(this);
        this.mapCTX=this.mapCanvas.getContext('2d');
        
        this.tileCanvas=document.getElementById('editorTileCanvas');
        this.tileCanvas.onclick=this.clickTileCanvas.bind(this);
        this.tileCTX=this.tileCanvas.getContext('2d');
        
        this.spriteCanvas=document.getElementById('editorSpriteCanvas');
        this.spriteCanvas.onclick=this.clickSpriteCanvas.bind(this);
        this.spriteCTX=this.spriteCanvas.getContext('2d');
        
        this.game.getTileList().initialize(this.initialize2.bind(this));
    }
    
    initialize2()
    {
        this.game.getSpriteList().initialize(this.refresh.bind(this));
    }
    
        //
        // draw canvases
        //
        
    drawMapCanvas()
    {
        let x,y,dx,dy,idx,tileIdx,spriteIdx;
        let img,rgt,bot;
        let ctx=this.mapCTX;
        let tiles=this.game.getTileList().tiles;
        let sprites=this.game.getSpriteList().sprites;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.mapCanvas.width,this.mapCanvas.height);
        
            // tiles
            
        idx=0;
        dy=0;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            
            dx=0;
            
            for (x=0;x!==this.MAP_TILE_WIDTH;x++) {
                tileIdx=this.tileData[idx]-1;
                if (tileIdx!==-1) ctx.drawImage(tiles[tileIdx].image,dx,dy);
                
                idx++;
                dx+=64;
            }
            
            dy+=64;
        }
        
            // sprites
            
        idx=0;
        dy=0;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            
            dx=0;
            
            for (x=0;x!==this.MAP_TILE_WIDTH;x++) {
                spriteIdx=this.spriteData[idx]-1;
                if (spriteIdx!==-1) {
                    img=sprites[spriteIdx].images[0];
                    ctx.drawImage(img,dx,dy,Math.min(64,img.width),Math.min(64,img.height));       // some sprites are bigger than 64x64
                }
                
                idx++;
                dx+=64;
            }
            
            dy+=64;
        }
        
            // grid
            
        ctx.strokeStyle='#CCCCCC';
        ctx.setLineDash([2,2]);
            
        dy=0;
        rgt=this.MAP_TILE_WIDTH*64;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            ctx.beginPath();
            ctx.moveTo(0,dy);
            ctx.lineTo(rgt,dy);
            ctx.stroke();
            dy+=64;
        }
            
        dx=0;
        bot=this.MAP_TILE_HEIGHT*64;
            
        for (x=0;x!==this.MAP_TILE_WIDTH;x++) {
            ctx.beginPath();
            ctx.moveTo(dx,0);
            ctx.lineTo(dx,bot);
            ctx.stroke();
            dx+=64;
        }
        
        ctx.strokeStyle='#000000';
        ctx.setLineDash([]);
    }
    
    drawTileCanvas()
    {
        let x,y,tile,cnt;
        let wid=this.tileCanvas.width;
        let tiles=this.game.getTileList().tiles;
        let ctx=this.tileCTX;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.tileCanvas.width,this.tileCanvas.height);
        
        x=0;
        y=0;
        
            // the images
            
        for (tile of tiles) {
            ctx.drawImage(tile.image,x,y);
            
            x+=64;
            if (x>=wid) {
                x=0;
                y+=64;
            }
        }
        
            // the selection
            
        if ((this.paletteSelType===this.PALETTE_TILE) && (this.paletteSelIndex!==-1)) {
            ctx.strokeStyle='#FF3333';
            ctx.lineWidth=4;
            
            cnt=Math.floor(wid/64);
            x=(this.paletteSelIndex%cnt)*64;
            y=Math.floor(this.paletteSelIndex/cnt)*64;
            
            ctx.beginPath();
            ctx.rect(x,y,64,64);
            ctx.stroke();
            
            ctx.strokeStyle='#000000';
            ctx.lineWidth=1;
        }
    }
    
    drawSpriteCanvas()
    {
        let x,y,sprite,img,cnt;
        let wid=this.spriteCanvas.width;
        let sprites=this.game.getSpriteList().sprites;
        let ctx=this.spriteCTX;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.spriteCanvas.width,this.spriteCanvas.height);
        
        x=0;
        y=0;
        
            // the images
            
        for (sprite of sprites) {
            img=sprite.images[0];
            ctx.drawImage(img,x,y,Math.min(64,img.width),Math.min(64,img.height));      // sprites can be bigger than 64/64
            
            x+=64;
            if (x>=wid) {
                x=0;
                y+=64;
            }
        }
        
            // the selection
            
        if ((this.paletteSelType===this.PALETTE_SPRITE) && (this.paletteSelIndex!==-1)) {
            ctx.strokeStyle='#FF3333';
            ctx.lineWidth=4;
            
            cnt=Math.floor(wid/64);
            x=(this.paletteSelIndex%cnt)*64;
            y=Math.floor(this.paletteSelIndex/cnt)*64;
            
            ctx.beginPath();
            ctx.rect(x,y,64,64);
            ctx.stroke();
            
            ctx.strokeStyle='#000000';
            ctx.lineWidth=1;
        }
    }
    
    refresh()
    {
        this.drawMapCanvas();
        this.drawTileCanvas();
        this.drawSpriteCanvas();
    }
    
        //
        // click canvases
        //
        
    clickMapCanvas(event)
    {
        let wid=this.mapCanvas.width;
        let x=event.offsetX;
        let y=event.offsetY;
        let idx=Math.floor(x/64)+(Math.floor(y/64)*Math.floor(wid/64));
        
        switch (this.paletteSelType) {
            case this.PALETTE_TILE:
                this.tileData[idx]=this.paletteSelIndex+1;
                break;
            case this.PALETTE_SPRITE:
                this.spriteData[idx]=this.paletteSelIndex+1;
                break;
        }
        
        this.drawMapCanvas();
    }
    
    clickTileCanvas(event)
    {
        let wid=this.tileCanvas.width;
        let x=event.offsetX;
        let y=event.offsetY;
        let idx=Math.floor(x/64)+(Math.floor(y/64)*Math.floor(wid/64));
        
        if (idx>this.game.getTileList().length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=this.PALETTE_TILE;
            this.paletteSelIndex=idx;
        }
        
        this.drawTileCanvas();
        this.drawSpriteCanvas();
    }
    
    clickSpriteCanvas(event)
    {
        let wid=this.spriteCanvas.width;
        let x=event.offsetX;
        let y=event.offsetY;
        let idx=Math.floor(x/64)+(Math.floor(y/64)*Math.floor(wid/64));
        
        if (idx>this.game.getSpriteList().length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=this.PALETTE_SPRITE;
            this.paletteSelIndex=idx;
        }
        
        this.drawTileCanvas();
        this.drawSpriteCanvas();
    }
    
        //
        // compiling
        //
        
    compile()
    {
        let n,str;
        let div=document.getElementById('editorCompile');
        
            // re-hide
            
        if (div.style.display==='') {
            div.style.display='none';
            return;
        }
        
            // compile and show
        
        str='[';
        
        for (n=0;n!=this.tileData.length;n++) {
            if (n!==0) str+=',';
            str+=this.tileData[n].toString();
        }
        
        str+=']';
        
        div.textContent=str;
            
        div.style.display='';
    }
    
}
