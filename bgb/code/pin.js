import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import WorldMainMapClass from '../maps/world_main.js';

export default class PinClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/pin');
        this.setCurrentImage('sprites/pin');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new PinClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        // if pin has been picked up once, then make it transparent
        if (this.game.getData('pin_'+this.game.map.name)!==null) this.alpha=0.4;
        // win timer
        this.game.startCompletionTimer();
    }
    
    pickup() {
        let time,oldTime;
        
        // update the win state
        if (this.game.getData('pin_'+this.game.map.name)===null) {
            this.game.setData('pins',(this.game.getData('pins')+1));
            this.game.setData(('pin_'+this.game.map.name),true);
            this.game.setData(('time_'+this.game.map.name),1000000);
        }
        
        // update the time
        time=this.game.stopCompletionTimer();
        oldTime=this.game.getData('time_'+this.game.map.name);
        if (time<oldTime) this.game.setData(('time_'+this.game.map.name),time);
        
        // and save the data
        this.game.persistData();
        
        this.playSound('pickup');
        
        this.delete();
        
        // warp out the player
        this.sendMessage(this.getPlayerSprite(),'warp_out',null);
    }
    
    onCollideSprite(sprite) {
        // colliding player picks up
        if (sprite instanceof PlayerSideScrollClass) {
            this.pickup();
        }
    }
    
    run() {
        this.checkCollision();
        this.runGravity();
    }
}
