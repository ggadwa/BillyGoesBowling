import MapClass from './map.js';
import LiquidClass from './liquid.js';
import ImageListClass from '../resources/image_list.js';
import SoundListClass from '../resources/sound_list.js';
import MusicListClass from '../resources/music_list.js';
import MapListClass from '../resources/map_list.js';
import InputClass from './input.js';

export default class GameClass {

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
        
        this.PHYSICS_TICK_FREQUENCY=33;
        this.DRAW_TICK_FREQUENCY=16;

        this.timestamp=0;
        this.lastTimestamp=0;
        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        this.fpsTimestamp=0;
        this.fpsRefreshTimestamp=0;
        this.fps=0;
        this.tick=0;
        this.completionTimer=0;
        this.paused=true;
        
        // game data
        this.data=new Map();
        this.map=null;
        this.liquid=null;
        this.gotoMapName=null;
        
        this.urlParams=null;
    }
    
    initialize() {
        let initAudioContext;
        
            // we use some parameters to setup the game
            // so decode them here
        
        this.urlParams=new URLSearchParams(window.location.search);
    
            // get references to all the canvases
            // we need to draw
            
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
        
            // get the resource names
            
        this.attachResources();
        
            // load the maps list
            
        this.mapList.initialize();
        
            // initialize and load the image list
        
        this.imageList.initialize(this.initialize2.bind(this));
    }
    
    initialize2() {
            // get a list of tile images
            
        this.tileImageList=this.imageList.getArrayOfImageByPrefix('tiles/');
        
            // initialize and load the sound list
            
        this.soundList.initialize(this.initialize3.bind(this));
    }
    
    initialize3() {
            // initialize and load the music list
            
        this.musicList.initialize(this.initialize4.bind(this));
    }
   
    initialize4() {
        this.input.initialize();
        
            // initialize any game specific
            // data
            
        this.createData();
        
            // load the starting map
            
        this.map=this.mapList.get(this.getStartMap());
        if (this.map===undefined) {
            console.log('Unknown start map: '+this.getStartMap());
            return;
        }
        this.map.initialize();
        
            // the liquid object
            
        this.liquid=new LiquidClass(this);
        
            // we call a single animation frame
            // loop so we can get a starting timestamp
            
        window.requestAnimationFrame(this.initialize5.bind(this));
    }
        
    initialize5(systemTimestamp) {
            // setup the timing and
            // game states, because of audio
            // APIs game needs to start in
            // paused state so click can active
            // webaudio API
            
        this.timestamp=0;
        this.physicsTimestamp=0;
        this.drawTimestamp=0;
        this.fpsTimestamp=0;
        this.fpsRefreshTimestamp=0;
        this.fps=0;
        this.tick=0;
        
        this.paused=true;
        this.lastTimestamp=Math.trunc(systemTimestamp);
        
        this.audioContext.suspend();
        
            // force a first draw as game starts paused

        this.draw(true);
        
            // now run the game loop
        
        window.requestAnimationFrame(this.runLoop.bind(this));
    }
    
        //
        // start and pause
        //
     
    start() {
        this.initialize();
    }
    
    resumeFromPause() {
            // thanks to idiots misusing the web we have to
            // do all this funny work to get the audio to work
            
        if (this.audioContext.state==='suspended') this.audioContext.resume();
    }
    
        //
        // resources
        //
     
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
    
        //
        // save slots
        //
    
    getSaveSlotName(paramName) {
        let slotStr;
        let slot=0;
        
        slotStr=this.urlParams.get(paramName);
        if (slotStr!==null) {
            try {
                slot=parseInt(slotStr);
            }
            catch (e) {
                slot=0;
            }
        }
        
        if ((slot<0) || (slot>2)) slot=0;

        return(this.constructor.name+'_save_'+slot);
    }
    
    /**
     * Call to check if the unlocked URL param was included, which is a quick
     * way to unlock any blocks in a game for testing purposes
     */
    isUnlocked() {
        return(this.urlParams.get('unlocked')!==null);
    }
    
    /**
     * Restores data persisted to the players save slot to the main
     * data for this game.  Returns FALSE if there is no data (then you
     * should create default data.)
     */
    restorePersistedData() {
        let item=window.localStorage.getItem(this.getSaveSlotName('saveSlot'));
        if (item===null) return(false);
        
            // if the clear save spot is on, never load
            // any data and erase any save
            
        if (this.urlParams.get('eraseSlot')!==null) {
            window.localStorage.removeItem(this.getSaveSlotName('eraseSlot'));
            return(false);
        }
        
            // otherwise reload the data
        
        this.data=new Map(JSON.parse(item));
        return(true);
    }

    /**
     * Call this to persist the current state of the game data
     * to the current save slot.
     */
    persistData() {
        window.localStorage.setItem(this.getSaveSlotName('saveSlot'),JSON.stringify([...this.data]));
    }
    
        //
        // misc game UIs
        //
    
    drawProgress(title,count,maxCount) {
        let lx=10;
        let rx=this.canvasWidth-10;
        let ty=this.canvasHeight-40;
        let by=this.canvasHeight-10;
        let fx;
        
        if (this.backCTX===null) return;        // means we are in the editor
        
            // erase the back canvas
            
        this.backCTX.fillStyle='#000000';
        this.backCTX.fillRect(0,0,this.canvasWidth,this.canvasHeight);
        
            // the progress bar
            
        fx=lx+Math.trunc(((rx-lx)*count)/maxCount);
        
        this.backCTX.fillStyle='#33FF33';
        this.backCTX.fillRect(lx,ty,(fx-lx),(by-ty));
            
        this.backCTX.strokeStyle='#EEFFEE';
        this.backCTX.strokeRect(lx,ty,(rx-lx),(by-ty));

        this.backCTX.font='24px Arial';
        this.backCTX.fillStyle='#000000';
        this.backCTX.textAlign='left';
        this.backCTX.textBaseline='alphabetic';
        this.backCTX.fillText(title,(lx+5),(by-8));
        
            // swap to forground

        this.ctx.drawImage(this.backCanvas,0,0);
    }
    
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
     * game.  Anything you set here can be restored or saved into
     * the current slot by persistData and retreived by
     * restorePersistedData.
     * 
     * Use this API to get data by name.
     */
    getData(name) {
        let val=this.data.get(name);
        return((val===undefined)?null:val);
    }
    
    /**
     * Data set on the game is the only persistant data for the
     * game.  Anything you set here can be restored or saved into
     * the current slot by persistData and retreived by
     * restorePersistedData.
     * 
     * Use this to set data by name.
     */
    setData(name,value) {
        this.data.set(name,value);
    }
    
    deleteData(name) {
        this.data.delete(name);
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
     * Override this to create any data that needs to be
     * persisted for game state.
     */
    createData() {
    }
            
    /**
     * Override this to return the the starting map object.
     * 
     * @returns {MapClass}
     */
    getStartMap() {
    }
        
    /**
     * Override this to run any game based logic, it is called before
     * any sprite logic.
     */
    run(tick) {
    }
    
    /**
     * Override this to draw the UI.  Use the drawUIImage, setupUIText,
     * and drawUIText methods to draw the UI.
     */
    drawUI() {
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
            if (physicTime<this.PHYSICS_TICK_FREQUENCY) return;
            
            this.physicsTimestamp+=this.PHYSICS_TICK_FREQUENCY;
            
            // no map gotos
            this.gotoMapName=null;
            
            // run game and map logic
            // which runs the sprite logic
            this.run(this.tick);
            this.map.run(this.tick);
            
            // check for map goto triggers 
            if (this.gotoMapName!==null) {
                this.input.keyClear();
                this.map=this.mapList.get(this.gotoMapName);
                this.map.initialize();
            }
            
            // next tick
            this.tick++;
        }
    }
    
    draw(paused) {
        // if paused, it's a single draw so we ignore the timing
        if (!paused) {
            if ((this.timestamp-this.drawTimestamp)<this.DRAW_TICK_FREQUENCY) return;
            this.drawTimestamp=this.timestamp;
        }
        
        // draw the map
        this.map.draw(this.backCTX);
        
        // draw any liquid
        this.liquid.draw(this.backCTX);
        
        // draw the UI
        this.drawUI();
        this.drawFPS();
        if (paused) this.drawPause();
        
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
            if (this.input.isKeyDown("Escape")) {
                this.paused=true;
                this.audioContext.suspend();
                this.draw(true);
                return;
            }
        }
        else {
            this.lastTimestamp=systemTimestamp;
            if (this.input.isLeftMouseDown()) {
                this.paused=false;
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
            this.draw(false);
        }
        catch (e) {
            window.cancelAnimationFrame(id);
            throw e;
        }
    }

}
