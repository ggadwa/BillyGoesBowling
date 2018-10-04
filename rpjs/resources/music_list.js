export default class MusicListClass
{
    constructor(game)
    {
        this.game=game;
        
        this.MAIN_VOLUME=0.2;
        
        this.buffers=new Map();
        this.currentSource=null;
        
        Object.seal(this);
    }
    
    initialize(callback)
    {
        this.create();
        this.load(callback);
    }
    
    /**
     * Override this to fill the list of music this game will need.
     * Format will be mp3 and inside a music folder in the resources
     * base path.
     */
    create()
    {
    }
    
    add(name)
    {
        this.buffers.set(name,null);
    }
    
    /**
     * Starts music
     */
    start(name)
    {
        let ctx=this.game.audioContext;
        let gain=ctx.createGain();
        
        this.currentSource=ctx.createBufferSource();
        this.currentSource.loop=true;
        
        this.currentSource.buffer=this.buffers.get(name);
        gain.gain.value=this.MAIN_VOLUME;

        this.currentSource.connect(gain);
        gain.connect(ctx.destination);
        this.currentSource.start(0);
    }
    
    /**
     * Stops the music
     */
    stop()
    {
        if (this.currentSource!==null) {
            this.currentSource.stop(0);
            this.currentSource=null;
        }
    }
    
    loadProcessLoaded(req,name,keyIter,count,callback)
    {
        let buffers=this.buffers;
        
            // error
            
        if (req.status!==200) {
            console.log('Missing music: '+name);        // this will abort the game loading process
            return;
        }
        
            // need to decode the sound
            
        buffers=this.buffers;
        
        this.game.audioContext.decodeAudioData(req.response,
                            function(buffer) {
                                buffers.set(name,buffer);
                            },
                            function(err) {
                                console.log(name+': '+err);
                            }        // supergumba -- need errors here
                        );
                
            // next sound
            
        this.loadProcess(keyIter,(count+1),callback);
    }
    
    loadProcess(keyIter,count,callback)
    {
        let req,rtn,name,path;
        
            // get next key
            
        rtn=keyIter.next();
        if (rtn.done) {
            callback();
            return;
        }
        
        this.game.drawProgress('Loading Music',count,(this.buffers.size-1));

        name=rtn.value;
        path=this.game.resourceBasePath+'music/'+name+'.mp3';
        
        req=new XMLHttpRequest();
        req.open('GET',path,true);
        req.responseType='arraybuffer';
        req.onload=this.loadProcessLoaded.bind(this,req,name,keyIter,count,callback);
        req.send();
    }
    
    load(callback)
    {
        this.loadProcess(this.buffers.keys(),0,callback);
    }
    
    
}

