import SetupClass from '../engine/setup.js';

export default class MusicClass {

    constructor(audioContext,name) {
        this.audioContext=audioContext;
        this.name=name;
        
        this.buffer=null;
        
        Object.seal(this);
    }
    
    getLoadPromise(resourceBasePath) {
        let url;

        url=resourceBasePath+'music/'+this.name+'.mp3';

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
        source.loop=true;
        source.buffer=this.buffer;
        
        gain=this.audioContext.createGain();
        gain.gain.value=SetupClass.MUSIC_VOLUME;

        source.connect(gain);
        gain.connect(this.audioContext.destination);
        source.start(0);
        
        return(source);
    }
}

