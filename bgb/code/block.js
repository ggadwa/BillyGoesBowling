import SpriteClass from '../../rpjs/engine/sprite.js';

export default class BlockClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/block');
        this.setCurrentImage('sprites/block');
        
        this.show=true;
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=12;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    onRun(tick) {
        this.runGravity();
    }
}
