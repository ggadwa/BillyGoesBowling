import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class DoorClass extends SpriteClass {
        
    static DOOR_LOCK_TICK=100;
    
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/door');
        this.setCurrentImage('sprites/door');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.layer=this.BACKGROUND_LAYER; // drawn in background
        
        Object.seal(this);
    }
    
    onMapStart() {
        this.setCurrentSaveSlotData('door_lock_tick',0);
    }
    
    onRun(tick) {
        let door;
        let playerSprite=this.getPlayerSprite();
        
        // up on direction enters door
        if (!this.getInputStateIsNegative(InputClass.LEFT_STICK_Y)) return;
        
        // are we colliding with player
        if (!this.collide(playerSprite)) return;
        
        // are we in a lock (so we don't jump between doors)
        if ((this.getCurrentSaveSlotData('door_lock_tick')+DoorClass.DOOR_LOCK_TICK)>tick) return;
        
        // start the door lock
        this.setCurrentSaveSlotData('door_lock_tick',tick);
        
        // move to other door
        this.playSound('door');
        
        door=this.game.map.getFirstSpriteWithData('name',this.getData('goto'));
        playerSprite.x=door.x;
        playerSprite.y=door.y;
        
        this.game.map.resetCamera();
    }
    
}
