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
        this.keyA=false;
        this.keyD=false;
        this.keyW=false;
        this.keyS=false;
        
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
                this.keyA=true;
                this.keysToStick();
                break;
            case 'KeyD':
                this.keyD=true;
                this.keysToStick();
                break;
            case 'KeyW':
                this.keyW=true;
                this.keysToStick();
                break;
            case 'KeyS':
                this.keyS=true;
                this.keysToStick();
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
                this.keyA=false;
                this.keysToStick();
                break;
            case 'KeyD':
                this.keyD=false;
                this.keysToStick();
                break;
            case 'KeyW':
                this.keyW=false;
                this.keysToStick();
                break;
            case 'KeyS':
                this.keyS=false;
                this.keysToStick();
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
    
    // this exists because if you hit A/D (for example) at once, you will
    // get either A or D, and the release could miss one depending on the
    // order, this forces if both keys are down the stick is in the middle,
    // and fixes the lose of a up
    keysToStick() {
        if ((this.keyA) && (this.keyD)) {
            this.inputStates[InputClass.LEFT_STICK_X]=0.0;
        }
        else {
            if (this.keyA) {
                this.inputStates[InputClass.LEFT_STICK_X]=-1.0;
            }
            else {
                if (this.keyD) {
                    this.inputStates[InputClass.LEFT_STICK_X]=1.0;
                }
                else {
                    this.inputStates[InputClass.LEFT_STICK_X]=0.0;
                }
            }
        }
        if ((this.keyW) && (this.keyS)) {
            this.inputStates[InputClass.LEFT_STICK_Y]=0.0;
        }
        else {
            if (this.keyW) {
                this.inputStates[InputClass.LEFT_STICK_Y]=-1.0;
            }
            else {
                if (this.keyS) {
                    this.inputStates[InputClass.LEFT_STICK_Y]=1.0;
                }
                else {
                    this.inputStates[InputClass.LEFT_STICK_Y]=0.0;
                }
            }
        }
    }
    
    // input states
    clearInputState(inputConstant) {
        if (inputConstant==null) {
            this.inputStates.fill(0.0);
            this.keyA=false;
            this.keyD=false;
            this.keyW=false;
            this.keyS=false;
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
