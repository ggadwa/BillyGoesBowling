export default class SoundListClass
{
    constructor(game)
    {
        this.game=game;
        
        this.MAIN_VOLUME=0.3;
        this.DISTANCE_ATTUATION=0.0002;
        
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
     * Format will be wav and inside a sounds folder of the resource base path.
     */
    create()
    {
    }
    
    add(name)
    {
        this.buffers.set(name,null);
    }
    
    /**
     * Plays a sound at full volume.
     */
    play(name)
    {
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
        gain.gain.value=this.MAIN_VOLUME;

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
        vol=this.MAIN_VOLUME-(Math.sqrt((x*x)+(y*y))*this.DISTANCE_ATTUATION);
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
    
    loadProcessLoaded(req,name,keyIter,count,callback)
    {
        let buffers=this.buffers;
        let thisRef=this;
        
            // error
            
        if (req.status!==200) {
            console.log('Missing sound wav: '+name);        // this will abort the game loading process
            this.loadProcess(keyIter,(count+1),callback);
            return;
        }
        
            // need to decode the sound
            
        buffers=this.buffers;
        
        this.game.audioContext.decodeAudioData(req.response,
                            function(buffer) {
                                buffers.set(name,buffer);
                                thisRef.loadProcess(keyIter,(count+1),callback);
                            },
                            function(err) {
                                console.log('Unable to process music: '+name+': '+err);
                                thisRef.loadProcess(keyIter,(count+1),callback);
                            }
                        );
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
        
        this.game.drawProgress('Loading Sounds',count,(this.buffers.size-1));

        name=rtn.value;
        path=this.game.resourceBasePath+'sounds/'+name+'.wav';
        
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

