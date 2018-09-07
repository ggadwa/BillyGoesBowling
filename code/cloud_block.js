import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class CloudBlockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.POP_TICK=20;
        this.REAPPEAR_TICK=40;
        
            // variables
            
        this.countDown=-1;
        
            // setup
            
        this.addImage('sprites/cloud_block');
        this.setCurrentImage('sprites/cloud_block');
        this.setEditorImage('sprites/cloud_block');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=true;
        this.canRiseBlock=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new CloudBlockClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (this.countDown===-1) this.countDown=this.POP_TICK;
    }
    
    runAI()
    {
        if (this.countDown===-1) return;
        
        this.countDown--;
        if (this.countDown>0) return;
        
            // disappear
            
        if (this.show) {
            this.show=false;
            this.countDown=this.REAPPEAR_TICK;
            this.game.soundList.play('pop');
            return;
        }
        
            // reappear
            
        this.show=true;
        this.countDown=-1;
    }
}
