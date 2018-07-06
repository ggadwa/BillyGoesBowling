export default class EditorClass
{
    constructor(game)
    {
        this.game=game;
        this.map=null;
        
        this.MAP_TILE_WIDTH=256;
        this.MAP_TILE_HEIGHT=128;
        
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
        
        Object.seal(this);
    }
    
    initialize()
    {
            // canvas and contextes
            
        this.mapCanvas=document.getElementById('editorMapCanvas');
        this.mapCanvas.onclick=this.leftClickMapCanvas.bind(this);
        this.mapCanvas.oncontextmenu=this.rightClickMapCanvas.bind(this);
        this.mapCTX=this.mapCanvas.getContext('2d');
        
        this.tilePaletteCanvas=document.getElementById('editorTilePaletteCanvas');
        this.tilePaletteCanvas.onclick=this.clickTilePaletteCanvas.bind(this);
        this.tilePaletteCTX=this.tilePaletteCanvas.getContext('2d');
        
        this.spritePaletteCanvas=document.getElementById('editorSpritePaletteCanvas');
        this.spritePaletteCanvas.onclick=this.clickSpritePaletteCanvas.bind(this);
        this.spritePaletteCTX=this.spritePaletteCanvas.getContext('2d');
        
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
        
            // if tileData or sprites are null, then
            // start with a clear map
            
        if (this.map.tileData===null) this.map.tileData=new Uint16Array(this.MAP_TILE_WIDTH*this.MAP_TILE_HEIGHT);
        if (this.map.sprites===null) this.map.sprites=[];
        
        this.refresh();
    }
    
        //
        // draw canvases
        //
        
    drawMapCanvas()
    {
        let x,y,dx,dy,idx,tileIdx,sprite;
        let img,rgt,bot;
        let ctx=this.mapCTX;
        let tiles=this.game.tileImageList;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.mapCanvas.width,this.mapCanvas.height);
        
            // tiles
            
        idx=0;
        dy=0;
        
        for (y=0;y!==this.MAP_TILE_HEIGHT;y++) {
            
            dx=0;
            
            for (x=0;x!==this.MAP_TILE_WIDTH;x++) {
                tileIdx=this.map.tileData[idx]-1;
                if (tileIdx!==-1) ctx.drawImage(tiles[tileIdx],dx,dy);
                
                idx++;
                dx+=64;
            }
            
            dy+=64;
        }
        
            // entities
        
        for (sprite of this.map.sprites) {
            img=sprite.editorImage;
            dx=sprite.x*64;
            dy=((sprite.y+1)*64)-img.height;
            ctx.drawImage(img,dx,dy);
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
        this.drawTilePaletteCanvas();
        this.drawSpritePaletteCanvas();
    }
    
        //
        // lookups
        //
        
    findSpriteIndexForPosition(x,y)
    {
        let n,sprite;

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
        if (this.paletteSelIndex===-1) return;
        
        switch (this.paletteSelType) {
            case this.PALETTE_TILE:
                this.map.tileData[idx]=this.paletteSelIndex+1;
                break;
            case this.PALETTE_SPRITE:
                this.map.addSprite(this.spritePaletteList[this.paletteSelIndex].duplicate(x,y));
                break;
        }
    }
    
        //
        // click canvases
        //
        
    leftClickMapCanvas(event)
    {
        let wid=this.mapCanvas.width;
        let x=Math.floor(event.offsetX/64);
        let y=Math.floor(event.offsetY/64);
        let idx=x+(y*Math.floor(wid/64));
        
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
    
    rightClickMapCanvas(event)
    {
        let spriteIdx;
        let x=Math.floor(event.offsetX/64);
        let y=Math.floor(event.offsetY/64);
        
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
        let idx=Math.floor(x/64)+(Math.floor(y/64)*Math.floor(wid/64));
        
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
        let idx=Math.floor(x/64)+(Math.floor(y/64)*Math.floor(wid/64));
        
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
        
        str='        this.tileData=new Uint16Array([';
        
        for (n=0;n!=this.map.tileData.length;n++) {
            if (n!==0) str+=',';
            if ((n%this.MAP_TILE_WIDTH)===0) str+="\r\n            ";
            str+=this.map.tileData[n].toString();
        }
        
        str+='\r\n        ]);\r\n\r\n';
        
        str+='        this.sprites=[\r\n'
        
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
        
        str+='\r\n        ];\r\n\r\n';
        
        textArea.value=str;
            
            // show
            
        div.style.display='';
        
            // select it
            
        textArea.focus();
        textArea.select();
    }
    
}
