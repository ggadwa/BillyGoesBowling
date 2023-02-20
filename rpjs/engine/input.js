export default class InputClass {

    static BUTTON_X=0;
    static BUTTON_Y=1;
    static BUTTON_A=2;
    static BUTTON_B=3;
    static LEFT_STICK_X=4;
    static LEFT_STICK_Y=5;
    static START=6;
    
    static INPUT_COUNT=7;
    
    static INPUT_DEAD_ZONE=0.5;
    
    constructor(game) {
        this.game=game;
        
        // input flags
        this.inputStates=new Float32Array(InputClass.INPUT_COUNT);
        
        // listeners 
        this.keyDownListener=this.keyDownEvent.bind(this);
        this.keyUpListener=this.keyUpEvent.bind(this);

        Object.seal(this);
    }
  
    // initialize/release input
    initialize() {
        this.clearInputState(null);
        
        document.addEventListener('keydown',this.keyDownListener,true);
        document.addEventListener('keyup',this.keyUpListener.bind(this),true);
    }

    release() {
        document.removeEventListener('keydown',this.keyDownListener,true);
        document.removeEventListener('keyup',this.keyUpListener,true);
    }
    
    // key events
    keyDownEvent(event) {
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
            case 'Escape':
                this.inputStates[InputClass.START]=1.0;
                break;
        }
    }
    
    keyUpEvent(event) {
        switch (event.code) {
            case 'KeyA':
            case 'KeyD':
                this.inputStates[InputClass.LEFT_STICK_X]=0.0;
                break;
            case 'KeyW':
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
            case 'Escape':
                this.inputStates[InputClass.START]=0.0;
                break;
        }
    }
    
    // input states
    clearInputState(inputConstant) {
        if (inputConstant==null) {
            this.inputStates.fill(0.0);
        }
        else {
            this.inputStates[inputConstant]=0.0;
        }
    }
    
    getInputStateFloat(inputConstant) {
        return(this.inputStates[inputConstant]);
    }
    
    getInputStateIsNegative(inputConstant) {
        return(this.inputStates[inputConstant]<-InputClass.INPUT_DEAD_ZONE);
    }
    
    getInputStateIsPositive(inputConstant) {
        return(this.inputStates[inputConstant]>InputClass.INPUT_DEAD_ZONE);
    }
    
    getInputStateBoolean(inputConstant) {
        return(this.inputStates[inputConstant]!==0.0);
    }

}
