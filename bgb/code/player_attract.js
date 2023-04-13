import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
import ParticleDefsClass from './particle_defs.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import CloudBlockClass from './cloud_block.js';
import ButtonClass from './button.js';
import SpringClass from './spring.js';
import DrainPipeSnakeClass from './drain_pipe_snake.js';
import NinjaBunnyClass from './ninja_bunny.js';
import ShurikinClass from './shurikin.js';
import RotoCarrotClass from './roto_carrot.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import ExecutionerClass from './executioner.js';
import AxeClass from './axe.js';
import MrCPUClass from './mr_cpu.js';
import BoneyOneEyeClass from '../code/boney_one_eye.js';
import EyeClass from './eye.js';
import KangarangClass from '../code/kangarang.js';
import BoomerangClass from './boomerang.js';
import KingGhastlyClass from '../code/king_ghastly.js';
import BurningEyeClass from '../code/burning_eye.js';

export default class PlayerAttractClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.moveX=2;
        
        this.addImage('sprites/billy_walk_1');
        this.setCurrentImage('sprites/billy_walk_1');
        
        this.cameraOffsetY=800;
        this.show=true;

        this.gravityFactor=0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    isPlayer() {
        return(true);
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.moveX=-this.moveX;
    }
    
    onRun(tick) {
        this.moveWithCollision(this.moveX,0);
    }
}
