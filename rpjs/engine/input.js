export default class InputClass {

    static BUTTON_X=0;
    static BUTTON_Y=1;
    static BUTTON_A=2;
    static BUTTON_B=3;
    static LEFT_STICK_X=4;
    static LEFT_STICK_Y=5;
    static START=6;
    static SELECT=7;
    static LEFT_SHOULDER_TOP=8;
    static LEFT_SHOULDER_BOTTOM=9;
    static RIGHT_SHOULDER_TOP=10;
    static RIGHT_SHOULDER_BOTTOM=11;
    static PAUSE=12;
    
    static INPUT_COUNT=13;
    
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
        
        // gamepad
        this.gamepadIndex=-1;

        Object.seal(this);
    }
  
    // initialize/release input
    initialize() {
        this.clearInputState(null);
        
        // keyboard
        document.addEventListener('keydown',this.keyDownListener,true);
        document.addEventListener('keyup',this.keyUpListener,true);
        
        // gamepad
        window.addEventListener('gamepadconnected',this.gamepadConnected.bind(this));
        window.addEventListener('gamepaddisconnected',this.gamepadDisconnected.bind(this));
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
            case 'Enter':
                this.inputStates[InputClass.START]=1.0;
                break;
            case 'Backquote':
                this.inputStates[InputClass.SELECT]=1.0;
                break;
            case 'Escape':
                this.inputStates[InputClass.PAUSE]=1.0;
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
            case 'Enter':
                this.inputStates[InputClass.START]=0.0;
                break;
            case 'Backquote':
                this.inputStates[InputClass.SELECT]=0.0;
                break;
            case 'Escape':
                this.inputStates[InputClass.PAUSE]=0.0;
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
    
    // gamepad events
    // right now we are only accepting whatever the first gamepad in is
    gamepadConnected(event) {
        this.gamepadIndex=event.gamepad.index;
    }
    
    gamepadDisconnected(event) {
        if (this.gamepadIndex===event.gamepad.index) this.gamepadIndex=-1;
    }
    
    gamepadRunInternal(tick) {
        let gamepads,gamepad;
        
        // this is a lot of checks, but because of browser differences
        // we are stuck doing this
        if (this.gamepadIndex===-1) return;
        
        gamepads=navigator.getGamepads();
        if (gamepads==null) return;
        
        gamepad=gamepads[this.gamepadIndex];
        if (gamepad==null) return;
        
        // now we can query
        // some of this is a mess, there is mapping weirdness in the API
        if (gamepad.buttons[14].pressed) {
            this.inputStates[InputClass.LEFT_STICK_X]=-1.0;
        }
        else {
            if (gamepad.buttons[15].pressed) {
                this.inputStates[InputClass.LEFT_STICK_X]=1.0;
            }
            else {
                this.inputStates[InputClass.LEFT_STICK_X]=gamepad.axes[0];
            }
        }
        if (gamepad.buttons[12].pressed) {
            this.inputStates[InputClass.LEFT_STICK_Y]=-1.0;
        }
        else {
            if (gamepad.buttons[13].pressed) {
                this.inputStates[InputClass.LEFT_STICK_Y]=1.0;
            }
            else {
                this.inputStates[InputClass.LEFT_STICK_Y]=gamepad.axes[1];
            }
        }
 
        this.inputStates[InputClass.BUTTON_A]=gamepad.buttons[0].pressed?1.0:0.0;
        this.inputStates[InputClass.BUTTON_B]=gamepad.buttons[1].pressed?1.0:0.0;
        this.inputStates[InputClass.BUTTON_X]=gamepad.buttons[2].pressed?1.0:0.0;
        this.inputStates[InputClass.BUTTON_Y]=gamepad.buttons[3].pressed?1.0:0.0;
        this.inputStates[InputClass.START]=gamepad.buttons[9].pressed?1.0:0.0;
        this.inputStates[InputClass.SELECT]=gamepad.buttons[8].pressed?1.0:0.0;
        this.inputStates[InputClass.LEFT_SHOULDER_TOP]=gamepad.buttons[4].pressed?1.0:0.0;
        this.inputStates[InputClass.LEFT_SHOULDER_BOTTOM]=gamepad.buttons[6].pressed?1.0:0.0;
        this.inputStates[InputClass.RIGHT_SHOULDER_TOP]=gamepad.buttons[5].pressed?1.0:0.0;
        this.inputStates[InputClass.RIGHT_SHOULDER_BOTTOM]=gamepad.buttons[7].pressed?1.0:0.0;
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
    
    // input run
    runInternal(tick) {
        this.gamepadRunInternal(tick);
    }

}
