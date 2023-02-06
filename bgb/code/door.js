import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class DoorClass extends SpriteClass {
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
    
    duplicate(x,y) {
        return(new DoorClass(this.game,x,y,this.data));
    }
    
    run() {
        let door;
        let playerSprite=this.game.map.getSpritePlayer();
        
        // up jumps to other door
        // we always clear this so you don't bounce between doors
        if (!this.game.input.isKeyDownAndClear("KeyW")) return;
        
        // are we colliding with player?
        if (!playerSprite.collide(this)) return;
        
        door=this.game.map.getFirstSpriteWithData('name',this.getData('goto'));
        playerSprite.x=door.x;
        playerSprite.y=door.y;
        
        this.game.map.resetOffsetY();
        
        this.game.soundList.play('door');
    }
    
}
