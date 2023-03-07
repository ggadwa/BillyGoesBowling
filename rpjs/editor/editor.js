import MapClass from '../engine/map.js';
import EditorSpriteClass from './editor_sprite.js';

export default class EditorClass {
    
    static PALETTE_TILE=0;
    static PALETTE_SPRITE=1;
    
    static DRAG_NONE=-1;
    static DRAG_SCROLL=0;
    static DRAG_SPRITE=1;
    static DRAG_DRAW_TILE=2;   
        
    constructor(game) {
        this.game=game;
        
        this.mapCanvas=null;
        this.mapCTX=null;
        
        this.tilePaletteCanvas=null;
        this.tilePaletteCTX=null;
        
        this.spritePaletteCanvas=null;
        this.spritePaletteCTX=null;
        
        this.spritePaletteList=null; // preloaded sprites that we use for the palette
        
        this.tileData=null;
        this.sprites=null;
        
        this.paletteSelType=EditorClass.PALETTE_TILE;
        this.paletteSelIndex=-1;
        
        this.offsetX=0;
        this.offsetY=0;
        
        this.selectX=0;
        this.selectY=0;
        
        this.spaceDown=false;
        this.dragMode=EditorClass.DRAG_NONE;
        this.dragOriginalOffsetX=0;
        this.dragOriginalOffsetY=0;
        this.dragStartX=-1;
        this.dragStartY=-1;
        this.dragSprite=null;
        
        this.infoSprite=null;
        
        Object.seal(this);
    }
    
    async initialize() {
        let mapName;
        let sel,opt;
        
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
        document.getElementById('mapCombo').onchange=this.loadMap.bind(this);
        document.getElementById('clearSelectionButton').onclick=this.clearSelection.bind(this);
        document.getElementById('mapUpButton').onclick=this.mapUp.bind(this);
        document.getElementById('mapDownButton').onclick=this.mapDown.bind(this);
        document.getElementById('mapLeftButton').onclick=this.mapLeft.bind(this);
        document.getElementById('mapRightButton').onclick=this.mapRight.bind(this);
        document.getElementById('spriteInfo').onclick=this.infoOpen.bind(this);
        document.getElementById('compileButton').onclick=this.compile.bind(this);
        
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
        
        // load the image list
        try {
            await this.game.imageList.initialize();
        }
        catch (e) {
            alert(e);
            return;
        }

        // the tile list is a list of all the loaded images from the tile subdirectory
        this.game.tileImageList=this.game.imageList.getArrayOfImageByPrefix('tiles/');

        // get a set of classes for the entities we can put in this map
        this.spritePaletteList=this.game.getEditorSpritePaletteList();
        
        // start with blank map
        this.tileData=new Uint16Array(MapClass.MAP_TILE_WIDTH*MapClass.MAP_TILE_HEIGHT);
        this.sprites=[];

        // the map combo
        sel=document.getElementById('mapCombo');
        
        opt=document.createElement('option');
        opt.value='';
        opt.text='[blank map]';
        sel.add(opt);
        
        for (mapName of this.game.mapList.sortedNames()) {
            opt=document.createElement('option');
            opt.value=opt.text=mapName;
            sel.add(opt);
        }
        
        sel.selectIndex=0;
       
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
    
    // find good starting block on first row with blocks
    setOffsetToFirstVisibleBlock() {
        let x,y;
        
        this.offsetX=0;
        this.offsetY=0;
        
        for (x=0;x!=MapClass.MAP_TILE_WIDTH;x++) {
            for (y=0;y!=MapClass.MAP_TILE_HEIGHT;y++) {
                if (this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]!==0) {
                    this.offsetX=x;
                    this.offsetY=y;
                    return;
                }
            }
        }
    }
    
