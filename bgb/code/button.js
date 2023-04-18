import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class ButtonClass extends SpriteClass {
        
    static SQUISH_TICK=10;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/button');
        this.setCurrentImage('sprites/button');
        
        this.squishCount=0;
        
        this.show=true;
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=12;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    onStoodOnSprite(sprite) {
        let mode;
        
        // only player can activate buttons
        if (!(sprite instanceof PlayerSideScrollClass)) return;
        
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
        
        // mode = world return to world
        if (mode==='world') {
            this.sendMessage(this.getPlayerSprite(),'warp_out',null);
        }
        
        // click sound
        this.playSound('click');
        
        // start the squish
        this.squishCount=ButtonClass.SQUISH_TICK;
        
        this.canCollide=false;
        this.canStandOn=false;
    }
    
    onRun(tick) {
        // if not squishing just check collisions
        if (this.squishCount===0) {
            this.checkCollision();
            this.runGravity();
            return;
        }
        
        this.resizeY=(this.squishCount-1)/ButtonClass.SQUISH_TICK;
        this.squishCount--;
        
        if (this.squishCount===0) {
            this.delete();
        }
    }
}
