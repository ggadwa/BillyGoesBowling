export default class InputClass
{
    constructor()
    {
        this.cancelled=false;
        
        this.keyFlags=new Uint8Array(255);
        
            // listeners
            
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
            
        document.addEventListener('keydown',this.keyDownListener,true);
        document.addEventListener('keyup',this.keyUpListener.bind(this),true);
    }

    release()
    {
        document.removeEventListener('keydown',this.keyDownListener,true);
        document.removeEventListener('keyup',this.keyUpListener,true);
    }
    
        //
        // game controls
        //
        
    isCancelled()
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
