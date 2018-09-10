export default class EditorClass
{
    constructor(game)
    {
        this.game=game;
        this.map=null;
        
        this.MAP_TILE_WIDTH=256;        // todo -- these are here until we can have static class fields (replace with Map.X)
        this.MAP_TILE_HEIGHT=128;
        this.MAP_TILE_SIZE=64;
        
        this.mapCanvas=null;
        this.mapCTX=null;
        
        this.tilePaletteCanvas=null;
        this.tilePaletteCTX=null;
        
        this.spritePaletteCanvas=null;
        this.spritePaletteCTX=null;
        
        this.spritePaletteList=null;                // preloaded sprites that we use for the palette
        
        this.PALETTE_TILE=0;
        this.PALETTE_SPRITE=1;
        
        this.paletteSelType=this.PALETTE_TILE;
        this.paletteSelIndex=-1;
        
        this.offsetX=0;
        this.offsetY=0;
        
        this.spaceDown=false;
        this.inDrag=false;
        this.dragOriginalOffsetX=0;
        this.dragOriginalOffsetY=0;
        this.dragStartX=-1;
        this.dragStartY=-1;
        
        this.canvasMouseDown=false;
        
        Object.seal(this);
    }
    
    initialize()
    {
            // canvas and contextes
            
        this.mapCanvas=document.getElementById('editorMapCanvas');
        this.mapCanvas.onmousedown=this.leftMouseDownMapCanvas.bind(this);
        this.mapCanvas.onmousemove=this.leftMouseMoveMapCanvas.bind(this);
        this.mapCanvas.onmouseup=this.leftMouseUpMapCanvas.bind(this);
        this.mapCanvas.onmouseout=this.leftMouseUpMapCanvas.bind(this);     // mouse out forces a mouse up
        this.mapCanvas.onwheel=this.wheelMapCanvas.bind(this);
        
        document.onkeydown=this.keyDownMapCanvas.bind(this);                // need to be on document
        document.onkeyup=this.keyUpMapCanvas.bind(this);
        
        this.mapCanvas.oncontextmenu=this.rightClickMapCanvas.bind(this);
        this.mapCTX=this.mapCanvas.getContext('2d');
        
        this.tilePaletteCanvas=document.getElementById('editorTilePaletteCanvas');
        this.tilePaletteCanvas.onclick=this.clickTilePaletteCanvas.bind(this);
        this.tilePaletteCTX=this.tilePaletteCanvas.getContext('2d');
        
        this.spritePaletteCanvas=document.getElementById('editorSpritePaletteCanvas');
        this.spritePaletteCanvas.onclick=this.clickSpritePaletteCanvas.bind(this);
        this.spritePaletteCTX=this.spritePaletteCanvas.getContext('2d');
        
            // current map offset
            
        this.offsetX=0;
        this.offsetY=0;
        
            // initialize the map list
            
        this.game.mapList.initialize(this.game);
        
            // initialize the image list
            
        this.game.imageList.initialize(this.initialize2.bind(this));
    }
    
    initialize2()
    {
            // the tile list is a list of all the loaded
            // images from the tile subdirectory
            
        this.game.tileImageList=this.game.imageList.getArrayOfImageByPrefix('tiles/');

            // get a set of classes for the
            // entities we can put in this map
            
        this.spritePaletteList=this.game.getEditorSpritePaletteList();
        
            // and get the map to edit
            
        this.map=this.game.getStartMap();
        this.map.create();
        
            // if tileData or sprites are null, then
            // start with a clear map
            
        if (this.map.createTileData===null) this.map.createTileData=new Uint16Array(this.MAP_TILE_WIDTH*this.MAP_TILE_HEIGHT);
        if (this.map.createSprites===null) this.map.createSprites=[];
        
            // and copy to the working version
            
        this.map.tileData=this.map.createTileData.slice();
        this.map.sprites=this.map.createSprites.slice();
        
            // temporary, used to fix tiles if I change the tile list
        /*
        for (let n=0;n!=this.map.tileData.length;n++) {
            this.map.tileData[n]+=9;
        }
        */
       
        this.refresh();
    }
    
        //
        // draw canvases
        //
        
    drawMapCanvas()
    {
        let x,y,dx,dy,tileIdx,sprite;
        let lx,rx,ty,by,textOffset;
        let img;
        let ctx=this.mapCTX;
        let tiles=this.game.tileImageList;
        
            // get the tile draw viewport
            
        lx=this.offsetX;
        rx=lx+Math.trunc(this.mapCanvas.width/this.MAP_TILE_SIZE);
            
        ty=this.offsetY;
        by=ty+Math.trunc(this.mapCanvas.height/this.MAP_TILE_SIZE);
        
            // clear
            
        ctx.fillStyle='#FFFFFF';
        ctx.fillRect(0,0,this.mapCanvas.width,this.mapCanvas.height);
        
            // tiles

        for (y=ty;y!==by;y++) {
            for (x=lx;x!==rx;x++) {
                tileIdx=this.map.tileData[(y*this.MAP_TILE_WIDTH)+x]-1;
                if (tileIdx!==-1) ctx.drawImage(tiles[tileIdx],((x-lx)*this.MAP_TILE_SIZE),((y-ty)*this.MAP_TILE_SIZE));
            }
        }
        
            // entities
        
        for (sprite of this.map.sprites) {
            img=sprite.editorImage;
            
            dx=sprite.x;
            if (dx>(rx*this.MAP_TILE_SIZE)) continue;
            if ((dx+img.width)<(lx*this.MAP_TILE_SIZE)) continue;
            
            dy=sprite.y-img.height;
            if (dy>(by*this.MAP_TILE_SIZE)) continue;
            if ((dy+img.height)<(ty*this.MAP_TILE_SIZE)) continue;
            
            ctx.drawImage(img,(dx-(lx*this.MAP_TILE_SIZE)),(dy-(ty*this.MAP_TILE_SIZE)));
        }

            // grid
            
        ctx.strokeStyle='#CCCCCC';
        ctx.setLineDash([2,2]);
            
        dy=0;
        
        for (y=ty;y!==by;y++) {
            ctx.beginPath();
            ctx.moveTo(0,dy);
            ctx.lineTo(this.mapCanvas.width,dy);
            ctx.stroke();
            dy+=this.MAP_TILE_SIZE;
        }
            
        dx=0;
            
        for (x=lx;x!==rx;x++) {
            ctx.beginPath();
            ctx.moveTo(dx,0);
            ctx.lineTo(dx,this.mapCanvas.height);
            ctx.stroke();
            dx+=this.MAP_TILE_SIZE;
        }
        
        ctx.strokeStyle='#000000';
        ctx.setLineDash([]);

            // cell numbers

        ctx.font='16px Arial';
        ctx.fillStyle='#000000';
        ctx.textAlign='center';
        ctx.textBaseline='alphabetic';

        textOffset=Math.trunc(this.MAP_TILE_SIZE*0.5);
        
        dy=15;
        
        for (x=lx;x!==rx;x++) {
            ctx.fillText((''+x),(((x-lx)*this.MAP_TILE_SIZE)+textOffset),dy);
        }
        
        ctx.textAlign='left';
        ctx.textBaseline='middle';

        dx=5;
        
        for (y=ty;y!==by;y++) {
            ctx.fillText((''+y),dx,(((y-ty)*this.MAP_TILE_SIZE)+textOffset));
        }
       
            // borders
            
        ctx.strokeStyle='#000000';
        ctx.strokeRect(0,0,(this.mapCanvas.width-1),(this.mapCanvas.height-1));
    }
    
    drawTilePaletteCanvas()
    {
        let x,y,tile,cnt;
        let wid=this.tilePaletteCanvas.width;
        let tiles=this.game.tileImageList;
        let ctx=this.tilePaletteCTX;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.tilePaletteCanvas.width,this.tilePaletteCanvas.height);
        
        x=0;
        y=0;
        
            // the images
            
        for (tile of tiles) {
            ctx.drawImage(tile,x,y);
            
            x+=this.MAP_TILE_SIZE;
            if (x>=wid) {
                x=0;
                y+=this.MAP_TILE_SIZE;
            }
        }
        
            // the selection
            
        if ((this.paletteSelType===this.PALETTE_TILE) && (this.paletteSelIndex!==-1)) {
            ctx.strokeStyle='#FF3333';
            ctx.lineWidth=4;
            
            cnt=Math.trunc(wid/this.MAP_TILE_SIZE);
            x=(this.paletteSelIndex%cnt)*this.MAP_TILE_SIZE;
            y=Math.trunc(this.paletteSelIndex/cnt)*this.MAP_TILE_SIZE;
            
            ctx.beginPath();
            ctx.rect(x,y,this.MAP_TILE_SIZE,this.MAP_TILE_SIZE);
            ctx.stroke();
            
            ctx.strokeStyle='#000000';
            ctx.lineWidth=1;
        }
    }
    
    drawSpritePaletteCanvas()
    {
        let x,y,sprite,img,cnt;
        let wid=this.spritePaletteCanvas.width;
        let ctx=this.spritePaletteCTX;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.spritePaletteCanvas.width,this.spritePaletteCanvas.height);
        
        x=0;
        y=0;
        
            // the images
            
        for (sprite of this.spritePaletteList) {
            img=sprite.editorImage;
            ctx.drawImage(img,x,y,Math.min(this.MAP_TILE_SIZE,img.width),Math.min(this.MAP_TILE_SIZE,img.height));      // sprites can be bigger than map tile size
            
            x+=this.MAP_TILE_SIZE;
            if (x>=wid) {
                x=0;
                y+=this.MAP_TILE_SIZE;
            }
        }
        
            // the selection
            
        if ((this.paletteSelType===this.PALETTE_SPRITE) && (this.paletteSelIndex!==-1)) {
            ctx.strokeStyle='#FF3333';
            ctx.lineWidth=4;
            
            cnt=Math.trunc(wid/this.MAP_TILE_SIZE);
            x=(this.paletteSelIndex%cnt)*this.MAP_TILE_SIZE;
            y=Math.trunc(this.paletteSelIndex/cnt)*this.MAP_TILE_SIZE;
            
            ctx.beginPath();
            ctx.rect(x,y,this.MAP_TILE_SIZE,this.MAP_TILE_SIZE);
            ctx.stroke();
            
            ctx.strokeStyle='#000000';
            ctx.lineWidth=1;
        }
    }
    
    refresh()
    {
        this.drawMapCanvas();
        this.drawTilePaletteCanvas();
        this.drawSpritePaletteCanvas();
    }
    
        //
        // lookups
        //
        
    findSpriteIndexForPosition(x,y)
    {
        let n,sprite;
        
        x=x*this.MAP_TILE_SIZE;
        y=(y+1)*this.MAP_TILE_SIZE;

        for (n=0;n!=this.map.sprites.length;n++) {
            sprite=this.map.sprites[n];
            if ((sprite.x===x) && (sprite.y===y)) return(n);
        }
        
        return(-1);
    }
    
    findSpriteForPosition(x,y)
    {
        let idx=this.findSpriteIndexForPosition(x,y);
        if (idx===-1) return(null);
        return(this.map.sprites[idx]);
    }
    
        //
        // spot editing
        //
        
    clearSpot(x,y,idx)
    {
        let spriteIdx;
        
            // is there a sprite?
        
        spriteIdx=this.findSpriteIndexForPosition(x,y);
        if (spriteIdx!==-1) {
            this.map.removeSprite(spriteIdx);
            return;
        }
        
            // otherwise remove tile
            
        this.map.tileData[idx]=0;
    }
    
    setSpot(x,y,idx)
    {
        let spriteIdx;
        
        if (this.paletteSelIndex===-1) return;
        
        switch (this.paletteSelType) {
            case this.PALETTE_TILE:
                this.map.tileData[idx]=this.paletteSelIndex+1;
                break;
            case this.PALETTE_SPRITE:
                spriteIdx=this.findSpriteIndexForPosition(x,y);     // remove old sprite before putting down a new one
                if (spriteIdx!==-1) {
                    if (this.map.sprites[spriteIdx] instanceof this.spritePaletteList[this.paletteSelIndex].constructor) break;     // if it's the same type, just leave it
                    this.map.removeSprite(spriteIdx);
                }
                this.map.addSprite(this.spritePaletteList[this.paletteSelIndex].duplicate((x*this.MAP_TILE_SIZE),((y+1)*this.MAP_TILE_SIZE)));
                break;
        }
    }
    
        //
        // click canvases
        //
        
    leftClickMapCanvas(event)
    {
        let wid=this.mapCanvas.width;
        let x=this.offsetX+Math.trunc(event.offsetX/this.MAP_TILE_SIZE);
        let y=this.offsetY+Math.trunc(event.offsetY/this.MAP_TILE_SIZE);
        let idx=x+(y*Math.trunc(wid/this.MAP_TILE_SIZE));
        
        event.stopPropagation();
        event.preventDefault();
        
        if (event.ctrlKey) {
            this.clearSpot(x,y,idx);
        }
        else {
            this.setSpot(x,y,idx);
        }
        
        this.drawMapCanvas();
    }
    
    leftMouseDownMapCanvas(event)
    {
        this.canvasMouseDown=true;
        
            // if space is down, we are starting a drag
            
        if (this.spaceDown) {
            this.inDrag=true;
            this.dragStartX=-1;
            this.dragStartY=-1;
        }
        
            // otherwise we are clicking and item
            
        this.leftMouseMoveMapCanvas(event);
    }
    
    leftMouseMoveMapCanvas(event)
    {
        let x,y,max,idx;
        
            // are we in a drag?
            
        if (this.inDrag) {
                
                // first time through
                
            if (this.dragStartX===-1) {
                this.dragStartX=event.offsetX;
                this.dragStartY=event.offsetY;
                this.dragOriginalOffsetX=this.offsetX;
                this.dragOriginalOffsetY=this.offsetY;
                return;
            }
            
                // otherwise start dragging
                
            x=this.dragOriginalOffsetX+Math.trunc((this.dragStartX-event.offsetX)/this.MAP_TILE_SIZE);
            if (x<0) x=0;
            max=this.MAP_TILE_WIDTH-Math.trunc(this.mapCanvas.width/this.MAP_TILE_SIZE);
            if (x>max) x=max;
            
            y=this.dragOriginalOffsetY+Math.trunc((this.dragStartY-event.offsetY)/this.MAP_TILE_SIZE);
            if (y<0) y=0;
            max=this.MAP_TILE_HEIGHT-Math.trunc(this.mapCanvas.height/this.MAP_TILE_SIZE);
            if (y>max) y=max;
            
            if ((x===this.offsetX) && (y===this.offsetY)) return;
            
            this.offsetX=x;
            this.offsetY=y;
            
            this.drawMapCanvas();
            return;
        }
        
            // as long as the mouse is down, fill
            // in grid spots
            
        if (!this.canvasMouseDown) return;
        
        event.stopPropagation();
        event.preventDefault();
        
        x=this.offsetX+Math.trunc(event.offsetX/this.MAP_TILE_SIZE);
        y=this.offsetY+Math.trunc(event.offsetY/this.MAP_TILE_SIZE);
        idx=x+(y*this.MAP_TILE_WIDTH);
        
        if (event.ctrlKey) {
            this.clearSpot(x,y,idx);
        }
        else {
            this.setSpot(x,y,idx);
        }
        
        this.drawMapCanvas();
    }
    
    wheelMapCanvas(event)
    {
        let x,y,max;
        
        x=this.offsetX+Math.sign(event.deltaX);
        if (x<0) x=0;
        max=this.MAP_TILE_WIDTH-Math.trunc(this.mapCanvas.width/this.MAP_TILE_SIZE);
        if (x>max) x=max;
        
        y=this.offsetY+Math.sign(event.deltaY);
        if (y<0) y=0;
        max=this.MAP_TILE_HEIGHT-Math.trunc(this.mapCanvas.height/this.MAP_TILE_SIZE);
        if (y>max) y=max;
        
        this.offsetX=x;
        this.offsetY=y;
        
        this.drawMapCanvas();
    }
    
    leftMouseUpMapCanvas(event)
    {
        this.canvasMouseDown=false;
        this.inDrag=false;
    }
    
    rightClickMapCanvas(event)
    {
        let spriteIdx;
        let x=this.offsetX+Math.trunc(event.offsetX/this.MAP_TILE_SIZE);
        let y=this.offsetY+Math.trunc(event.offsetY/this.MAP_TILE_SIZE);
        
        event.stopPropagation();
        event.preventDefault();
        
            // edit sprite data
            
        spriteIdx=this.findSpriteIndexForPosition(x,y);
        if (spriteIdx===-1) return;
        
        this.drawMapCanvas();
    }
    
    clickTilePaletteCanvas(event)
    {
        let wid=this.tilePaletteCanvas.width;
        let x=event.offsetX;
        let y=event.offsetY;
        let idx=Math.trunc(x/this.MAP_TILE_SIZE)+(Math.trunc(y/this.MAP_TILE_SIZE)*Math.trunc(wid/this.MAP_TILE_SIZE));
        
        if (idx>=this.game.tileImageList.length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=this.PALETTE_TILE;
            this.paletteSelIndex=idx;
        }
        
        this.drawTilePaletteCanvas();
        this.drawSpritePaletteCanvas();
    }
    
    clickSpritePaletteCanvas(event)
    {
        let wid=this.spritePaletteCanvas.width;
        let x=event.offsetX;
        let y=event.offsetY;
        let idx=Math.trunc(x/this.MAP_TILE_SIZE)+(Math.trunc(y/this.MAP_TILE_SIZE)*Math.trunc(wid/this.MAP_TILE_SIZE));
        
        if (idx>=this.spritePaletteList.length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=this.PALETTE_SPRITE;
            this.paletteSelIndex=idx;
        }
        
        this.drawTilePaletteCanvas();
        this.drawSpritePaletteCanvas();
    }
    
        //
        // keys
        //
        
    keyDownMapCanvas(event)
    {
        if ((event.keyCode===32) && (!this.spaceDown)) {
            this.spaceDown=true;
            this.mapCanvas.style.cursor='grab';
        }
    }
    
    keyUpMapCanvas(event)
    {
        if (event.keyCode===32) {
            this.spaceDown=false;
            this.mapCanvas.style.cursor='default';
        }
    }
    
        //
        // map movement
        //
        
    mapUp()
    {
        let n,byteSize,idx,sprite;
        
        byteSize=(this.MAP_TILE_HEIGHT*this.MAP_TILE_WIDTH)-this.MAP_TILE_WIDTH;
        
        for (n=0;n!==byteSize;n++) {
            this.map.tileData[n]=this.map.tileData[n+this.MAP_TILE_WIDTH];
        }
        
        idx=(this.MAP_TILE_HEIGHT-1)*this.MAP_TILE_WIDTH;
        
        for (n=0;n!=this.MAP_TILE_WIDTH;n++) {
            this.map.tileData[idx++]=0;
        }
        
        for (sprite of this.map.sprites) {
            sprite.y-=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapDown()
    {
        let n,byteSize,sprite;
        
        byteSize=(this.MAP_TILE_HEIGHT*this.MAP_TILE_WIDTH)-this.MAP_TILE_WIDTH;
        
        for (n=byteSize;n!==0;n--) {
            this.map.tileData[n+this.MAP_TILE_WIDTH]=this.map.tileData[n];
        }
        
        for (n=0;n!=this.MAP_TILE_WIDTH;n++) {
            this.map.tileData[n]=0;
        }
        
        for (sprite of this.map.sprites) {
            sprite.y+=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapLeft()
    {
        let x,y,idx,sprite;
        
        idx=0;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            for (x=0;x!==(this.MAP_TILE_WIDTH-1);x++) {
                this.map.tileData[idx+x]=this.map.tileData[idx+(x+1)];
            }
            this.map.tileData[idx+(this.MAP_TILE_WIDTH-1)]=0;
            
            idx+=this.MAP_TILE_WIDTH;
        }
        
        for (sprite of this.map.sprites) {
            sprite.x-=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapRight()
    {
        let x,y,idx,sprite;
        
        idx=0;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            for (x=(this.MAP_TILE_WIDTH-1);x!=0;x--) {
                this.map.tileData[idx+x]=this.map.tileData[idx+(x-1)];
            }
            this.map.tileData[idx]=0;
            
            idx+=this.MAP_TILE_WIDTH;
        }
        
        for (sprite of this.map.sprites) {
            sprite.x+=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    fillFromZeroZero()
    {
        let n,tileIdx,byteSize;
        
        tileIdx=this.map.tileData[0];
        byteSize=this.MAP_TILE_HEIGHT*this.MAP_TILE_WIDTH;
        
        for (n=0;n!==byteSize;n++) {
            if (this.map.tileData[n]===0) this.map.tileData[n]=tileIdx;
        }
        
        this.drawMapCanvas();
    }
    
        //
        // compiling
        //
        
    compile()
    {
        let n,sprite,first,str;
        let div=document.getElementById('editorCompile');
        let textArea=document.getElementById('editorCompileText');
        
            // re-hide
            
        if (div.style.display==='') {
            div.style.display='none';
            return;
        }
        
            // compile
        
        str='    create()\r\n';
        str+='    {\r\n';
        str+='        this.createTileData=new Uint16Array([';
        
        for (n=0;n!=this.map.tileData.length;n++) {
            if (n!==0) str+=',';
            if ((n%this.MAP_TILE_WIDTH)===0) str+="\r\n            ";
            str+=this.map.tileData[n].toString();
        }
        
        str+='\r\n        ]);\r\n\r\n';
        
        str+='        this.createSprites=[\r\n'
        
        first=true;
        
        for (sprite of this.map.sprites) {
            if (!first) str+=',\r\n';
            first=false;
            
            str+='            new ';
            str+=sprite.constructor.name;
            str+='(this.game,';
            str+=sprite.x.toString();
            str+=",";
            str+=sprite.y.toString();
            str+=",new Map(";
            str+=JSON.stringify([...sprite.data]);
            str+="))";
        }
        
        str+='\r\n        ];\r\n';
        str+='    }\r\n';
        
        textArea.value=str;
            
            // show
            
        div.style.display='';
        
            // select it
            
        textArea.focus();
        textArea.select();
    }
    
}
