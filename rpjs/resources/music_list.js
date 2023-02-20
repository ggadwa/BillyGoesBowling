export default class MusicListClass {

    static MAIN_VOLUME=0.15;

    constructor(game) {
        this.game=game;
        
        this.buffers=new Map();
        this.currentSource=null;
        
        Object.seal(this);
    }
    
    async initialize() {
        let name,resp,url,data;
        let count;
        
        count=0;
        
        for (name of this.buffers.keys()) {
            this.game.drawProgress('Loading Music',count,(this.buffers.size-1));

            // get the wav
            url=this.game.resourceBasePath+'music/'+name+'.mp3';
            
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
                        throw new Error('Unable to decode mp3 file '+url);
                    }
                );

            count++;
        }
    }
    
    add(name) {
        this.buffers.set(name,null);
    }
    
    /**
     * Starts music
     */
    start(name) {
        let ctx=this.game.audioContext;
        let gain;
        let buffer=this.buffers.get(name);
        
        // just a warning if no music
        if ((buffer===undefined) || (buffer===null)) {
            console.log('Unknown music: '+name);
            return;
        }
        
        // stop any playing music
        this.stop();
        
        // now start new music
        this.currentSource=ctx.createBufferSource();
        this.currentSource.loop=true;
        this.currentSource.buffer=buffer;
        
        gain=ctx.createGain();
        gain.gain.value=MusicListClass.MAIN_VOLUME;

        this.currentSource.connect(gain);
        gain.connect(ctx.destination);
        this.currentSource.start(0);
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

