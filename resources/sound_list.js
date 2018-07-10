export default class SoundListClass
{
    constructor()
    {
        let initAudioContext=window.AudioContext||window.webkitAudioContext;
        this.ctx=new initAudioContext();
        
        if (this.ctx===null) {
            console.log('error with audio context');
        }   // todo -- need error checking here
            
        this.buffers=new Map();
        
        Object.seal(this);
    }
    
    initialize(callback)
    {
        this.create();
        this.load(callback);
    }
    
    /**
     * Override this to fill the list of sounds this game will need.
     */
    create()
    {
    }
    
    add(name)
    {
        this.buffers.set(name,null);
    }
    
    play(name)
    {
        let source=this.ctx.createBufferSource();
        let gain=this.ctx.createGain();
        
        source.buffer=this.buffers.get(name);
        gain.gain.value=0.25;

        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start(0);
    }
    
    loadProcessLoaded(req,name,keyIter,callback)
    {
        let buffers=this.buffers;
        
            // error
            
        if (req.status!==200) {
            console.log('Missing Sound: '+name);        // this will abort the game loading process
            return;
        }
        
            // need to decode the sound
            
        buffers=this.buffers;
        
        this.ctx.decodeAudioData(req.response,
                            function(buffer) {
                                buffers.set(name,buffer);
                            },
                            function(err) {
                                console.log(name+': '+err);
                            }        // supergumba -- need errors here
                        );
                
            // next sound
            
        this.loadProcess(keyIter,callback);
    }
    
    loadProcess(keyIter,callback)
    {
        let req,rtn,name,path;
        
            // get next key
            
        rtn=keyIter.next();
        if (rtn.done) {
            callback();
            return;
        }

        name=rtn.value;
        path='sounds/'+name+'.wav';
        
        req=new XMLHttpRequest();
        req.open('GET',path,true);
        req.responseType='arraybuffer';
        req.onload=this.loadProcessLoaded.bind(this,req,name,keyIter,callback);
        req.send();
    }
    
    load(callback)
    {
        this.loadProcess(this.buffers.keys(),callback);
    }
    
    
}

