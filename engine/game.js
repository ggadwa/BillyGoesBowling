import MapClass from './map.js';
import ImageListClass from './image_list.js';
import SoundListClass from './sound_list.js';
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
        
        this.imageList=new ImageListClass();
        this.soundList=new SoundListClass();
        this.input=new InputClass();
        
        this.timestamp=0;
        
        this.PHYSICS_TICK_FREQUENCY=33;
        this.DRAW_TICK_FREQUENCY=33;

        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        
        this.data=new Map();
        this.map=null;
    }
    
    initialize()
    {
        this.canvas=document.getElementById('mainCanvas');
        this.ctx=this.canvas.getContext('2d');
        
        this.canvasWidth=this.canvas.width;
        this.canvasHeight=this.canvas.height;
        
        this.backCanvas=document.createElement('canvas');
        this.backCanvas.width=this.canvasWidth;
        this.backCanvas.height=this.canvasHeight;
        this.backCTX=this.backCanvas.getContext('2d');
        
        this.input.initialize();
        
            // create game specific data
            
        this.createData();
        
            // load the starting map
            
        this.map=this.getStartMap();
        this.map.initialize();
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
    
    getPreloadImages()
    {
        return(null);
    }
    
    getImageList()
    {
        return(this.imageList);
    }
    
    getPreloadSounds()
    {
        return(null);
    }
    
    getSoundList()
    {
        return(this.soundList);
    }
    
    getMap()
    {
        return(this.map);
    }    
    
    getMapOffset(offset)
    {
    }
    
    isCancelled()
    {
        return(this.input.isCancelled());
    }
    
    getInput()
    {
        return(this.input);
    }
    
    getData(name)
    {
        return(this.data.get(name));
    }
    
    setData(name,value)
    {
        this.data.set(name,value);
    }
    
    incrementData(name)
    {
        this.data.set(name,(this.data.get(name)+1));
    }
    
    decrementData(name)
    {
        this.data.set(name,(this.data.get(name)-1));
    }
    
    addData(name,addValue)
    {
        this.data.set(name,(this.data.get(name)+addValue));
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
            
            this.runAI();
            this.map.run();
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
        
            // draw the UI
            
        this.drawUI();
        
            // transfer to front canvas
            
        this.ctx.drawImage(this.backCanvas,0,0);
    }
}
