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
    
    onRun(tick) {
        let door;
        let playerSprite=this.getPlayerSprite();
        
        // up jumps to other door
        if (!this.game.input.isKeyDown("KeyW")) return;
        
        // are we colliding with player?
        if (!this.collide(playerSprite)) return;
        
        // always clear the key so doesn't open next door
        this.game.input.keyClearSingle("KeyW");
        
        this.playSound('door');
        
        door=this.game.map.getFirstSpriteWithData('name',this.getData('goto'));
        playerSprite.x=door.x;
        playerSprite.y=door.y;
        
        this.game.map.resetOffsetY();
    }
    
}
