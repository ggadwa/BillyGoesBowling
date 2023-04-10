import RandomClass from './random.js';
import MapClass from './map.js';
import ImageListClass from '../resources/image_list.js';
import SoundListClass from '../resources/sound_list.js';
import MusicListClass from '../resources/music_list.js';
import MapListClass from '../resources/map_list.js';
import InputClass from './input.js';

export default class GameClass {
        
    static PHYSICS_TICK_FREQUENCY=16;
    static DRAW_TICK_FREQUENCY=16;

    constructor() {
        // canvas and sound contexts
        this.canvas=null;
        this.ctx=null;
        this.canvasWidth=0;
        this.canvasHeight=0;
        
        this.backCanvas=null;
        this.backCTX=null;
        
        this.audioContext=null;
        
        // resources
        this.resourceBasePath=null;
        this.imageList=new ImageListClass(this);
        this.soundList=new SoundListClass(this);
        this.musicList=new MusicListClass(this);
        this.mapList=new MapListClass(this);
        
        this.tileImageList=null; // created from the image list
        
        // input and timing
        this.input=new InputClass(this);

        this.timestamp=0;
        this.lastTimestamp=0;
        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        this.fpsTimestamp=0;
        this.fpsRefreshTimestamp=0;
        this.fps=0;
        this.tick=0;
        this.completionTimer=0;
        this.inAttract=false;
        this.paused=true;
        this.canvasClicked=false;
        
        // save slot
        this.currentSaveSlot=0;
        
        // game map
        this.map=null;
        this.gotoMapName=null;
        
        this.urlParams=null;
    }
    
    async initialize() {
        let initAudioContext;
        
        // we use some URL parameters to setup the game
        this.urlParams=new URLSearchParams(window.location.search);
    
        // the canvases
        this.canvas=document.getElementById('mainCanvas');
        this.ctx=this.canvas.getContext('2d');
        
        this.canvasWidth=this.canvas.width;
        this.canvasHeight=this.canvas.height;
        
        this.backCanvas=document.createElement('canvas');
        this.backCanvas.width=this.canvasWidth;
        this.backCanvas.height=this.canvasHeight;
        this.backCTX=this.backCanvas.getContext('2d');
        
        // sound context
        initAudioContext=window.AudioContext||window.webkitAudioContext;
        this.audioContext=new initAudioContext();
        
        if (this.audioContext===null) {
            console.log('Unable to create audio context');
            return;
        }
        
        // set seed
        RandomClass.setSeedCurrentTimestamp();
        
        // get the resource names
        this.attachResources();
        
        // load the maps list
        this.mapList.initialize();
        
        // load the image list
        try {
            await this.imageList.initialize();
        }
        catch (e) {
            alert(e);
            return;
        }

        // get a list of tile images
        this.tileImageList=this.imageList.getArrayOfImageByPrefix('tiles/');
        
        // load the sound list
        try {
            await this.soundList.initialize();
        }
        catch (e) {
            alert(e);
            return;
        }

        // initialize and load the music list
        try {
            await this.musicList.initialize();
        }
        catch (e) {
            alert(e);
            return;
        }

        // initial input
        this.input.initialize();
        
        // start in attract mode
        this.inAttract=false;
        
        // load the attract map
        this.map=this.mapList.get(this.getStartMap());
        if (this.map===undefined) {
            alert('Unknown start map: '+this.getAttractMap());
            return;
        }

        this.map.initialize();
        
        // setup the timing and game states
        this.timestamp=0;
        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        this.fpsTimestamp=0;
        this.fpsRefreshTimestamp=0;
        this.fps=0;
        this.tick=0;
        
        this.paused=true;
        this.canvasClicked=false;
        
        this.audioContext.suspend();
        
        // force a first draw as game starts paused
        this.draw();
        
        // on click for resuming
        this.canvas.onclick=this.clickCanvas.bind(this);
        
        // now run the game loop
        this.lastTimestamp=Math.trunc(performance.now());
        window.requestAnimationFrame(this.runLoop.bind(this));
    }
    
    clickCanvas(event) {
        this.canvasClicked=true;
    }
    
    // random
    random() {
        return(RandomClass.random());
    }
    
    randomScaled(scale) {
        return(RandomClass.randomScaled(scale));
    }
    
