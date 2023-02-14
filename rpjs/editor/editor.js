export default class EditorClass {
        
    constructor(game) {
        this.game=game;
        this.map=null;
        
        this.MAP_TILE_WIDTH=256; // todo -- these are here until we can have static class fields (replace with Map.X)
        this.MAP_TILE_HEIGHT=128;
        this.MAP_TILE_SIZE=64;
        
        this.DRAG_NONE=-1;
        this.DRAG_SCROLL=0;
        this.DRAG_SPRITE=1;
        this.DRAG_DRAW_TILE=2;
        
        this.mapCanvas=null;
        this.mapCTX=null;
        
        this.tilePaletteCanvas=null;
        this.tilePaletteCTX=null;
        
        this.spritePaletteCanvas=null;
        this.spritePaletteCTX=null;
        
        this.spritePaletteList=null; // preloaded sprites that we use for the palette
        
        this.PALETTE_TILE=0;
        this.PALETTE_SPRITE=1;
        
        this.paletteSelType=this.PALETTE_TILE;
        this.paletteSelIndex=-1;
        
        this.offsetX=0;
        this.offsetY=0;
        
        this.selectX=0;
        this.selectY=0;
        
        this.spaceDown=false;
        this.dragMode=this.DRAG_NONE;
        this.dragOriginalOffsetX=0;
        this.dragOriginalOffsetY=0;
        this.dragStartX=-1;
        this.dragStartY=-1;
        this.dragSprite=null;
        
        Object.seal(this);
    }
    
    initialize() {
        // any resize events
        window.addEventListener('resize',this.resize.bind(this),false);
        
        // get the canvases
        this.mapCanvas=document.getElementById('editorMapCanvas');
        this.tilePaletteCanvas=document.getElementById('editorTilePaletteCanvas');
        this.spritePaletteCanvas=document.getElementById('editorSpritePaletteCanvas');
        
        // setup canvases
        this.setCanvasPixelAndContext();
        
        // events
        this.mapCanvas.onmousedown=this.leftMouseDownMapCanvas.bind(this);
        this.mapCanvas.onmousemove=this.leftMouseMoveMapCanvas.bind(this);
        this.mapCanvas.onmouseup=this.leftMouseUpMapCanvas.bind(this);
        this.mapCanvas.onmouseout=this.leftMouseUpMapCanvas.bind(this); // mouse out forces a mouse up
        this.mapCanvas.onwheel=this.wheelMapCanvas.bind(this);
        
        document.onkeydown=this.keyDownMapCanvas.bind(this); // need to be on document
        document.onkeyup=this.keyUpMapCanvas.bind(this);
        
        this.tilePaletteCanvas.onclick=this.clickTilePaletteCanvas.bind(this);
        this.spritePaletteCanvas.onclick=this.clickSpritePaletteCanvas.bind(this);
        
        // toolbar buttons
        document.getElementById('compileButton').onclick=this.compile.bind(this);
        document.getElementById('mapUpButton').onclick=this.mapUp.bind(this);
        document.getElementById('mapDownButton').onclick=this.mapDown.bind(this);
        document.getElementById('mapLeftButton').onclick=this.mapLeft.bind(this);
        document.getElementById('mapRightButton').onclick=this.mapRight.bind(this);
        document.getElementById('spriteInfo').onclick=this.infoOpen.bind(this);
        
        // editor info button
        document.getElementById('editorInfoOk').onclick=this.infoOk.bind(this);
        document.getElementById('editorInfoCancel').onclick=this.infoCancel.bind(this);

        // current map offset
        this.offsetX=0;
        this.offsetY=0;
        
        // load resources
        this.game.attachResources();
        
        // initialize the map list
        this.game.mapList.initialize(this.game);
        
        // initialize the image list
        this.game.imageList.initialize(this.initialize2.bind(this));
    }
    
    initialize2() {
            // the tile list is a list of all the loaded
            // images from the tile subdirectory
            
        this.game.tileImageList=this.game.imageList.getArrayOfImageByPrefix('tiles/');

            // get a set of classes for the
            // entities we can put in this map
            
        this.spritePaletteList=this.game.getEditorSpritePaletteList();
        
            // and get the map to edit
            
            let mapName=(new URLSearchParams(window.location.search)).get('map');
            if (mapName===null) mapName=this.game.getStartMap();
            
        this.map=this.game.mapList.get(mapName);
        if (this.map===undefined) {
            alert('Unknown start map: '+mapName);
            return;
        }
        
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
    
    // setup canvas pixels and contexts
    setCanvasPixelAndContext() {
        this.mapCanvas.width=this.mapCanvas.offsetWidth;
        this.mapCanvas.height=this.mapCanvas.offsetHeight;
        this.mapCTX=this.mapCanvas.getContext('2d');

        this.tilePaletteCanvas.width=this.tilePaletteCanvas.offsetWidth;
        this.tilePaletteCanvas.height=this.tilePaletteCanvas.offsetHeight;
        this.tilePaletteCTX=this.tilePaletteCanvas.getContext('2d');
        
        this.spritePaletteCanvas.width=this.spritePaletteCanvas.offsetWidth;
        this.spritePaletteCanvas.height=this.spritePaletteCanvas.offsetHeight;
        this.spritePaletteCTX=this.spritePaletteCanvas.getContext('2d');
    }
    
    // resize
    resize() {
        this.setCanvasPixelAndContext();
        this.refresh();
    }
    
    // draw canvases
    drawMapCanvas() {
        let x,y,dx,dy,tileIdx,sprite;
        let lx,rx,ty,by,textOffset;
        let img;
        let ctx=this.mapCTX;
        let tiles=this.game.tileImageList;
        
        // get the tile draw viewport
        lx=this.offsetX;
        rx=lx+(Math.trunc(this.mapCanvas.width/this.MAP_TILE_SIZE)+1);
            
        ty=this.offsetY;
        by=ty+(Math.trunc(this.mapCanvas.height/this.MAP_TILE_SIZE)+1);
        
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
            img=sprite.currentImage;
            
            dx=sprite.x;
            if (dx>(rx*this.MAP_TILE_SIZE)) continue;
            if ((dx+img.width)<(lx*this.MAP_TILE_SIZE)) continue;
            
            dy=sprite.y-img.height;
            if (dy>(by*this.MAP_TILE_SIZE)) continue;
            if ((dy+img.height)<(ty*this.MAP_TILE_SIZE)) continue;
            
            ctx.drawImage(img,(dx-(lx*this.MAP_TILE_SIZE)),(dy-(ty*this.MAP_TILE_SIZE)));
        }

        // grid
        ctx.strokeStyle='#AAAAAA';
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
        
        // selected sprite
        if ((this.selectX>=lx) && (this.selectX<rx) && (this.selectY>=ty) && (this.selectY<by)) {
            dx=(this.selectX-lx)*this.MAP_TILE_SIZE;
            dy=(this.selectY-ty)*this.MAP_TILE_SIZE;
            ctx.strokeStyle='#FF0000';
            ctx.lineWidth=2.0;
            ctx.strokeRect(dx,dy,this.MAP_TILE_SIZE,this.MAP_TILE_SIZE);
            ctx.lineWidth=1.0;
        }
    }
    
    drawTilePaletteCanvas() {
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
            if ((x+this.MAP_TILE_SIZE)>=wid) {
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
    
    drawSpritePaletteCanvas() {
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
            img=sprite.currentImage;
            ctx.drawImage(img,x,y,Math.min(this.MAP_TILE_SIZE,img.width),Math.min(this.MAP_TILE_SIZE,img.height));      // sprites can be bigger than map tile size
            
            x+=this.MAP_TILE_SIZE;
            if ((x+this.MAP_TILE_SIZE)>=wid) {
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
    
    refresh() {
        this.drawMapCanvas();
        this.drawTilePaletteCanvas();
        this.drawSpritePaletteCanvas();
    }
    
    // lookups
    findSpriteIndexForPosition(x,y) {
        let n,sprite;
        
        x=x*this.MAP_TILE_SIZE;
        y=(y+1)*this.MAP_TILE_SIZE;

        for (n=0;n!=this.map.sprites.length;n++) {
            sprite=this.map.sprites[n];
            if ((sprite.x===x) && (sprite.y===y)) return(n);
        }
        
        return(-1);
    }
    
    findSpriteForPosition(x,y) {
        let idx=this.findSpriteIndexForPosition(x,y);
        if (idx===-1) return(null);
        return(this.map.sprites[idx]);
    }
    
    // spot editing
    clearSpot(x,y) {
        let spriteIdx;
        
        // is there a sprite?
        spriteIdx=this.findSpriteIndexForPosition(x,y);
        if (spriteIdx!==-1) {
            this.map.removeSprite(spriteIdx);
            return;
        }
        
        // otherwise remove tile
        this.map.tileData[x+(y*this.MAP_TILE_WIDTH)]=0;
    }
    
    setSpotSprite(x,y,idx) {
        // if there is already a sprite in this position, then just return that one
        let spriteIdx=this.findSpriteIndexForPosition(x,y);
        if (spriteIdx!==-1) return(spriteIdx);
        
        // otherwise make a new one
        return(this.map.addSprite(this.spritePaletteList[idx].duplicate((x*this.MAP_TILE_SIZE),((y+1)*this.MAP_TILE_SIZE))));
    }
    
    setSpotTile(x,y,idx) {
        this.map.tileData[x+(y*this.MAP_TILE_WIDTH)]=idx+1;
    }
    
    // click map canvas
    leftMouseDownMapCanvas(event) {
        let spriteIdx;
        
        // if space is down, we are starting a scroll
        if (this.spaceDown) {
            this.dragMode=this.DRAG_SCROLL;
            this.dragStartX=-1;
            this.dragStartY=-1;
            return;
        }
        
        // move the select
        this.selectX=this.offsetX+Math.trunc(event.offsetX/this.MAP_TILE_SIZE);
        this.selectY=this.offsetY+Math.trunc(event.offsetY/this.MAP_TILE_SIZE);
        
        // if there is a sprite, then we move that
        this.dragSprite=this.findSpriteForPosition(this.selectX,this.selectY);
        if (this.dragSprite!=null) {
            this.dragMode=this.DRAG_SPRITE;
        }
        
        else {
            
            // a dropped selection
            if (this.paletteSelIndex!==-1) {
            
                // if it's a sprite in the palette, then drop that and move it
                if (this.paletteSelType===this.PALETTE_SPRITE) {
                    spriteIdx=this.setSpotSprite(this.selectX,this.selectY,this.paletteSelIndex);
                    this.dragSprite=this.map.sprites[spriteIdx];
                    this.dragMode=this.DRAG_SPRITE;
                }
                else {
                    this.setSpotTile(this.selectX,this.selectY,this.paletteSelIndex);
                    this.dragMode=this.DRAG_DRAW_TILE;
                }
            }
        }
        
         this.drawMapCanvas();
    }
    
    leftMouseUpMapCanvas(event) {
        this.dragMode=this.DRAG_NONE;
    }
    
    leftMouseMoveMapCanvas(event) {
        let x,y,max;
        
        // no dragging
        if (this.dragMode===this.DRAG_NONE) return;
        
        // some type of dragging, handle event
        event.stopPropagation();
        event.preventDefault();
        
        // scroll drag
        if (this.dragMode===this.DRAG_SCROLL) {
            // first time
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

        this.selectX=this.offsetX+Math.trunc(event.offsetX/this.MAP_TILE_SIZE);
        this.selectY=this.offsetY+Math.trunc(event.offsetY/this.MAP_TILE_SIZE);

        // sprite dragging
        if (this.dragMode===this.DRAG_SPRITE) {
            this.dragSprite.x=this.selectX*this.MAP_TILE_SIZE;
            this.dragSprite.y=(this.selectY+1)*this.MAP_TILE_SIZE;
            
            this.drawMapCanvas();
            return;
        }
            
        // sprite dragging
        if (this.dragMode===this.DRAG_DRAW_TILE) {
            this.setSpotTile(this.selectX,this.selectY,this.paletteSelIndex);
            
            this.drawMapCanvas();
            return;
        }
    }
    
    wheelMapCanvas(event) {
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
    
    // click tile canvas
    clickTilePaletteCanvas(event) {
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
    
    // click palette canvas
    clickSpritePaletteCanvas(event) {
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
    
    // keys
    keyDownMapCanvas(event) {
        if ((event.key===' ') && (!this.spaceDown)) {
            this.spaceDown=true;
            this.mapCanvas.style.cursor='grab';
            return;
        }
    }
    
    keyUpMapCanvas(event) {
        if (event.key===' ') {
            this.spaceDown=false;
            this.mapCanvas.style.cursor='default';
            return;
        }
        
        if ((event.key==='Backspace') || (event.key==='Delete')) {
            this.clearSpot(this.selectX,this.selectY);
            this.drawMapCanvas();
            return;
        }
    }
    
    // toolbar buttons
    mapUp() {
        let x,y,my,sprite;
        
        for (y=this.selectY;(y+1)<(this.MAP_TILE_HEIGHT);y++) {
            for (x=0;x!=this.MAP_TILE_WIDTH;x++) {
                this.map.tileData[(y*this.MAP_TILE_WIDTH)+x]=this.map.tileData[((y+1)*this.MAP_TILE_WIDTH)+x];
            }
        }

        for (x=0;x!=this.MAP_TILE_WIDTH;x++) {
            this.map.tileData[((this.MAP_TILE_HEIGHT-1)*this.MAP_TILE_WIDTH)+x]=0;
        }
        
        my=this.selectY*this.MAP_TILE_SIZE;
        
        for (sprite of this.map.sprites) {
            if (sprite.y>my) sprite.y-=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapDown() {
        let x,y,my,sprite;
        
        for (y=(this.MAP_TILE_HEIGHT-1);y>this.selectY;y--) {
            for (x=0;x!=this.MAP_TILE_WIDTH;x++) {
                this.map.tileData[(y*this.MAP_TILE_WIDTH)+x]=this.map.tileData[((y-1)*this.MAP_TILE_WIDTH)+x];
            }
        }

        for (x=0;x!=this.MAP_TILE_WIDTH;x++) {
            this.map.tileData[(this.selectY*this.MAP_TILE_WIDTH)+x]=0;
        }
        
        my=this.selectY*this.MAP_TILE_SIZE;
        
        for (sprite of this.map.sprites) {
            if ((sprite.y>my) && (sprite.y<=((this.MAP_TILE_HEIGHT-1)*this.MAP_TILE_SIZE))) sprite.y+=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapLeft() {
        let x,y,mx,sprite;
        
        if (this.selectX===0) return;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            for (x=this.selectX;x!==(this.MAP_TILE_WIDTH-1);x++) {
                this.map.tileData[(y*this.MAP_TILE_WIDTH)+x]=this.map.tileData[(y*this.MAP_TILE_WIDTH)+(x+1)];
            }
            this.map.tileData[(y*this.MAP_TILE_WIDTH)+(this.MAP_TILE_WIDTH-1)]=0;
        }
        
        mx=this.selectX*this.MAP_TILE_SIZE;
        
        for (sprite of this.map.sprites) {
            if (sprite.x>mx) sprite.x-=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapRight() {
        let x,y,mx,sprite;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            for (x=(this.MAP_TILE_WIDTH-1);x>this.selectX;x--) {
                this.map.tileData[(y*this.MAP_TILE_WIDTH)+x]=this.map.tileData[(y*this.MAP_TILE_WIDTH)+(x-1)];
            }
            this.map.tileData[(y*this.MAP_TILE_WIDTH)+this.selectX]=0;
        }
        
        mx=this.selectX*this.MAP_TILE_SIZE;
        
        for (sprite of this.map.sprites) {
            if ((sprite.x>mx) && (sprite.x<=(this.MAP_TILE_WIDTH-1)*this.MAP_TILE_SIZE)) sprite.x+=this.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    // info
    infoOpen() {
        let n,idx;
        let sprite=this.findSpriteForPosition(this.selectX,this.selectY);
        if (sprite==null) return;
        
        idx=0;
        
        for (name of sprite.data.keys()) {
            document.getElementById('editorInfoName'+idx).value=name;
            document.getElementById('editorInfoValue'+idx).value=sprite.data.get(name);
            idx++;
        }
        
        for (n=idx;n<10;n++) {
            document.getElementById('editorInfoName'+n).value='';
            document.getElementById('editorInfoValue'+n).value='';
        }
        
        document.getElementById('editorFade').style.display='';
        document.getElementById('editorInfo').style.display='';
    }
    
    infoOk() {
        let n,name;
        let sprite=this.findSpriteForPosition(this.selectX,this.selectY);
        let data=new Map();
        
        for (n=0;n!=10;n++) {
            name=document.getElementById('editorInfoName'+n).value;
            if (name!=='') {
                data.set(name,document.getElementById('editorInfoValue'+n).value);
            }
        }
        
        sprite.data=data;
        
        document.getElementById('editorFade').style.display='none';
        document.getElementById('editorInfo').style.display='none';
    }
    
    infoCancel() {
        document.getElementById('editorFade').style.display='none';
        document.getElementById('editorInfo').style.display='none';
    }
    
    // compiling
    compile() {
        let n,sprite,first,str;
        
        // map tiles      
        str='    create() {\r\n';
        str+='        this.createTileData=new Uint16Array([';
        
        for (n=0;n!=this.map.tileData.length;n++) {
            if (n!==0) str+=',';
            if ((n%this.MAP_TILE_WIDTH)===0) str+='\r\n            ';
            str+=this.map.tileData[n].toString();
        }
        
        str+='\r\n        ]);\r\n\r\n';
        
        // sprites
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
        
        // copy to clipboard
        navigator.clipboard.writeText(str);
        
        alert('Class copied to clipboard');
    }
    
}
