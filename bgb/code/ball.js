import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
import MapClass from '../../rpjs/engine/map.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import ShieldClass from './shield.js';
import BlockClass from './block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExplodeBlockClass from './explode_block.js';
import EasterHeadClass from './easter_head.js';
import ExecutionerClass from './executioner.js';
import AxeClass from './axe.js';
import MrCPUClass from '../code/mr_cpu.js';
import BoneyOneEyeClass from '../code/boney_one_eye.js';
import EyeClass from './eye.js';
import KangarangClass from '../code/kangarang.js';
import BoomerangClass from './boomerang.js';
import KingGhastlyClass from '../code/king_ghastly.js';

export default class BallClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.TRAVEL_MODE_FLOATING=0;
        this.TRAVEL_MODE_BOWL_DOWN=1;
        this.TRAVEL_MODE_BOWL_ACROSS=2;
        this.TRAVEL_MODE_REFORM=3;
        this.TRAVEL_MODE_SLAM_UP=4;
        this.TRAVEL_MODE_SLAM_DOWN=5;
        this.TRAVEL_MODE_CIRCLE=6;
        
        this.HEAD_PIXEL_DISTANCE=10;
        
        this.REFORM_COUNT=12;
        this.REFORM_BALL_SHOW_COUNT=6;
        
        this.BOWL_SPEED=30;
        this.SLAM_UP_SPEED=35;
        this.SLAM_DOWN_SPEED=40;
        
        this.BALL_CIRCLE_SPEED=10;
        this.BALL_CIRCLE_OFFSET_X=8;
        this.BALL_CIRCLE_RADIUS_X=45;
        this.BALL_CIRCLE_OFFSET_Y=50;
        this.BALL_CIRCLE_RADIUS_Y=100;
        
        // variables
        this.travelMode=this.TRAVEL_MODE_FLOATING;
        this.travelX=0;
        this.travelY=0;
        this.travelXDirection=1;
        this.travelYAcross=0;
        this.travelYBottom=0;
        this.travelAngle=0;
        
        this.reformTick=0;
        this.reformParticle=null;
        
        // setup
        this.addImage('sprites/ball');    
        this.setCurrentImage('sprites/ball');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=false;
        this.canRiseBlock=false;
        
        this.setCollideSpriteClassIgnoreList([PlayerSideScrollClass,ShieldClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BallClass(this.game,x,y,this.data));
    }
    
    returnBall(showDestroy) {
        let playerSprite=this.getPlayerSprite();
        let halfWid=Math.trunc(this.width*0.5);
        let halfHigh=Math.trunc(this.height*0.5);
        
        // ball destroyed
        if (showDestroy) {
            this.addParticle((this.x+halfWid),(this.y-halfHigh),ParticleClass.AFTER_SPRITES_LAYER,8,8,1.0,0.1,4,0.03,'particles/ball',16,0.5,false,500);
            this.playSound('ball_break');
        }
        
        // reset position and reform
        this.travelMode=this.TRAVEL_MODE_REFORM;
        this.reformTick=this.REFORM_COUNT;
        
        this.x=playerSprite.x+Math.trunc((playerSprite.width-this.width)*0.5);
        this.y=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
        this.reformParticle=this.addParticle((this.x+halfWid),(this.y-halfHigh),ParticleClass.AFTER_SPRITES_LAYER,8,16,1.0,0.1,6,0.03,'particles/ball',16,0.5,true,(this.REFORM_COUNT*33));
        
        this.playSound('ball_reform');
    }
    
    onCollideSprite(sprite) {
        if (
            (sprite instanceof BlockClass) ||
            (sprite instanceof BreakBlockStrongClass) ||
            (sprite instanceof ExplodeBlockClass) ||
            (sprite instanceof EasterHeadClass) ||
            (sprite instanceof ExecutionerClass) ||
            (sprite instanceof AxeClass) ||
            (sprite instanceof MrCPUClass) ||
            (sprite instanceof BoneyOneEyeClass) ||
            (sprite instanceof EyeClass) ||
            (sprite instanceof KangarangClass) ||
            (sprite instanceof BoomerangClass) ||
            (sprite instanceof KingGhastlyClass)) {
                this.returnBall(true);
        }
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        if (this.travelMode!==this.TRAVEL_MODE_CIRCLE) this.returnBall(true);
    }
    
    onRun(tick) {
        let map=this.game.map;
        let playerSprite=this.getPlayerSprite();
        let px,py,lftEdge,rgtEdge,topEdge,botEdge;
        let xOffset, yOffset, rad;
        
        // if the ball is hidden, it means the player
        // is dead or warping out, so do nothing here
        if (!this.show) return;
        
        // get the position by the mode
        xOffset=Math.trunc((playerSprite.width-this.width)*0.5);
        yOffset=-(playerSprite.height+this.HEAD_PIXEL_DISTANCE);
        
        px=playerSprite.x+xOffset;
        py=playerSprite.y+yOffset;
        
        if (this.travelMode===this.TRAVEL_MODE_FLOATING) this.flipX=playerSprite.flipX;
        
        // reforming is a special case
        if (this.travelMode===this.TRAVEL_MODE_REFORM) {
            
            // are we done reforming?
            this.reformTick--;
            if (this.reformTick===0) {
                this.alpha=1.0;
                this.travelMode=this.TRAVEL_MODE_FLOATING;
            }
            // otherwise fade in with particles
            else {
                this.x=px;
                this.y=py;
                if (this.reformTick>this.REFORM_BALL_SHOW_COUNT) {
                    this.alpha=0.0;
                }
                else {
                    this.alpha=1.0-(this.reformTick/this.REFORM_BALL_SHOW_COUNT);
                }
                        
                if (this.reformParticle!=null) {
                    this.reformParticle.resetPosition((px+Math.trunc(this.width*0.5)),(py-Math.trunc(this.height*0.5)));
                }
                
                return;
            }
        }
        
        // other movement modes
        switch (this.travelMode) {
            
            case this.TRAVEL_MODE_BOWL_DOWN:
                this.travelY+=this.BOWL_SPEED;
                if ((py+this.travelY)>=this.travelYBottom) {
                    this.travelX=0;
                    this.travelYAcross=this.travelYBottom;
                    this.travelMode=this.TRAVEL_MODE_BOWL_ACROSS;
                    
                    py=this.travelYBottom;
                }
                else {
                    py+=this.travelY;
                }
                break;
                
            case this.TRAVEL_MODE_BOWL_ACROSS:
                py=this.travelYAcross;
                
                if (this.travelXDirection<0) {
                    this.travelX-=this.BOWL_SPEED;
                    lftEdge=map.getMapViewportLeftEdge();
                    if (((px+this.travelX)+this.width)<lftEdge) {
                        this.travelX=lftEdge-(px+this.width);
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.returnBall(false);
                    }
                }
                else {
                    this.travelX+=this.BOWL_SPEED;
                    rgtEdge=map.getMapViewportRightEdge();
                    if ((px+this.travelX)>rgtEdge) {
                        this.travelX=rgtEdge-px;
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.returnBall(false);
                    }
                }
                
                px+=this.travelX;
                break;
                
            case this.TRAVEL_MODE_SLAM_UP:
                px=this.travelX;
                this.travelY-=this.SLAM_UP_SPEED;
                topEdge=map.getMapViewportTopEdge();
                if (this.travelY<=(topEdge-this.height)) {
                    this.travelMode=this.TRAVEL_MODE_SLAM_DOWN;
                }
                py=this.travelY;
                break;
                
            case this.TRAVEL_MODE_SLAM_DOWN:
                px=this.travelX;
                this.travelY+=this.SLAM_DOWN_SPEED;
                botEdge=map.getMapViewportBottomEdge();
                if ((this.travelY-this.height)>botEdge) {
                    this.travelY=0;
                    this.returnBall(false);
                }
                py=this.travelY;
                break;
                
            case this.TRAVEL_MODE_CIRCLE:
                this.travelAngle+=this.BALL_CIRCLE_SPEED;
                if (this.travelAngle===360) {
                    this.returnBall(false);
                }
                else {
                    rad=(Math.PI/180.0)*this.travelAngle;
                    px=(playerSprite.x+this.BALL_CIRCLE_OFFSET_X)+(Math.sin(rad)*this.BALL_CIRCLE_RADIUS_X);
                    py=(playerSprite.y-this.BALL_CIRCLE_OFFSET_Y)-(Math.cos(rad)*this.BALL_CIRCLE_RADIUS_Y);
                }
                break;
        }
        
        // move ball and check for collisions
        this.x=px;
        this.y=py;
            
        if ((this.travelMode===this.TRAVEL_MODE_BOWL_ACROSS) || (this.travelMode===this.TRAVEL_MODE_SLAM_UP) || (this.travelMode===this.TRAVEL_MODE_SLAM_DOWN) || (this.travelMode===this.TRAVEL_MODE_CIRCLE)) {
            this.checkCollision();
        }
        
        // hitting water auto returns the ball
        if (this.isInLiquid()) {
            this.returnBall(true);
            return;
        }
        
        // change any travel mode
        if (this.travelMode===this.TRAVEL_MODE_FLOATING) {
            
            // bowls down and across
            // we get the Y we will be bowling at from
            // the last ground contact, if in the air, then fire
            // at the tile line above, or if on ground, fire at current
            // tile line
            if (this.getInputState(InputClass.BUTTON_B)) {
                this.travelMode=this.TRAVEL_MODE_BOWL_DOWN;
                this.travelX=0;
                this.travelY=0;
                this.travelXDirection=playerSprite.flipX?-1:1;
                this.travelYBottom=(Math.trunc(playerSprite.lastGroundY/MapClass.MAP_TILE_SIZE)*MapClass.MAP_TILE_SIZE)-Math.trunc((MapClass.MAP_TILE_SIZE-this.height)*0.5);
                if (!playerSprite.grounded) this.travelYBottom-=MapClass.MAP_TILE_SIZE;
                
                this.playSound('bowl');
            }
            
            // bowls up and back down  
            if (this.getInputState(InputClass.BUTTON_Y)) {
                this.travelMode=this.TRAVEL_MODE_SLAM_UP;
                this.travelX=playerSprite.x+xOffset;
                this.travelY=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
                
                this.playSound('bowl');
            }
            
            // bowls in a circle around player, both the shield sprite
            // and the player sprite check for this key and active their parts
            // we chain this so only ball in right state can activate
            if (this.getInputState(InputClass.BUTTON_X)) {
                this.travelMode=this.TRAVEL_MODE_CIRCLE;
                this.travelAngle=0.0;
                this.sendMessage(playerSprite,'start_shield',null);
                
                this.playSound('bowl');
            }
        }
    }
}
