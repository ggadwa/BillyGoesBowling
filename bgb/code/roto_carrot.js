import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import ShurikinClass from './shurikin.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import CloudBlockClass from './cloud_block.js';
import DoorClass from './door.js';
import PinClass from './pin.js';
import TrophyClass from './trophy.js';

export default class RotoCarrotClass extends SpriteClass {
        
    static CARROT_SPEED=4;
    static CARROT_SPEED_RANDOM_ADD=4;
    static CARROT_Y_ARC=30;
    static CARROT_PAUSE_TICK=40;
    static CARROT_ARC_TICK=100;
    static BOMB_DROP_TICK=150;
    static BOMB_DROP_TICK_RANDOM_ADD=150;
    static CARROT_RESET_DISTANCE=500;
    static ANIMATION_TICK_FRAME=4;
        
        // variables
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/roto_carrot_1');
        this.addImage('sprites/roto_carrot_2');
        this.addImage('sprites/roto_carrot_3');
        this.setCurrentImage('sprites/roto_carrot_1');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassCollideIgnoreList([BombClass,CloudBlockClass,DoorClass,PinClass,TrophyClass]);
        this.setCollideSpriteClassStandOnIgnoreList([BombClass,CloudBlockClass,DoorClass,PinClass,TrophyClass]);
        this.setCollideTileIndexIgnoreList([22,23,54]);
        
        this.originalY=0;
        this.bombTick=0;
        this.carrotPause=0;
        this.carrotArc=0;
        
        this.speed=RotoCarrotClass.CARROT_SPEED+(Math.random()*RotoCarrotClass.CARROT_SPEED_RANDOM_ADD);
        
        Object.seal(this);
    }
    
    onMapStart() {
        this.originalY=this.y;
        this.bombTick=RotoCarrotClass.BOMB_DROP_TICK+Math.trunc(Math.random()*RotoCarrotClass.BOMB_DROP_TICK_RANDOM_ADD);
    }
    
    onCollideSprite(sprite) {
        // colliding with ball, shield, shurikin, or fish resets carrot
        if (
                (sprite instanceof BallClass) ||
                (sprite instanceof ShieldClass) ||
                (sprite instanceof ShurikinClass) ||
                (sprite instanceof FishClass)) {
                   this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),ParticleDefsClass.MONSTER_KILL_SMOKE_PARTICLE);
                   this.playSound('monster_die');
                   this.x=this.game.map.rightEdge+RotoCarrotClass.CARROT_RESET_DISTANCE;
                   return;
        }
    }
    
    dropBomb() {
        this.addSprite(BombClass,(this.x+16),(this.y-(this.height/3)),null);
    }

    onRun(tick) {
        let rad;
        let map=this.game.map;
        
        // is carrot paused? 
        if (this.carrotPause>0) {
            this.carrotPause--;
            this.setCurrentImage('sprites/roto_carrot_3');
            return;
        }
        else {
            if ((Math.trunc(tick/RotoCarrotClass.ANIMATION_TICK_FRAME)&0x1)===0) {
                this.setCurrentImage('sprites/roto_carrot_1');
            }
            else {
                this.setCurrentImage('sprites/roto_carrot_2');
            }
        }
        
        // always travel left to right
        this.x-=this.speed;
        if (this.x<(-this.width)) this.x=map.rightEdge+RotoCarrotClass.CARROT_RESET_DISTANCE;
        
        // Y goes in a cos wave
        this.carrotArc++;
        
        rad=((this.carrotArc%RotoCarrotClass.CARROT_ARC_TICK)*(2*Math.PI))/RotoCarrotClass.CARROT_ARC_TICK;
        this.y=this.originalY+Math.trunc(Math.cos(rad)*RotoCarrotClass.CARROT_Y_ARC);
        
        // drop bomb at specific intervals,
        if (this.bombTick>0) {
            this.bombTick--;
            return;
        }
        
        this.carrotPause=RotoCarrotClass.CARROT_PAUSE_TICK;
        this.bombTick=RotoCarrotClass.BOMB_DROP_TICK;
        this.dropBomb();
    }
}
