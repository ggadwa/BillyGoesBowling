import MapClass from './map.js';
import ImageListClass from './image_list.js';
import SoundListClass from './sound_list.js';
import MapListClass from './map_list.js';
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
        this.mapList=new MapListClass();
        this.input=new InputClass();
        
        this.timestamp=0;
        
        this.PHYSICS_TICK_FREQUENCY=33;
        this.DRAW_TICK_FREQUENCY=33;

        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        
        this.map=new MapClass(this);
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
    }
    
    prepare()
    {
        this.map.initialize(this);
        this.map.prepare(this);
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
    
    getCanvasWidth()
    {
        return(this.canvasWidth);
    }
    
    getCanvasHeight()
    {
        return(this.canvasHeight);
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
    
    getMapList()
    {
        return(this.mapList);
    }
    
    /**
     * Override this to return the map item for a character
     * in the map text.  Accepts Image (for static map tiles)
     * and SpriteClass (for active javascript controlled items.)
     * 
     * Note: '*' is a special character that always represents
     * the player sprite.  Any other chacters can be used for
     * anything else.
     */
    createMapItemForCharacter(ch)
    {
    }
    
    loadMapByName(name)
    {
        console.log('load='+name);
        console.log('data='+this.mapList.get(name));
        this.map.setMapFromArray(this.mapList.get(name));
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
        
    run()
    {
        let physicTick;
        
            // continue to run physics until we've caught up
            
        while (true) {
            physicTick=this.timestamp-this.physicsTimestamp;
            if (physicTick<this.PHYSICS_TICK_FREQUENCY) return;
            
            this.physicsTimestamp+=this.PHYSICS_TICK_FREQUENCY;
            
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
        
            // transfer to front canvas
            
        this.ctx.drawImage(this.backCanvas,0,0);
    }
}
