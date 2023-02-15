import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BallClass from './ball.js';

export default class ShieldClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.LIFE_TICK=45;
        this.GLOW_RATE=5.0;
        this.SHAKE_SIZE=3.0;
        
        // variables
        this.lifeCount=-1;
        
        // setup
        this.addImage('sprites/billy_shield');
        this.setCurrentImage('sprites/billy_shield');
        
        this.show=false;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canStandOn=false;
        
        this.setCollideSpriteClassIgnoreList([BallClass,PlayerSideScrollClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new ShieldClass(this.game,x,y,this.data));
    }
    
    onMessage(fromSprite,cmd,data) {
        switch (cmd) {
            case 'start_shield':
                this.show=true;
                this.lifeCount=this.LIFE_TICK;
                this.playSound('shield',this);
                break;
        }
    }
    
    run() {
        let playerSprite=this.getPlayerSprite();
        let didCollide;
        
        // not shown, nothing to do
        if (!this.show) return;
        
        // turn off if past life tick
        this.lifeCount--;
        if (this.lifeCount<=0) this.show=false;
        
        // follow player sprite
        this.x=(playerSprite.x-Math.trunc((this.width-playerSprite.width)/2))+Math.trunc(Math.random()*this.SHAKE_SIZE);
        this.y=(playerSprite.y+Math.trunc((this.height-playerSprite.height)/2))+Math.trunc(Math.random()*this.SHAKE_SIZE);
        
        // glows
        this.alpha=0.4+Math.abs(Math.sin(this.lifeCount/this.GLOW_RATE)*0.3);
        
        // check for collisions outside of player and ball
        didCollide=this.checkCollision();
            
        if ((didCollide) && (this.collideSprite!==null)) {
            this.collideSprite.interactWithSprite(this,null);
        }
    }
}
