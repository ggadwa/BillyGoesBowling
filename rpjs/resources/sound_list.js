export default class SoundListClass {
        
    static MAIN_VOLUME=0.3;
    static DISTANCE_ATTUATION=0.0002;

    constructor(game) {
        this.game=game;
        
        this.buffers=new Map();
        
        Object.seal(this);
    }
    
    async initialize() {
        let name,resp,url,data;
        let count;
        
        count=0;
        
        for (name of this.buffers.keys()) {
            this.game.drawProgress('Loading Sounds',count,(this.buffers.size-1));

            // get the wav
            url=this.game.resourceBasePath+'sounds/'+name+'.wav';
            
            resp=await fetch(url);
            if (!resp.ok) throw new Error('Unable to load '+url+'; '+resp.statusText);
            data=await resp.arrayBuffer();
            
            await this.game.audioContext.decodeAudioData(data)
                .then(
                    // resolved
                    decodedData=>{
                        this.buffers.set(name,decodedData);
                    },    
                    // rejected
                    ()=>{
                        throw new Error('Unable to decode wav file '+url);
                    }
                );

            count++;
        }
    }
    
    add(name) {
        this.buffers.set(name,null);
    }
    
    /**
     * Plays a sound at full volume.
     */
    play(name) {
        let ctx=this.game.audioContext;
        let source,gain;
        let buffer=this.buffers.get(name);
        
            // just a warning if no music
            
        if ((buffer===undefined) || (buffer===null)) {
            console.log('Unknown sound: '+name);
            return;
        }

            // play sound
            
        source=ctx.createBufferSource();
        source.buffer=buffer;
        
        gain=ctx.createGain();
        gain.gain.value=SoundListClass.MAIN_VOLUME;

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
    }
    
    /**
     * Plays a sound where the volumn is attuned to
     * the distance from the player sprite.
     */
    playAtSprite(name,sprite) {
        let ctx=this.game.audioContext;
        let source,gain,vol;
        let playerSprite=this.game.map.getPlayerSprite();
        let x=sprite.x-playerSprite.x;
        let y=sprite.y-playerSprite.y;
        
        // attenuate, and if <= 0, don't play sound 
        vol=SoundListClass.MAIN_VOLUME-(Math.sqrt((x*x)+(y*y))*SoundListClass.DISTANCE_ATTUATION);
        if (vol<=0.0) return;
        
        // play sound  
        source=ctx.createBufferSource();
        gain=ctx.createGain();
        
        source.buffer=this.buffers.get(name);
        gain.gain.value=vol;

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
    }    
}

