import SpriteClass from '../../rpjs/engine/sprite.js';

export default class SpringClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.SPRING_JUMP_HEIGHT=-70;
        this.SPRING_MAX_MOVE=32;
        this.SPRING_MOVE=4;
        
        this.SPRING_NONE=0;
        this.SPRING_UP=1;
        this.SPRING_DOWN=2;
        
        // variables
        this.springMode=this.SPRING_NONE;
        
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
        this.canRiseBlock=false;
        
        this.layer=this.UNDER_MAP_TILES_LAYER; // so spring behind spring base
        
        this.openCount=0;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new SpringClass(this.game,x,y,this.data));
    }
    
    onStoodOnSprite(sprite) {
        // already moving, do nothing
        if (this.springMode!==this.SPRING_NONE) return;
        
        sprite.addGravity(this.SPRING_JUMP_HEIGHT,0);

        this.playSound('boing');
        
        this.springMode=this.SPRING_UP;
    }

    onRun(tick) {
        // run collision checks without moving
        this.checkCollision();
        
        // run any modes
        switch (this.springMode) {
            case this.SPRING_NONE:
                this.drawOffsetY=0;
                this.setCurrentImage('sprites/spring_close');
                return;
            case this.SPRING_UP:
                this.drawOffsetY-=this.SPRING_MOVE;
                if (this.drawOffsetY===-this.SPRING_MAX_MOVE) {
                    this.springMode=this.SPRING_DOWN;
                }
                this.setCurrentImage('sprites/spring_open');
                break;
            case this.SPRING_DOWN:
                this.drawOffsetY+=this.SPRING_MOVE;
                if (this.drawOffsetY===0) {
                    this.springMode=this.SPRING_NONE;
                }
                this.setCurrentImage('sprites/spring_close');
                break;
        }
    }
}