    randomScaledInt(scale) {
        return(RandomClass.randomScaledInt(scale));
    }
    
    randomBoolean() {
        return(RandomClass.randomBoolean());
    }
    
    /**
     * Override this to add in all the resources for this game
     * (images, sounds, music, maps)
     */
    attachResources() {
    }
    
    setResourceBasePath(resourceBasePath) {
        this.resourceBasePath=resourceBasePath;
    }
    
    addImage(name) {
        this.imageList.add(name);
    }
    
    addSound(name) {
        this.soundList.add(name);
    }
    
    addMusic(name) {
        this.musicList.add(name);
    }
    
    addMap(name,map) {
        this.mapList.add(name,map);
    }
    
    /**
     * Call to check if the unlocked URL param was included, which is a quick
     * way to unlock any blocks in a game for testing purposes
     */
    isUnlocked() {
        return(this.urlParams.get('unlocked')!==null);
    }
    
    // misc game UIs
    drawPause() {
        let mx=Math.trunc(this.canvasWidth*0.5);
        let my=Math.trunc(this.canvasHeight*0.5);
        
        this.backCTX.fillStyle='#000000';
        this.backCTX.fillRect(0,(my-50),this.canvasWidth,100);
        
        this.backCTX.font='48px Arial';
        this.backCTX.fillStyle='#FFFFFF';
        this.backCTX.textAlign='center';
        this.backCTX.textBaseline='alphabetic';
        this.backCTX.fillText('Paused',mx,my);
        
        this.backCTX.font='24px Arial';
        this.backCTX.fillText('Click to Resume',mx,(my+35));
    }
    
    /**
     * Override and return a set of objects based on the sprite classes
     * you want the editor to be able to place in a map.
     */
    getEditorSpritePaletteList() {
    }
    
    getMapOffset(offset) {
    }
    
    /**
     * Data set on the game is the only persistant data for the
     * game.
     * 
     * Use this API to get data by name.
     */
    getSaveSlotData(slotIdx,name) {
        let val=window.localStorage.getItem(this.constructor.name+'_'+slotIdx+'_'+name);
        return((val===undefined)?null:JSON.parse(val));
    }
    
    getCurrentSaveSlotData(name) {
        return(this.getSaveSlotData(this.currentSaveSlot,name));
    }
    
    getSaveSlotDataCount(slotIdx,prefix) {
        let n;
        let count=0;
        let searchPrefix=this.constructor.name+'_'+slotIdx+'_'+prefix;
        
        for (n=0;n!=window.localStorage.length;n++) {
            if (window.localStorage.key(n).startsWith(searchPrefix)) count++;
        }
        
        return(count);
    }
    
    getCurrentSaveSlotDataCount(prefix) {
        return(this.getSaveSlotDataCount(this.currentSaveSlot,prefix));
    }
    
    setSaveSlotData(slotIdx,name,value) {
        window.localStorage.setItem((this.constructor.name+'_'+slotIdx+'_'+name),JSON.stringify(value));
    }
    
    setCurrentSaveSlotData(name,value) {
        this.setSaveSlotData(this.currentSaveSlot,name,value);
    }
    
    setCurrentSaveSlotDataIfLess(name,value) {
        let oldValue;
        
        oldValue=this.getCurrentSaveSlotData(name);
        if (oldValue==null) {
            this.setCurrentSaveSlotData(name,value);
            return;
        }
        
        if (value<oldValue) {
            this.setCurrentSaveSlotData(name,value);
        }
    }
    
    deleteSaveSlotData(slotIdx,name) {
        window.localStorage.removeItem(this.constructor.name+'_'+slotIdx+'_'+name);
    }
    
    deleteCurrentSaveSlotData(name) {
        this.deleteSaveSlotData(this.currentSaveSlot,name);
    }
    
    gotoMap(name) {
        this.gotoMapName=name;
    }
    
    startCompletionTimer() {
        this.completionTimer=window.performance.now();
    }
    
    stopCompletionTimer() {
        return((window.performance.now()-this.completionTimer)/1000.0);
    }
    
    /**
     * Override this to listen to messages from sprites, this
     * is up to the game developer as how to use cmd and data.
     */
    onMessage(fromSprite,cmd,data) {
    }    
    
    /**
     * Override this to return the the starting map object.
     * 
     * @returns {MapClass}
     */
    getStartMap() {
    }
    
