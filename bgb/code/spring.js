import SpriteClass from '../../rpjs/engine/sprite.js';

export default class SpringClass extends SpriteClass {

    static SPRING_JUMP_HEIGHT=-80;
    static SPRING_MAX_MOVE=32;
    static SPRING_MOVE=4;
        
    static SPRING_NONE=0;
    static SPRING_UP=1;
    static SPRING_DOWN=2; 
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        // variables
        this.springMode=SpringClass.SPRING_NONE;
        
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
        if (this.springMode!==SpringClass.SPRING_NONE) return;
        
        sprite.addGravity(SpringClass.SPRING_JUMP_HEIGHT,0);

        this.playSound('boing');
        
        this.springMode=SpringClass.SPRING_UP;
    }

    onRun(tick) {
        // run collision checks without moving
        this.checkCollision();
        
        // run any modes
        switch (this.springMode) {
            case SpringClass.SPRING_NONE:
                this.drawOffsetY=0;
                this.setCurrentImage('sprites/spring_close');
                return;
            case SpringClass.SPRING_UP:
                this.drawOffsetY-=SpringClass.SPRING_MOVE;
                if (this.drawOffsetY===-SpringClass.SPRING_MAX_MOVE) {
                    this.springMode=SpringClass.SPRING_DOWN;
                }
                this.setCurrentImage('sprites/spring_open');
                break;
            case SpringClass.SPRING_DOWN:
                this.drawOffsetY+=SpringClass.SPRING_MOVE;
                if (this.drawOffsetY===0) {
                    this.springMode=SpringClass.SPRING_NONE;
                }
                this.setCurrentImage('sprites/spring_close');
                break;
        }
    }
}