    // load a map
    loadMap() {
        let map,mapName,engineSprite;
        
        mapName=document.getElementById('mapCombo').value;
        
        // blank map
        if (mapName==='') {
            this.tileData=new Uint16Array(MapClass.MAP_TILE_WIDTH*MapClass.MAP_TILE_HEIGHT);
            this.sprites=[];
            
            this.offsetX=0;
            this.offsetY=0;
        }
        
        // load map
        else {
            map=this.game.mapList.get(mapName);
        
            map.create(); // get the create copy to the working copy so we can make changes
            this.tileData=map.createTileData.slice();
            
            // need to turn engine sprites into editor sprites
            this.sprites=[];
            
            for (engineSprite of map.createSprites) {
                this.sprites.push(new EditorSpriteClass(engineSprite.constructor.name,engineSprite.currentImage,engineSprite.x,engineSprite.y,engineSprite.data));
            }
       
            // get offset on first visible block
            this.setOffsetToFirstVisibleBlock();
        }
        
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
        rx=lx+(Math.trunc(this.mapCanvas.width/MapClass.MAP_TILE_SIZE)+1);
        if (rx>MapClass.MAP_TILE_WIDTH) rx=MapClass.MAP_TILE_WIDTH;
            
        ty=this.offsetY;
        by=ty+(Math.trunc(this.mapCanvas.height/MapClass.MAP_TILE_SIZE)+1);
        if (by>MapClass.MAP_TILE_HEIGHT) by=MapClass.MAP_TILE_HEIGHT;
        
        // clear
        ctx.fillStyle='#FFFFFF';
        ctx.fillRect(0,0,this.mapCanvas.width,this.mapCanvas.height);
        
        // tiles
        for (y=ty;y!==by;y++) {
            for (x=lx;x!==rx;x++) {
                tileIdx=this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]-1;
                if (tileIdx!==-1) ctx.drawImage(tiles[tileIdx],((x-lx)*MapClass.MAP_TILE_SIZE),((y-ty)*MapClass.MAP_TILE_SIZE));
            }
        }
        
        // entities
        for (sprite of this.sprites) {
            img=sprite.img;
            
            dx=sprite.x;
            if (dx>(rx*MapClass.MAP_TILE_SIZE)) continue;
            if ((dx+img.width)<(lx*MapClass.MAP_TILE_SIZE)) continue;
            
            dy=sprite.y-img.height;
            if (dy>(by*MapClass.MAP_TILE_SIZE)) continue;
            if ((dy+img.height)<(ty*MapClass.MAP_TILE_SIZE)) continue;
            
            ctx.drawImage(img,(dx-(lx*MapClass.MAP_TILE_SIZE)),(dy-(ty*MapClass.MAP_TILE_SIZE)));
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
            dy+=MapClass.MAP_TILE_SIZE;
        }
            
        dx=0;
            
        for (x=lx;x!==rx;x++) {
            ctx.beginPath();
            ctx.moveTo(dx,0);
            ctx.lineTo(dx,this.mapCanvas.height);
            ctx.stroke();
            dx+=MapClass.MAP_TILE_SIZE;
        }
        
        ctx.strokeStyle='#000000';
        ctx.setLineDash([]);

        // cell numbers
        ctx.font='16px Arial';
        ctx.fillStyle='#000000';
        ctx.textAlign='center';
        ctx.textBaseline='alphabetic';

        textOffset=Math.trunc(MapClass.MAP_TILE_SIZE*0.5);
        
        dy=15;
        
        for (x=lx;x!==rx;x++) {
            ctx.fillText((''+x),(((x-lx)*MapClass.MAP_TILE_SIZE)+textOffset),dy);
        }
        
        ctx.textAlign='left';
        ctx.textBaseline='middle';

        dx=5;
        
        for (y=ty;y!==by;y++) {
            ctx.fillText((''+y),dx,(((y-ty)*MapClass.MAP_TILE_SIZE)+textOffset));
        }
        
