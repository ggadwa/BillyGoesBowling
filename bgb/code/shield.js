import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BallClass from './ball.js';
import PlatformClass from '../code/platform.js';

export default class ShieldClass extends SpriteClass {

    static LIFE_TICK=90;
    static GLOW_RATE=5.0;
    static SHAKE_SIZE=3.0;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.lifeCount=-1;
        
        // setup
        this.addImage('sprites/billy_shield');
        this.setCurrentImage('sprites/billy_shield');
        
        this.show=false;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canStandOn=false;
        
        this.setCollideSpriteClassCollideIgnoreList([BallClass,PlayerSideScrollClass,PlatformClass]);
        this.setCollideSpriteClassStandOnIgnoreList([BallClass,PlayerSideScrollClass,PlatformClass]);
        this.setCollideTileIndexIgnoreList([22,23,54]);
        
        Object.seal(this);
    }
    
    onCollideSprite(sprite) {
        this.sendMessage(sprite,'hurt',null);
    }
    
    onMessage(fromSprite,cmd,data) {
        switch (cmd) {
            case 'start_shield':
                this.show=true;
                this.lifeCount=ShieldClass.LIFE_TICK;
                this.playSound('shield',this);
                break;
        }
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // not shown, nothing to do
        if (!this.show) return;
        
        // turn off if past life tick
        this.lifeCount--;
        if (this.lifeCount<=0) this.show=false;
        
        // follow player sprite
        this.x=(playerSprite.x-Math.trunc((this.width-playerSprite.width)/2))+this.randomScaled(ShieldClass.SHAKE_SIZE);
        this.y=(playerSprite.y+Math.trunc((this.height-playerSprite.height)/2))+this.randomScaled(ShieldClass.SHAKE_SIZE);
        
        // glows
        this.alpha=0.4+Math.abs(Math.sin(this.lifeCount/ShieldClass.GLOW_RATE)*0.3);
        
        // check for collisions
        this.checkCollision();
    }
}
