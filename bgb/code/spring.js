import SpriteClass from '../../rpjs/engine/sprite.js';

export default class SpringClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.SPRING_HEIGHT=-70;
        this.OPEN_TICK=10;
        
        // setup
        this.addImage('sprites/spring_close');
        this.addImage('sprites/spring_open');
        this.setCurrentImage('sprites/spring_close');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=true;
        this.canRiseBlock=true;
        
        this.openCount=0;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new SpringClass(this.game,x,y,this.data));
    }
    
    onStoodOnSprite(sprite) {
        // already open, do nothing
        if (this.openCount>0) return;
        
        sprite.addGravity(this.SPRING_HEIGHT,0);
        sprite.flash=true;
        this.game.soundList.playAtSprite('boing',this,sprite);
        
        this.openCount=this.OPEN_TICK;
        this.setCurrentImage('sprites/spring_open');
    }

    run() {
        // run collision checks without moving
        this.checkCollision();
        
        // open if closed
        if (this.openCount!==0) {
            this.openCount--;
            if (this.openCount===0) this.setCurrentImage('sprites/spring_close');
        }
    }
}
