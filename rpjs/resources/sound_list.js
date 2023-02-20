import SoundClass from './sound.js';

export default class SoundListClass {

    constructor(game) {
        this.game=game;
        
        this.sounds=new Map();
        
        Object.seal(this);
    }
    
    async initialize() {
        let name,promises;

        promises=[];
        
        for (name of this.sounds.keys()) {
            promises.push(this.sounds.get(name).getLoadPromise(this.game.resourceBasePath));
        }
        
        await Promise.all(promises);
    }
    
    add(name) {
        this.sounds.set(name,new SoundClass(this.game.audioContext,name));
    }
    
    /**
     * Plays a sound at full volume.
     */
    play(name) {
        let sound=this.sounds.get(name);
        
        // warning for missing sounds
        if ((sound===undefined) || (sound===null)) {
            console.log('Unknown sound: '+name);
            return;
        }

        // play sound
        sound.play();
    }
    
    /**
     * Plays a sound where the volumn is attuned to
     * the distance from the player sprite.
     */
    playAtSprite(name,sprite) {
        let sound=this.sounds.get(name);
        
        // warning for missing sounds
        if ((sound===undefined) || (sound===null)) {
            console.log('Unknown sound: '+name);
            return;
        }

        // play sound
        sound.playAtSprite(sprite,this.game.map.getPlayerSprite());
    }    
}

