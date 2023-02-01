export default class InputClass {
    constructor(game) {
        this.game=game;
        this.cancelled=false;
        
        // determine if touch interface
        this.isTouch=/(iphone|ipad|android)/.test(window.navigator.userAgent.toLowerCase());
        
        // input flags
        this.mouseFlags=new Uint8Array(3);
        this.keyMap=new Map();
        
        // listeners 
        this.mouseDownListener=this.mouseDownEvent.bind(this);
        this.mouseUpListener=this.mouseUpEvent.bind(this);
        this.keyDownListener=this.keyDownEvent.bind(this);
        this.keyUpListener=this.keyUpEvent.bind(this);

        Object.seal(this);
    }
  
    // initialize/release input
    initialize() {
        this.keyClear();
        this.mouseClear();
        
        this.game.canvas.addEventListener('mousedown',this.mouseDownListener,true);
        this.game.canvas.addEventListener('mouseup',this.mouseUpListener,true);
        
        document.addEventListener('keydown',this.keyDownListener,true);
        document.addEventListener('keyup',this.keyUpListener.bind(this),true);
    }

    release() {
        this.game.canvas.removeEventListener('mousedown',this.mouseDownListener,true);
        this.game.canvas.removeEventListener('mousedown',this.mouseDownListener,true);
        
        document.removeEventListener('keydown',this.keyDownListener,true);
        document.removeEventListener('keyup',this.keyUpListener,true);
    }
    
    // mouse events
    mouseDownEvent(event) {
        this.mouseFlags[event.button]=true;
        
        this.game.resumeFromPause();      // have to do this hack because of webaudio APIs
    }
    
    mouseUpEvent(event) {
        this.mouseFlags[event.button]=false;
    }
    
    mouseClear() {
        let n;
        
        for (n=0;n!=3;n++) {
            this.mouseFlags[n]=false;
        }
    }
    
    isLeftMouseDown() {
        return(this.mouseFlags[0]);
    }
        
    // key events
    keyDownEvent(event) {
        this.keyMap.set(event.code,true);
        //console.log(event.code);
    }
    
    keyUpEvent(event) {
        this.keyMap.set(event.code,false);
    }
    
    keyClear() {
        this.keyMap.clear();
    }
    
    isKeyDown(keyName) {
        let down;
                
        down=this.keyMap.get(keyName);
        return((down==null)?false:down);
    }
    
    isKeyDownAndClear(keyName) {
        let down;
                
        down=this.isKeyDown(keyName);
        if (down) this.keyMap.set(keyName,false);
        return(down);
    }

}
