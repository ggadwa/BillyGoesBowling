import MapClass from './map.js';
import LiquidClass from './liquid.js';
import ImageListClass from '../resources/image_list.js';
import SoundListClass from '../resources/sound_list.js';
import InputClass from './input.js';

export default class GameClass
{
    constructor()
    {
        this.canvas=null;
        this.ctx=null;
        this.canvasWidth=0;
        this.canvasHeight=0;
        
        this.backCanvas=null;
        this.backCTX=null;
        
        this.imageList=null;                    // set by overriding class
        this.soundList=null;                    // set by overriding class
        this.tileImageList=null;                // created from the image list
        this.input=new InputClass();
        
        this.timestamp=0;
        
        this.PHYSICS_TICK_FREQUENCY=33;
        this.DRAW_TICK_FREQUENCY=33;

        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        
        this.data=new Map();
        this.map=null;
        this.liquid=null;
        this.gotoMapName=null;
    }
    
    initialize(callback)
    {
        this.canvas=document.getElementById('mainCanvas');
        this.ctx=this.canvas.getContext('2d');
        
        this.canvasWidth=this.canvas.width;
        this.canvasHeight=this.canvas.height;
        
        this.backCanvas=document.createElement('canvas');
        this.backCanvas.width=this.canvasWidth;
        this.backCanvas.height=this.canvasHeight;
        this.backCTX=this.backCanvas.getContext('2d');
        
            // load the maps list
            
        this.mapList.initialize();
        
            // initialize and load the image list
        
        this.imageList.initialize(this.initialize2.bind(this,callback));
    }
    
    initialize2(callback)
    {
            // get a list of tile images
            
        this.tileImageList=this.imageList.getArrayOfImageByPrefix('tiles/');
        
            // initialize and load the sound list
            
        this.soundList.initialize(this.initialize3.bind(this,callback));
    }
   
    initialize3(callback)
    {
        this.input.initialize();
        
            // create game specific data
            
        this.createData();
        
            // load the starting map
            
        this.map=this.getStartMap();
        this.map.initialize();
        
            // the liquid object
            
        this.liquid=new LiquidClass(this);
        
        callback();
    }
    
    initTiming(timestamp)
    {
        this.physicsTimestamp=timestamp;
        this.drawTimestamp=timestamp;
    }
    
    setTimestamp(timestamp)
    {
        this.timestamp=timestamp;
    }
    
    getTimestamp()
    {
        return(this.timestamp);
    }
    
    drawProgress(title,count,maxCount)
    {
        let lx=10;
        let rx=this.canvasWidth-10;
        let ty=this.canvasHeight-40;
        let by=this.canvasHeight-10;
        let fx;
        
        if (this.backCTX===null) return;        // means we are in the editor
        
            // erase the back canvas
            
        this.backCTX.fillStyle='#000000';
        this.backCTX.fillRect(0,0,this.canvasWidth,this.canvasHeight);
        
            // the progress bar
            
        fx=lx+Math.trunc(((rx-lx)*count)/maxCount);
        
        this.backCTX.fillStyle='#33FF33';
        this.backCTX.fillRect(lx,ty,(fx-lx),(by-ty));
            
        this.backCTX.strokeStyle='#EEFFEE';
        this.backCTX.strokeRect(lx,ty,(rx-lx),(by-ty));

        this.backCTX.font='24px Arial';
        this.backCTX.fillStyle='#000000';
        this.backCTX.textAlign='left';
        this.backCTX.textBaseline='alphabetic';
        this.backCTX.fillText(title,(lx+5),(by-8));
        
            // swap to forground

        this.ctx.drawImage(this.backCanvas,0,0);
    }
    
    /**
     * Override and return a set of objects based on the sprite classes
     * you want the editor to be able to place in a map.
     */
    getEditorSpritePaletteList()
    {
    }
    
    getMapOffset(offset)
    {
    }
    
    isCancelled()
    {
        return(this.input.isCancelled());
    }
    
    getData(name)
    {
        let val=this.data.get(name);
        return((val===undefined)?null:val);
    }
    
    setData(name,value)
    {
        this.data.set(name,value);
    }
    
    gotoMap(name)
    {
        this.gotoMapName=name;
    }
    
    /**
     * Override this to create any data that needs to be
     * persisted for game state.
     */
    createData()
    {
    }
            
    /**
     * Override this to return the the starting map object.
     * 
     * @returns {MapClass}
     */
    getStartMap()
    {
    }
        
    /**
     * Override this to run any game based AI, it is called before
     * any sprite AI.
     */
    runAI()
    {
    }
    
    /**
     * Override this to draw the UI.  Use the drawUIImage, setupUIText,
     * and drawUIText methods to draw the UI.
     */
    drawUI()
    {
    }
    
    drawSetAlpha(alpha)
    {
        this.backCTX.globalAlpha=alpha;
    }
    
    drawUIImage(name,x,y)
    {
        this.backCTX.drawImage(this.imageList.get(name),x,y);
    }
    
    setupUIText(font,color,align,baseLine)
    {
        this.backCTX.font=font;
        this.backCTX.fillStyle=color;
        this.backCTX.textAlign=align;
        this.backCTX.textBaseline=baseLine;
    }
    
    drawUIText(str,x,y)
    {
        this.backCTX.fillText(str,x,y);
    }

    run()
    {
        let physicTick;
        
        
            // continue to run physics until we've caught up
            
        while (true) {
            physicTick=this.timestamp-this.physicsTimestamp;
            if (physicTick<this.PHYSICS_TICK_FREQUENCY) return;
            
            this.physicsTimestamp+=this.PHYSICS_TICK_FREQUENCY;
            
                // no map gotos

            this.gotoMapName=null;
            
                // run game and map AI
                // which runs the sprite AI
                
            this.runAI();
            this.map.run();
            
                // check for map goto triggers
                
            if (this.gotoMapName!==null) {
                this.input.keyClear();
                this.map=this.mapList.get(this.gotoMapName);
                this.map.initialize();
            }
        }
    }
    
    draw()
    {
            // time to draw?
            
        if ((this.timestamp-this.drawTimestamp)<this.DRAW_TICK_FREQUENCY) return;
        this.drawTimestamp=this.timestamp;
        
            // erase the back canvas
            
        this.backCTX.fillStyle='#EEEEEE';
        this.backCTX.fillRect(0,0,this.canvasWidth,this.canvasHeight);
        
            // draw the map
            
        this.map.draw(this.backCTX);
        
            // draw any liquid
            
        this.liquid.draw(this.backCTX);
        
            // draw the UI
            
        this.drawUI();
        
            // transfer to front canvas
            
        this.ctx.drawImage(this.backCanvas,0,0);
    }
}
