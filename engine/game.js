import MapClass from './map.js';
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
        
        this.input=null;
        
        this.physicsTickFrequency=33;
        this.physicsTimestamp=0;
        this.drawTickFrequency=33;
        this.drawTimestamp=0;
        
        this.images=new Map();
        
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
        
        this.input=new InputClass();
        this.input.initialize();
        
        this.physicsTimestamp=0;
        this.drawTimestamp=0;
    }
    
    prepare()
    {
        this.map.initialize(this);
        this.map.prepare(this);
    }
    
    getCanvasWidth()
    {
        return(this.canvasWidth);
    }
    
    getCanvasHeight()
    {
        return(this.canvasHeight);
    }
    
    setMap(map)
    {
        this.map=map;
    }
    
    getMap()
    {
        return(this.map);
    }
    
    loadImage(filePath)
    {
        if (this.images.has(filePath)) return(this.images.get(filePath));
        
        let img=new Image();
        img.src=filePath;      // note, no error checking or load checking, eventually that will need to be added
        
        this.images.set(filePath,img);
        return(img);
    }
    
    getMinGravityValue()
    {
        return(0);
    }
    
    getMaxGravityValue()
    {
        return(0);
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
        
    run(timestamp)
    {
        let physicTick;
        
            // continue to run physics until we've caught up
            
        while (true) {
            physicTick=timestamp-this.physicsTimestamp;
            if (physicTick<this.physicsTickFrequency) return;
            
            this.physicsTimestamp+=this.physicsTickFrequency;
            
            this.map.run(this,timestamp);
        }
    }
    
    draw(timestamp)
    {
            // time to draw?
            
        if ((timestamp-this.drawTimestamp)<this.drawTickFrequency) return;
        this.drawTimestamp=timestamp;
        
            // erase the back canvas
            
        this.backCTX.fillStyle='#EEEEEE';
        this.backCTX.fillRect(0,0,this.canvasWidth,this.canvasHeight);
        
            // draw the map
            
        this.map.draw(this,this.backCTX,timestamp);
        
            // transfer to front canvas
            
        this.ctx.drawImage(this.backCanvas,0,0);
    }
}
