import EntityClass from '../engine/entity.js';

export default class EditorClass
{
    constructor(game,map)
    {
        this.game=game;
        this.map=map;
        
        this.MAP_TILE_WIDTH=256;
        this.MAP_TILE_HEIGHT=128;
        
        this.mapCanvas=null;
        this.mapCTX=null;
        
        this.tilePaletteCanvas=null;
        this.tilePaletteCTX=null;
        
        this.entityPaletteCanvas=null;
        this.entityPaletteCTX=null;
        
        this.entityPaletteList=null;                // preloaded entities that we use for the palette
        
        this.PALETTE_TILE=0;
        this.PALETTE_ENTITY=1;
        
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
        
        this.entityPaletteCanvas=document.getElementById('editorEntityPaletteCanvas');
        this.entityPaletteCanvas.onclick=this.clickEntityPaletteCanvas.bind(this);
        this.entityPaletteCTX=this.entityPaletteCanvas.getContext('2d');
        
            // initialize the image list
            
        this.game.imageList.initialize(this.initialize2.bind(this));
    }
    
    initialize2()
    {
            // the tile list is a list of all the loaded
            // images that are of type tile
            
        this.game.tileImageList=this.game.imageList.getArrayOfImageType(this.game.imageList.IMAGE_TILE);

            // get a set of classes for the
            // entities we can put in this map
            
        this.entityPaletteList=this.game.getEditorEntityPaletteList();
        this.refresh();
    }
    
        //
        // draw canvases
        //
        
    drawMapCanvas()
    {
        let x,y,dx,dy,idx,tileIdx,entity;
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
                if (tileIdx!==-1) ctx.drawImage(tiles[tileIdx].img,dx,dy);
                
                idx++;
                dx+=64;
            }
            
            dy+=64;
        }
        
            // entities
        
        for (entity of this.map.entityList) {
            dx=entity.x*64;
            dy=entity.y*64;
            console.log(entity.constructor.name+'='+entity.editorImage);
            img=entity.editorImage.img;
            ctx.drawImage(img,dx,dy,Math.min(64,img.width),Math.min(64,img.height));       // some sprites are bigger than 64x64
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
            ctx.drawImage(tile.img,x,y);
            
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
    
    drawEntityPaletteCanvas()
    {
        let x,y,entity,img,cnt;
        let wid=this.entityPaletteCanvas.width;
        let ctx=this.entityPaletteCTX;
        
            // clear
            
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(0,0,this.entityPaletteCanvas.width,this.entityPaletteCanvas.height);
        
        x=0;
        y=0;
        
            // the images
            
        for (entity of this.entityPaletteList) {
            img=entity.editorImage.img;
            ctx.drawImage(img,x,y,Math.min(64,img.width),Math.min(64,img.height));      // sprites can be bigger than 64/64
            
            x+=64;
            if (x>=wid) {
                x=0;
                y+=64;
            }
        }
        
            // the selection
            
        if ((this.paletteSelType===this.PALETTE_ENTITY) && (this.paletteSelIndex!==-1)) {
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
        this.drawEntityPaletteCanvas();
    }
    
        //
        // lookups
        //
        
    findEntityIndexForPosition(x,y)
    {
        let n,entity;

        for (n=0;n!=this.map.entityList.length;n++) {
            entity=this.map.entityList[n];
            if ((entity.x===x) && (entity.y===y)) return(n);
        }
        
        return(-1);
    }
    
    findEntityForPosition(x,y)
    {
        let idx=this.findEntityIndexForPosition(x,y);
        if (idx===-1) return(null);
        return(this.map.entityList[idx]);
    }
    
        //
        // spot editing
        //
        
    clearSpot(x,y,idx)
    {
        let entityIdx;
        
            // is there a sprite?
        
        entityIdx=this.findEntityIndexForPosition(x,y);
        if (entityIdx!==-1) {
            this.map.entityList.splice(entityIdx,1);
            return;
        }
        
            // otherwise remove tile
            
        this.map.tileData[idx]=0;
    }
    
    setSpot(x,y,idx)
    {
        let entity,orgEntity;
        
        if (this.paletteSelIndex===-1) return;
        
        switch (this.paletteSelType) {
            case this.PALETTE_TILE:
                this.map.tileData[idx]=this.paletteSelIndex+1;
                break;
            case this.PALETTE_ENTITY:
                orgEntity=this.entityPaletteList[this.paletteSelIndex];
                entity=Object.assign(Object.create(orgEntity),orgEntity);
                entity.x=x;
                entity.y=y;
                this.map.entityList.push(entity);
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
        let entityIdx;
        let x=Math.floor(event.offsetX/64);
        let y=Math.floor(event.offsetY/64);
        
        event.stopPropagation();
        event.preventDefault();
        
            // edit entity data
            
        entityIdx=this.findEntityIndexForPosition(x,y);
        if (entityIdx===-1) return;
        
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
        this.drawEntityPaletteCanvas();
    }
    
    clickEntityPaletteCanvas(event)
    {
        let wid=this.entityPaletteCanvas.width;
        let x=event.offsetX;
        let y=event.offsetY;
        let idx=Math.floor(x/64)+(Math.floor(y/64)*Math.floor(wid/64));
        
        if (idx>=this.entityPaletteList.length) {
            this.paletteSelIndex=-1;
        }
        else {
            this.paletteSelType=this.PALETTE_ENTITY;
            this.paletteSelIndex=idx;
        }
        
        this.drawTilePaletteCanvas();
        this.drawEntityPaletteCanvas();
    }
    
        //
        // compiling
        //
        
    compile()
    {
        let n,entity,first,str;
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
        
        str+='        this.entityList=[\r\n'
        
        first=true;
        
        for (entity of this.map.entityList) {
            if (!first) str+=',\r\n';
            first=false;
            
            str+='            new EntityClass(this.game,';
            str+=entity.x.toString();
            str+=",";
            str+=entity.y.toString();
            str+=",new Map([";
            str+=JSON.stringify([...entity.data]);
            str+=")))";
        }
        
        str+='\r\n        ];\r\n\r\n';
        
        textArea.value=str;
            
            // show
            
        div.style.display='';
        
            // select all of it
            
        textArea.focus();
        textArea.select();
    }
    
}