        // selected sprite
        if ((this.selectX>=lx) && (this.selectX<rx) && (this.selectY>=ty) && (this.selectY<by)) {
            dx=(this.selectX-lx)*MapClass.MAP_TILE_SIZE;
            dy=(this.selectY-ty)*MapClass.MAP_TILE_SIZE;
            ctx.strokeStyle='#FF0000';
            ctx.lineWidth=2.0;
            ctx.strokeRect(dx,dy,MapClass.MAP_TILE_SIZE,MapClass.MAP_TILE_SIZE);
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
        
        // the erase tile
        
        ctx.font='48px Material Symbols Outlined';
        ctx.fillStyle='#000055';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText('delete_forever',(x+(MapClass.MAP_TILE_SIZE/2)),(y+((MapClass.MAP_TILE_SIZE/2)+3)));
         
        x+=MapClass.MAP_TILE_SIZE;
        
        // the tiles
        for (tile of tiles) {
            ctx.drawImage(tile,x,y);
            
            x+=MapClass.MAP_TILE_SIZE;
            if ((x+MapClass.MAP_TILE_SIZE)>=wid) {
                x=0;
                y+=MapClass.MAP_TILE_SIZE;
            }
        }
        
        // the selection
        if ((this.paletteSelType===EditorClass.PALETTE_TILE) && (this.paletteSelIndex!==-1)) {
            ctx.strokeStyle='#FF3333';
            ctx.lineWidth=4;
            
            cnt=Math.trunc(wid/MapClass.MAP_TILE_SIZE);
            x=(this.paletteSelIndex%cnt)*MapClass.MAP_TILE_SIZE;
            y=Math.trunc(this.paletteSelIndex/cnt)*MapClass.MAP_TILE_SIZE;
            
            ctx.beginPath();
            ctx.rect(x,y,MapClass.MAP_TILE_SIZE,MapClass.MAP_TILE_SIZE);
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
            ctx.drawImage(img,x,y,Math.min(MapClass.MAP_TILE_SIZE,img.width),Math.min(MapClass.MAP_TILE_SIZE,img.height));      // sprites can be bigger than map tile size
            
            x+=MapClass.MAP_TILE_SIZE;
            if ((x+MapClass.MAP_TILE_SIZE)>=wid) {
                x=0;
                y+=MapClass.MAP_TILE_SIZE;
            }
        }
        
        // the selection
        if ((this.paletteSelType===EditorClass.PALETTE_SPRITE) && (this.paletteSelIndex!==-1)) {
            ctx.strokeStyle='#FF3333';
            ctx.lineWidth=4;
            
            cnt=Math.trunc(wid/MapClass.MAP_TILE_SIZE);
            x=(this.paletteSelIndex%cnt)*MapClass.MAP_TILE_SIZE;
            y=Math.trunc(this.paletteSelIndex/cnt)*MapClass.MAP_TILE_SIZE;
            
            ctx.beginPath();
            ctx.rect(x,y,MapClass.MAP_TILE_SIZE,MapClass.MAP_TILE_SIZE);
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
        
        x=x*MapClass.MAP_TILE_SIZE;
        y=(y+1)*MapClass.MAP_TILE_SIZE;

        for (n=0;n!=this.sprites.length;n++) {
            sprite=this.sprites[n];
            if ((sprite.x===x) && (sprite.y===y)) return(n);
        }
        
        return(-1);
    }
    
    findSpriteForPosition(x,y) {
        let idx=this.findSpriteIndexForPosition(x,y);
        if (idx===-1) return(null);
        return(this.sprites[idx]);
    }
    
    // spot editing
    clearSpot(x,y) {
        let spriteIdx;
        
        // is there a sprite?
        spriteIdx=this.findSpriteIndexForPosition(x,y);
        if (spriteIdx!==-1) {
            this.sprites.splice(spriteIdx,1);
            return;
        }
        
        // otherwise remove tile
        this.tileData[x+(y*MapClass.MAP_TILE_WIDTH)]=0;
    }
    
    setSpotSprite(x,y,idx) {
        let engineSprite;
        
        // if there is already a sprite in this position, then just return that one
        let spriteIdx=this.findSpriteIndexForPosition(x,y);
        if (spriteIdx!==-1) return(spriteIdx);
        
        // otherwise make a new one
        engineSprite=this.spritePaletteList[idx];
        return(this.sprites.push(new EditorSpriteClass(engineSprite.constructor.name,engineSprite.currentImage,(x*MapClass.MAP_TILE_SIZE),((y+1)*MapClass.MAP_TILE_SIZE),null))-1);
    }
    
    setSpotTile(x,y,idx) {
        if (idx!==-1) this.tileData[x+(y*MapClass.MAP_TILE_WIDTH)]=idx;
    }
    
    // click map canvas
    leftMouseDownMapCanvas(event) {
        let spriteIdx;
        
        // if space is down, we are starting a scroll
        if (this.spaceDown) {
            this.dragMode=EditorClass.DRAG_SCROLL;
            this.dragStartX=-1;
            this.dragStartY=-1;
            return;
        }
        
        // move the select
        this.selectX=this.offsetX+Math.trunc(event.offsetX/MapClass.MAP_TILE_SIZE);
        this.selectY=this.offsetY+Math.trunc(event.offsetY/MapClass.MAP_TILE_SIZE);
        
        // if there is a sprite, then we move that
        this.dragSprite=this.findSpriteForPosition(this.selectX,this.selectY);
        if (this.dragSprite!=null) {
            this.dragMode=EditorClass.DRAG_SPRITE;
        }
        
        else {
            // if it's a sprite in the palette, then drop that and move it
            if (this.paletteSelType===EditorClass.PALETTE_SPRITE) {
                spriteIdx=this.setSpotSprite(this.selectX,this.selectY,this.paletteSelIndex);
                this.dragSprite=this.sprites[spriteIdx];
                this.dragMode=EditorClass.DRAG_SPRITE;
            }
            else {
                this.setSpotTile(this.selectX,this.selectY,this.paletteSelIndex);
                this.dragMode=EditorClass.DRAG_DRAW_TILE;
            }
        }
        
         this.drawMapCanvas();
    }
    
    leftMouseUpMapCanvas(event) {
        this.dragMode=EditorClass.DRAG_NONE;
    }
    
    leftMouseMoveMapCanvas(event) {
        let x,y,max;
        
        // no dragging
        if (this.dragMode===EditorClass.DRAG_NONE) return;
        
        // some type of dragging, handle event
        event.stopPropagation();
        event.preventDefault();
        
        // scroll drag
        if (this.dragMode===EditorClass.DRAG_SCROLL) {
            // first time
            if (this.dragStartX===-1) {
                this.dragStartX=event.offsetX;
                this.dragStartY=event.offsetY;
                this.dragOriginalOffsetX=this.offsetX;
                this.dragOriginalOffsetY=this.offsetY;
                return;
            }

            // otherwise start dragging
            x=this.dragOriginalOffsetX+Math.trunc((this.dragStartX-event.offsetX)/MapClass.MAP_TILE_SIZE);
            if (x<0) x=0;
            max=MapClass.MAP_TILE_WIDTH-Math.trunc(this.mapCanvas.width/MapClass.MAP_TILE_SIZE);
            if (x>max) x=max;

            y=this.dragOriginalOffsetY+Math.trunc((this.dragStartY-event.offsetY)/MapClass.MAP_TILE_SIZE);
            if (y<0) y=0;
            max=MapClass.MAP_TILE_HEIGHT-Math.trunc(this.mapCanvas.height/MapClass.MAP_TILE_SIZE);
            if (y>max) y=max;

            if ((x===this.offsetX) && (y===this.offsetY)) return;

            this.offsetX=x;
            this.offsetY=y;

            this.drawMapCanvas();
            return;
        }

        this.selectX=this.offsetX+Math.trunc(event.offsetX/MapClass.MAP_TILE_SIZE);
        this.selectY=this.offsetY+Math.trunc(event.offsetY/MapClass.MAP_TILE_SIZE);

        // sprite dragging
        if (this.dragMode===EditorClass.DRAG_SPRITE) {
            this.dragSprite.x=this.selectX*MapClass.MAP_TILE_SIZE;
            this.dragSprite.y=(this.selectY+1)*MapClass.MAP_TILE_SIZE;
            
            this.drawMapCanvas();
            return;
        }
            
        // sprite dragging
        if (this.dragMode===EditorClass.DRAG_DRAW_TILE) {
            this.setSpotTile(this.selectX,this.selectY,this.paletteSelIndex);
            
            this.drawMapCanvas();
            return;
        }
    }
    
    wheelMapCanvas(event) {
        let x,y,max;
        
        x=this.offsetX+Math.sign(event.deltaX);
        if (x<0) x=0;
        max=MapClass.MAP_TILE_WIDTH-Math.trunc(this.mapCanvas.width/MapClass.MAP_TILE_SIZE);
        if (x>max) x=max;
        
        y=this.offsetY+Math.sign(event.deltaY);
        if (y<0) y=0;
        max=MapClass.MAP_TILE_HEIGHT-Math.trunc(this.mapCanvas.height/MapClass.MAP_TILE_SIZE);
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
        let idx=Math.trunc(x/MapClass.MAP_TILE_SIZE)+(Math.trunc(y/MapClass.MAP_TILE_SIZE)*Math.trunc(wid/MapClass.MAP_TILE_SIZE));
        
        if (idx>=this.game.tileImageList.length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=EditorClass.PALETTE_TILE;
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
        let idx=Math.trunc(x/MapClass.MAP_TILE_SIZE)+(Math.trunc(y/MapClass.MAP_TILE_SIZE)*Math.trunc(wid/MapClass.MAP_TILE_SIZE));
        
        if (idx>=this.spritePaletteList.length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=EditorClass.PALETTE_SPRITE;
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
    
    // clear selection buttons
    clearSelection() {
        this.paletteSelType=EditorClass.PALETTE_TILE;
        this.paletteSelIndex=-1;
        
        this.refresh();
    }
    
    // whole map move buttons
    mapUp() {
        let x,y,my,sprite;
        
        if (this.selectY===0) return;
        
        for (y=(this.selectY-1);(y+1)<(MapClass.MAP_TILE_HEIGHT);y++) {
            for (x=0;x!=MapClass.MAP_TILE_WIDTH;x++) {
                this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]=this.tileData[((y+1)*MapClass.MAP_TILE_WIDTH)+x];
            }
        }

        for (x=0;x!=MapClass.MAP_TILE_WIDTH;x++) {
            this.tileData[((MapClass.MAP_TILE_HEIGHT-1)*MapClass.MAP_TILE_WIDTH)+x]=0;
        }
        
        my=this.selectY*MapClass.MAP_TILE_SIZE;
        
        for (sprite of this.sprites) {
            if (sprite.y>=my) sprite.y-=MapClass.MAP_TILE_SIZE;
        }
        
        this.selectY--;
        
        this.drawMapCanvas();
    }
    
    mapDown() {
        let x,y,my,sprite;
        
        for (y=(MapClass.MAP_TILE_HEIGHT-1);y>this.selectY;y--) {
            for (x=0;x!=MapClass.MAP_TILE_WIDTH;x++) {
                this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]=this.tileData[((y-1)*MapClass.MAP_TILE_WIDTH)+x];
            }
        }

        for (x=0;x!=MapClass.MAP_TILE_WIDTH;x++) {
            this.tileData[(this.selectY*MapClass.MAP_TILE_WIDTH)+x]=0;
        }
        
        my=this.selectY*MapClass.MAP_TILE_SIZE;
        
        for (sprite of this.sprites) {
            if ((sprite.y>=my) && (sprite.y<=((MapClass.MAP_TILE_HEIGHT-1)*MapClass.MAP_TILE_SIZE))) sprite.y+=MapClass.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    mapLeft() {
        let x,y,mx,sprite;
        
        if (this.selectX===0) return;
        
        for (y=0;y!==MapClass.MAP_TILE_HEIGHT;y++) {
            for (x=(this.selectX-1);x!==(MapClass.MAP_TILE_WIDTH-1);x++) {
                this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]=this.tileData[(y*MapClass.MAP_TILE_WIDTH)+(x+1)];
            }
            this.tileData[(y*MapClass.MAP_TILE_WIDTH)+(MapClass.MAP_TILE_WIDTH-1)]=0;
        }
        
        mx=this.selectX*MapClass.MAP_TILE_SIZE;
        
        for (sprite of this.sprites) {
            if (sprite.x>=mx) sprite.x-=MapClass.MAP_TILE_SIZE;
        }
        
        this.selectX--;
        
        this.drawMapCanvas();
    }
    
    mapRight() {
        let x,y,mx,sprite;
        
        for (y=0;y!==MapClass.MAP_TILE_HEIGHT;y++) {
            for (x=(MapClass.MAP_TILE_WIDTH-1);x>this.selectX;x--) {
                this.tileData[(y*MapClass.MAP_TILE_WIDTH)+x]=this.tileData[(y*MapClass.MAP_TILE_WIDTH)+(x-1)];
            }
            this.tileData[(y*MapClass.MAP_TILE_WIDTH)+this.selectX]=0;
        }
        
        mx=this.selectX*MapClass.MAP_TILE_SIZE;
        
        for (sprite of this.sprites) {
            if ((sprite.x>=mx) && (sprite.x<=(MapClass.MAP_TILE_WIDTH-1)*MapClass.MAP_TILE_SIZE)) sprite.x+=MapClass.MAP_TILE_SIZE;
        }
        
        this.drawMapCanvas();
    }
    
    // info
    infoOpen() {
        let n,idx;
        let sprite=this.findSpriteForPosition(this.selectX,this.selectY);
        if (sprite==null) {
            alert('No spirte selected');
            return;
        }
        
        this.infoSprite=sprite;
        
        // if blank keys, than make new keys
        if (sprite.data==null) sprite.data=new Map();
        
        // fill the dialog
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
        let data=new Map();
        
        for (n=0;n!=10;n++) {
            name=document.getElementById('editorInfoName'+n).value;
            if (name!=='') {
                data.set(name,document.getElementById('editorInfoValue'+n).value);
            }
        }
        
        if (data.size===0) {
            this.infoSprite.data=null; // blank maps are null
        }
        else {
            this.infoSprite.data=data;
        }
        
        this.infoSprite=null;
        
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
        
        for (n=0;n!=this.tileData.length;n++) {
            if (n!==0) str+=',';
            if ((n%MapClass.MAP_TILE_WIDTH)===0) str+='\r\n            ';
            str+=this.tileData[n].toString();
        }
        
        str+='\r\n        ]);\r\n\r\n';
        
        // sprites
        str+='        this.createSprites=[\r\n'
        
        first=true;
        
        for (sprite of this.sprites) {
            if (!first) str+=',\r\n';
            first=false;
            
            str+='            new ';
            str+=sprite.className;
            str+='(this.game,';
            str+=sprite.x.toString();
            str+=',';
            str+=sprite.y.toString();
            str+=',';
            if ((sprite.data==null) || (sprite.data.size===0)) {
                str+='null';
            }
            else {
                str+='new Map(';
                str+=JSON.stringify([...sprite.data]);
                str+=')';
            }
            str+=')';
        }
        
        str+='\r\n        ];\r\n';
        str+='    }\r\n';
        
        // copy to clipboard
        navigator.clipboard.writeText(str);
        
        alert('Class copied to clipboard');
    }
    
}
