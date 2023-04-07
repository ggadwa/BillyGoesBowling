import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class TrophyClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/trophy');
        this.setCurrentImage('sprites/trophy');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }

    onMapStart() {
        // if trophy has been picked up once, then make it transparent
        if (this.getCurrentSaveSlotData('trophy_'+this.getMapName())!==null) this.alpha=0.4;
    }
    
    pickup() {
        this.setCurrentSaveSlotData('got_trophy',true); // trophy only gets written to game data when player wins, so you have to pick it up and win to get it
        this.playSound('pickup');
        this.delete();
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
