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
    
    onMapStart() {
        // if pin has been picked up once, then make it transparent
        if (this.getCurrentSaveSlotData('pin_'+this.getMapName())!==null) this.alpha=0.4;
        // win timer
        this.game.startCompletionTimer();
    }
    
    pickup() {
        // update the win state
        this.setCurrentSaveSlotData(('pin_'+this.getMapName()),true);
        this.setCurrentSaveSlotData(('time_'+this.getMapName()),1000000);
        this.setCurrentSaveSlotDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());
        
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
    
    onRun(tick) {
        this.checkCollision();
        this.runGravity();
    }
}