    getAttractMap() {
    }
        
    /**
     * Override this to run any game based logic, it is called before
     * any sprite logic.
     */
    onRun(tick) {
    }
    
    /**
     * Override this to draw the UI.  Use the drawUIImage, setupUIText,
     * and drawUIText methods to draw.
     */
    drawUI() {
    }
    
    /**
     * Override this to draw an attract mode items.  Use the drawUIImage, setupUIText,
     * and drawUIText methods to draw.
     */
    drawAttract() {
    }
    
    drawSetAlpha(alpha) {
        this.backCTX.globalAlpha=alpha;
    }
    
    drawUIImage(name,x,y) {
        this.backCTX.drawImage(this.imageList.get(name),x,y);
    }
    
    setupUIText(font,color,align,baseLine) {
        this.backCTX.font=font;
        this.backCTX.fillStyle=color;
        this.backCTX.textAlign=align;
        this.backCTX.textBaseline=baseLine;
    }
    
    drawUIText(str,x,y) {
        this.backCTX.fillText(str,x,y);
    }
    
    measureUITextWidth(str) {
        return(this.backCTX.measureText(str).width);
    }
    
    drawFPS() {
        this.setupUIText('14px Monaco','#000000','right','alphabetic');
        this.drawUIText(this.fps.toFixed(2),(this.canvasWidth-10),20);
    }

    runInternal() {
        let physicTime;

        // continue to run physics until we've caught up
        while (true) {
            physicTime=this.timestamp-this.physicsTimestamp;
            if (physicTime<GameClass.PHYSICS_TICK_FREQUENCY) return;
            
            this.physicsTimestamp+=GameClass.PHYSICS_TICK_FREQUENCY;
            
            // no map gotos
            this.gotoMapName=null;
            
            // run game and map logic
            // which runs the sprite logic
            this.input.runInternal(this.tick);
            this.onRun(this.tick); // project run
            this.map.runInternal(this.tick);
            
            // check for map goto triggers 
            if (this.gotoMapName!==null) {
                this.input.clearInputState(null);
                this.map=this.mapList.get(this.gotoMapName);
                this.map.initialize();
            }
            
            // next tick
            this.tick++;
        }
    }
    
    draw() {
        // if paused, it's a single draw so we ignore the timing
        if (!this.paused) {
            if ((this.timestamp-this.drawTimestamp)<GameClass.DRAW_TICK_FREQUENCY) return;
            this.drawTimestamp=this.timestamp;
        }
        
        // draw the map
        this.map.draw(this.backCTX);
        
        // draw the UI
        this.drawUI();
        this.drawFPS();
        if (this.inAttract) this.drawAttract();
        if (this.paused) this.drawPause();
        
        // transfer to front canvas
        this.ctx.drawImage(this.backCanvas,0,0);
        
        // fps
        if (this.drawTimestamp!==this.fpsTimestamp) {
            if (this.fpsRefreshTimestamp<this.timestamp) {
                this.fpsRefreshTimestamp=this.timestamp+1000;
                this.fps=1000.0/(this.drawTimestamp-this.fpsTimestamp);
            }
        }
        
        this.fpsTimestamp=this.drawTimestamp;
    }
    
        //
        // main run loop
        //
    
    runLoop(systemTimestamp) {
        let id;
        
        systemTimestamp=Math.trunc(systemTimestamp);

        // next frame
        id=window.requestAnimationFrame(this.runLoop.bind(this));

        // pausing?
        if (!this.paused) {
            if (this.input.getInputStateBoolean(InputClass.START)) {
                this.paused=true;
                this.canvasClicked=false;
                this.audioContext.suspend();
                this.draw();
                return;
            }
        }
        else {
            this.lastTimestamp=systemTimestamp;
            if (this.canvasClicked) {
                this.paused=false;
                this.canvasClicked=false;
                this.audioContext.resume();
            }

            return;
        }

        // setup the current timestamp
        // since game can be paused we need
        // to track it by change in system timestamp
        this.timestamp+=(systemTimestamp-this.lastTimestamp);
        this.lastTimestamp=systemTimestamp;

        // run the game (if not paused)
        // any error exits the animation loop
        try {
            this.runInternal();
            this.draw();
        }
        catch (e) {
            window.cancelAnimationFrame(id);
            throw e;
        }
    }

}
