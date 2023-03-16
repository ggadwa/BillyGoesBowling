import SetupClass from '../engine/setup.js';

export default class SoundClass {

    static DISTANCE_ATTUATION=0.0002;

    constructor(audioContext,name) {
        this.audioContext=audioContext;
        this.name=name;
        this.buffer=null;
        
        Object.seal(this);
    }
    
    getLoadPromise(resourceBasePath) {
        let url;

        url=resourceBasePath+'sounds/'+this.name+'.wav';

        return(fetch(url)
                .then((resp) =>
                    {
                        if (!resp.ok) throw new Error ('File not found: '+url);
                        return(resp.arrayBuffer());
                    }
                )
                .then((buf) => this.audioContext.decodeAudioData(buf))
                .then((decodedData) => 
                    {
                        this.buffer=decodedData;
                        return(Promise.resolve());
                    }
                )
            );
    }
    
    play() {
        let source,gain;
        
        source=this.audioContext.createBufferSource();
        source.buffer=this.buffer;
        
        gain=this.audioContext.createGain();
        gain.gain.value=SetupClass.SOUND_VOLUME;

        source.connect(gain);
        gain.connect(this.audioContext.destination);
        source.start(0);
    }
    
    playAtSprite(sprite,cameraSprite) {
        let source,gain,vol;
        let x=sprite.x-cameraSprite.x;
        let y=sprite.y-cameraSprite.y;
        
        // attenuate, and if <= 0, don't play sound 
        vol=SetupClass.SOUND_VOLUME-(Math.sqrt((x*x)+(y*y))*SoundClass.DISTANCE_ATTUATION);
        if (vol<=0.0) return;
        
        // play sound  
        source=this.audioContext.createBufferSource();
        gain=this.audioContext.createGain();
        
        source.buffer=this.buffer;
        gain.gain.value=vol;

        source.connect(gain);
        gain.connect(this.audioContext.destination);
        source.start(0);
    }    
}

