import MusicClass from './music.js';
import SetupClass from '../engine/setup.js';

export default class MusicListClass {

    constructor(game) {
        this.game=game;
        
        this.musics=new Map();
        this.currentSource=null;
        
        Object.seal(this);
    }
    
    async initialize() {
        let name,promises;

        promises=[];
        
        for (name of this.musics.keys()) {
            promises.push(this.musics.get(name).getLoadPromise(this.game.resourceBasePath));
        }
        
        await Promise.all(promises);
    }
    
    add(name) {
        this.musics.set(name,new MusicClass(this.game.audioContext,name));
    }
    
    /**
     * Starts music
     */
    start(name) {
        let music=this.musics.get(name);
        
        // just a warning if no music
        if ((music===undefined) || (music===null)) {
            console.log('Unknown music: '+name);
            return;
        }
        
        // stop any playing music
        this.stop();
        
        // now start new music
        this.currentSource=music.play();
    }
    
    /**
     * Stops the music
     */
    stop() {
        if (this.currentSource!==null) {
            this.currentSource.stop(0);
            this.currentSource=null;
        }
    }
}

