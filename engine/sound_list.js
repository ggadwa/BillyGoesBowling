export default class SoundListClass
{
    constructor()
    {
        let initAudioContext=window.AudioContext||window.webkitAudioContext;
        this.ctx=new initAudioContext();
        
        if (this.ctx===null) {
            console.log('error with audio context');
        }   // supergumba -- need error checking here
            
        this.buffers=new Map();
        
        Object.seal(this);
    }
    
    
    loadProcessLoaded(req,soundList,index,callback)
    {
        let name=soundList[index];
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
            
        index++;
        if (index>=soundList.length) {
            callback();
            return;
        }
            
        this.loadProcess(soundList,index,callback);
    }
    
    loadProcessError(name)
    {
        console.log('Missing Sound: '+name);        // this will abort the game loading process
    }
    
    loadProcess(soundList,index,callback)
    {
        let req;
        let name=soundList[index];
        
        req=new XMLHttpRequest();
        req.open('GET',('sounds/'+name+'.wav'),true);
        req.responseType='arraybuffer';
        req.onload=this.loadProcessLoaded.bind(this,req,soundList,index,callback);
        req.send();
    }
    
    load(soundList,callback)
    {
        this.loadProcess(soundList,0,callback);
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
}

