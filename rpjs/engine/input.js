export default class InputClass {

    static BUTTON_X=0;
    static BUTTON_Y=1;
    static BUTTON_A=2;
    static BUTTON_B=3;
    static LEFT_STICK_X=4;
    static LEFT_STICK_Y=5;
    
    static INPUT_COUNT=6;
    
    constructor(game) {
        this.game=game;
        this.cancelled=false;
        
        // determine if touch interface
        this.isTouch=/(iphone|ipad|android)/.test(window.navigator.userAgent.toLowerCase());
        
        // input flags
        this.mouseFlags=new Uint8Array(3);
        this.keyMap=new Map();
        
        this.inputStates=new Float32Array(this.INPUT_COUNT);
        
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
        
        switch (event.code) {
            case 'KeyA':
                this.inputStates[InputClass.LEFT_STICK_X]=-1.0;
                break;
            case 'KeyD':
                this.inputStates[InputClass.LEFT_STICK_X]=1.0;
                break;
            case 'KeyW':
                this.inputStates[InputClass.LEFT_STICK_Y]=-1.0;
                break;
            case 'KeyS':
                this.inputStates[InputClass.LEFT_STICK_Y]=1.0;
                break;
            case 'ArrowLeft':
                this.inputStates[InputClass.BUTTON_X]=1.0;
                break;
            case 'ArrowUp':
                this.inputStates[InputClass.BUTTON_Y]=1.0;
                break;
            case 'ArrowDown':
            case 'Space':
                this.inputStates[InputClass.BUTTON_A]=1.0;
                break;
            case 'ArrowRight':
                this.inputStates[InputClass.BUTTON_B]=1.0;
                break;
        }
    }
    
    keyUpEvent(event) {
        this.keyMap.set(event.code,false);
        
        switch (event.code) {
            case 'KeyA':
                this.inputStates[InputClass.LEFT_STICK_X]=0.0;
                break;
            case 'KeyD':
                this.inputStates[InputClass.LEFT_STICK_X]=0.0;
                break;
            case 'KeyW':
                this.inputStates[InputClass.LEFT_STICK_Y]=0.0;
                break;
            case 'KeyS':
                this.inputStates[InputClass.LEFT_STICK_Y]=0.0;
                break;
            case 'ArrowLeft':
                this.inputStates[InputClass.BUTTON_X]=0.0;
                break;
            case 'ArrowUp':
                this.inputStates[InputClass.BUTTON_Y]=0.0;
                break;
            case 'ArrowDown':
            case 'Space':
                this.inputStates[InputClass.BUTTON_A]=0.0;
                break;
            case 'ArrowRight':
                this.inputStates[InputClass.BUTTON_B]=0.0;
                break;
        }
    }
    
    keyClear() {
        this.keyMap.clear();
    }
    
    isKeyDown(keyName) {
        let down;
                
        down=this.keyMap.get(keyName);
        return((down==null)?false:down);
    }
    
    keyClearSingle(keyName) {
        this.keyMap.set(keyName,false);
    }
    
    clearInputState() {
        this.inputStates.fill(0.0);
    }
    
    getInputState(inputConstant) {
        return(this.inputStates[inputConstant]);
    }

}
