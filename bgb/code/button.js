import SpriteClass from '../../rpjs/engine/sprite.js';

export default class ButtonClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.SQUISH_TICK=5;
        
        // variables
        this.addImage('sprites/button');
        this.setCurrentImage('sprites/button');
        
        this.squishCount=0;
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new ButtonClass(this.game,x,y,this.data));
    }
    
    onStoodOnSprite(sprite) {
        let mode;
        
        // if squishing we can't step on again
        if (this.squishCount!==0) return;
        
        // get the action
        mode=this.data.get('mode');
        
        // mode = show means show the first sprite
        // that has this show_id
        if (mode==='show') {
            sprite=this.game.map.getFirstSpriteWithData('id',this.data.get('show_id'));
            sprite.show=true;
        }
        
        // mode = liquid means move the liquid to
        // the position by liquid_y
        if (mode==='liquid') {
            this.playSoundGlobal('splash');
            this.moveLiquidTo(this.data.get('liquid_y'),this.data.get('liquid_move_speed'));
        }
        
        // click sound
        this.playSound('click');
        
        // start the squish
        this.squishCount=this.SQUISH_TICK;
        
        this.canCollide=false;
        this.canStandOn=false;
    }
    
    run() {
        // if not squishing just check collisions
        if (this.squishCount===0) {
            this.checkCollision(null);
            return;
        }
        
        this.resizeY=(this.squishCount-1)/this.SQUISH_TICK;
        this.squishCount--;
        
        if (this.squishCount===0) {
            this.delete();
        }
    }
}
