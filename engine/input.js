export default class InputClass
{
    constructor(game)
    {
        this.game=game;
        this.cancelled=false;
        
        this.mouseFlags=new Uint8Array(3);
        this.keyFlags=new Uint8Array(255);
        
            // listeners
            
        this.mouseDownListener=this.mouseDownEvent.bind(this);
        this.mouseUpListener=this.mouseUpEvent.bind(this);
        this.keyDownListener=this.keyDownEvent.bind(this);
        this.keyUpListener=this.keyUpEvent.bind(this);

        Object.seal(this);
    }
  
        //
        // initialize/release input
        //

    initialize()
    {
        this.keyClear();
        this.mouseClear();
        
        this.game.canvas.addEventListener('mousedown',this.mouseDownListener,true);
        this.game.canvas.addEventListener('mouseup',this.mouseUpListener,true);
        
        document.addEventListener('keydown',this.keyDownListener,true);
        document.addEventListener('keyup',this.keyUpListener.bind(this),true);
    }

    release()
    {
        this.game.canvas.removeEventListener('mousedown',this.mouseDownListener,true);
        this.game.canvas.removeEventListener('mousedown',this.mouseDownListener,true);
        
        document.removeEventListener('keydown',this.keyDownListener,true);
        document.removeEventListener('keyup',this.keyUpListener,true);
    }
    
        //
        // game controls
        //
        
    isPause()
    {
        return(this.keyFlags[27]);
    }
    
    isLeft()
    {
        return(this.keyFlags[37]);
    }
    
    isRight()
    {
        return(this.keyFlags[39]);
    }
    
    isUp()
    {
        return(this.keyFlags[38]);
    }
    
    isDown()
    {
        return(this.keyFlags[40]);
    }
    
    isAction()
    {
        return(this.keyFlags[32]);
    }
    
    isSelect()
    {
        return(this.keyFlags[13]);
    }
    
    clearSelect()
    {
        this.keyFlags[13]=0;
    }
    
    isLeftMouseDown()
    {
        return(this.mouseFlags[0]);
    }
    
        //
        // click events
        //
        
    mouseDownEvent(event)
    {
        this.mouseFlags[event.button]=true;
        
        this.game.soundList.resumeFromPause();      // have to do this hack because of webaudio APIs
    }
    
    mouseUpEvent(event)
    {
        this.mouseFlags[event.button]=false;
    }
    
    mouseClear()
    {
        let n;
        
        for (n=0;n!=3;n++) {
            this.mouseFlags[n]=false;
        }
    }
        
        //
        // key events
        //

    keyDownEvent(event)
    {
        this.keyFlags[event.keyCode]=1;
    }
    
    keyUpEvent(event)
    {
        this.keyFlags[event.keyCode]=0;
    }
    
    keyClear()
    {
        let n;
            
        for (n=0;n!==255;n++) {
            this.keyFlags[n]=0;
        }
    }
 
}
