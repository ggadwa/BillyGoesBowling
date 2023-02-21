import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
import MapClass from '../../rpjs/engine/map.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import ShieldClass from './shield.js';
import BlockClass from './block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import BreakBlockHalfLeftClass from './break_block_half_left.js';
import BreakBlockHalfRightClass from './break_block_half_right.js';
import ExplodeBlockClass from './explode_block.js';
import ButtonClass from './button.js';
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
        
    static TRAVEL_MODE_FLOATING=0;
    static TRAVEL_MODE_BOWL_DOWN=1;
    static TRAVEL_MODE_BOWL_ACROSS=2;
    static TRAVEL_MODE_REFORM=3;
    static TRAVEL_MODE_SLAM_UP=4;
    static TRAVEL_MODE_SLAM_DOWN=5;
    static TRAVEL_MODE_CIRCLE=6;
        
    static HEAD_PIXEL_DISTANCE=10;
        
    static REFORM_COUNT=12;
    static REFORM_BALL_SHOW_COUNT=6;
        
    static BOWL_SPEED=30;
    static SLAM_UP_SPEED=35;
    static SLAM_DOWN_SPEED=40;
        
    static BALL_CIRCLE_SPEED=10;
    static BALL_CIRCLE_OFFSET_X=8;
    static BALL_CIRCLE_RADIUS_X=45;
    static BALL_CIRCLE_OFFSET_Y=50;
    static BALL_CIRCLE_RADIUS_Y=100;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.travelMode=BallClass.TRAVEL_MODE_FLOATING;
        this.travelX=0;
        this.travelY=0;
        this.travelXDirection=1;
        this.travelYAcross=0;
        this.travelYBottom=0;
        this.travelAngle=0;
        this.travelLeftEdge=0;
        this.travelRightEdge=0;
        
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
        this.travelMode=BallClass.TRAVEL_MODE_REFORM;
        this.reformTick=BallClass.REFORM_COUNT;
        
        this.x=playerSprite.x+Math.trunc((playerSprite.width-this.width)*0.5);
        this.y=(playerSprite.y-playerSprite.height)-BallClass.HEAD_PIXEL_DISTANCE;
        this.reformParticle=this.addParticle((this.x+halfWid),(this.y-halfHigh),ParticleClass.AFTER_SPRITES_LAYER,8,16,1.0,0.1,6,0.03,'particles/ball',16,0.5,true,(BallClass.REFORM_COUNT*33));
        
        this.playSound('ball_reform');
    }
    
    onCollideSprite(sprite) {
        // these break the ball
        if (
            (sprite instanceof BlockClass) ||
            (sprite instanceof BreakBlockStrongClass) ||
            (sprite instanceof ExplodeBlockClass) ||
            (sprite instanceof ButtonClass) ||
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
                return;
        }
        
        // half blocks break only on red side
        if (sprite instanceof BreakBlockHalfLeftClass) {
            if (this.travelXDirection<0) this.returnBall(true);
            return;
        }
        if (sprite instanceof BreakBlockHalfRightClass) {
            if (this.travelXDirection>0) this.returnBall(true);
            return;
        }
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        if (this.travelMode!==BallClass.TRAVEL_MODE_CIRCLE) this.returnBall(true);
    }
    
    onRun(tick) {
        let map=this.game.map;
        let playerSprite=this.getPlayerSprite();
        let px,py,topEdge,botEdge;
        let xOffset,yOffset,rad;
        
        // if the ball is hidden, it means the player
        // is dead or warping out, so do nothing here
        if (!this.show) return;
        
        // get the position by the mode
        xOffset=Math.trunc((playerSprite.width-this.width)*0.5);
        yOffset=-(playerSprite.height+BallClass.HEAD_PIXEL_DISTANCE);
        
        px=playerSprite.x+xOffset;
        py=playerSprite.y+yOffset;
        
        if (this.travelMode===BallClass.TRAVEL_MODE_FLOATING) this.flipX=playerSprite.flipX;
        
        // reforming is a special case
        if (this.travelMode===BallClass.TRAVEL_MODE_REFORM) {
            
            // are we done reforming?
            this.reformTick--;
            if (this.reformTick===0) {
                this.alpha=1.0;
                this.travelMode=BallClass.TRAVEL_MODE_FLOATING;
            }
            // otherwise fade in with particles
            else {
                this.x=px;
                this.y=py;
                if (this.reformTick>BallClass.REFORM_BALL_SHOW_COUNT) {
                    this.alpha=0.0;
                }
                else {
                    this.alpha=1.0-(this.reformTick/BallClass.REFORM_BALL_SHOW_COUNT);
                }
                        
                if (this.reformParticle!=null) {
                    this.reformParticle.resetPosition((px+Math.trunc(this.width*0.5)),(py-Math.trunc(this.height*0.5)));
                }
                
                return;
            }
        }
        
        // other movement modes
        switch (this.travelMode) {
            
            case BallClass.TRAVEL_MODE_BOWL_DOWN:
                this.travelY+=BallClass.BOWL_SPEED;
                if ((py+this.travelY)>=this.travelYBottom) {
                    this.travelX=0;
                    this.travelYAcross=this.travelYBottom;
                    this.travelMode=BallClass.TRAVEL_MODE_BOWL_ACROSS;
                    this.travelLeftEdge=map.getMapViewportLeftEdge(); // we determine left & right edge when starting the bowl, so if we move stuff offscreen it still gets hit
                    this.travelRightEdge=map.getMapViewportRightEdge();
                    py=this.travelYBottom;
                }
                else {
                    py+=this.travelY;
                }
                break;
                
            case BallClass.TRAVEL_MODE_BOWL_ACROSS:
                py=this.travelYAcross;
                
                if (this.travelXDirection<0) {
                    this.travelX-=BallClass.BOWL_SPEED;
                    if (((px+this.travelX)+this.width)<this.travelLeftEdge) {
                        this.travelX=this.travelLeftEdge-(px+this.width);
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.returnBall(false);
                    }
                }
                else {
                    this.travelX+=BallClass.BOWL_SPEED;
                    if ((px+this.travelX)>this.travelRightEdge) {
                        this.travelX=this.travelRightEdge-px;
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.returnBall(false);
                    }
                }
                
                px+=this.travelX;
                break;
                
            case BallClass.TRAVEL_MODE_SLAM_UP:
                px=this.travelX;
                this.travelY-=BallClass.SLAM_UP_SPEED;
                topEdge=map.getMapViewportTopEdge();
                if (this.travelY<=(topEdge-this.height)) {
                    this.travelMode=BallClass.TRAVEL_MODE_SLAM_DOWN;
                }
                py=this.travelY;
                break;
                
            case BallClass.TRAVEL_MODE_SLAM_DOWN:
                px=this.travelX;
                this.travelY+=BallClass.SLAM_DOWN_SPEED;
                botEdge=map.getMapViewportBottomEdge();
                if ((this.travelY-this.height)>botEdge) {
                    this.travelY=0;
                    this.returnBall(false);
                }
                py=this.travelY;
                break;
                
            case BallClass.TRAVEL_MODE_CIRCLE:
                this.travelAngle+=BallClass.BALL_CIRCLE_SPEED;
                if (this.travelAngle===360) {
                    this.returnBall(false);
                }
                else {
                    rad=(Math.PI/180.0)*this.travelAngle;
                    px=(playerSprite.x+BallClass.BALL_CIRCLE_OFFSET_X)+(Math.sin(rad)*BallClass.BALL_CIRCLE_RADIUS_X);
                    py=(playerSprite.y-BallClass.BALL_CIRCLE_OFFSET_Y)-(Math.cos(rad)*BallClass.BALL_CIRCLE_RADIUS_Y);
                }
                break;
        }
        
        // move ball and check for collisions
        this.x=px;
        this.y=py;
            
        if ((this.travelMode===BallClass.TRAVEL_MODE_BOWL_ACROSS) || (this.travelMode===BallClass.TRAVEL_MODE_SLAM_UP) || (this.travelMode===BallClass.TRAVEL_MODE_SLAM_DOWN) || (this.travelMode===BallClass.TRAVEL_MODE_CIRCLE)) {
            this.checkCollision();
        }
        
        // hitting water auto returns the ball
        if (this.isInLiquid()) {
            this.returnBall(true);
            return;
        }
        
        // change any travel mode
        if (this.travelMode===BallClass.TRAVEL_MODE_FLOATING) {
            
            // bowls down and across
            // we get the Y we will be bowling at from
            // the last ground contact, if in the air, then fire
            // at the tile line above, or if on ground, fire at current
            // tile line
            if (this.getInputStateBoolean(InputClass.BUTTON_B)) {
                this.travelMode=BallClass.TRAVEL_MODE_BOWL_DOWN;
                this.travelX=0;
                this.travelY=0;
                this.travelXDirection=playerSprite.flipX?-1:1;
                this.travelYBottom=(Math.trunc(playerSprite.lastGroundY/MapClass.MAP_TILE_SIZE)*MapClass.MAP_TILE_SIZE)-Math.trunc((MapClass.MAP_TILE_SIZE-this.height)*0.5);
                if (!playerSprite.grounded) this.travelYBottom-=MapClass.MAP_TILE_SIZE;
                
                this.playSound('bowl');
            }
            
            // bowls up and back down  
            if (this.getInputStateBoolean(InputClass.BUTTON_Y)) {
                this.travelMode=BallClass.TRAVEL_MODE_SLAM_UP;
                this.travelX=playerSprite.x+xOffset;
                this.travelY=(playerSprite.y-playerSprite.height)-BallClass.HEAD_PIXEL_DISTANCE;
                
                this.playSound('bowl');
            }
            
            // bowls in a circle around player, both the shield sprite
            // and the player sprite check for this key and active their parts
            // we chain this so only ball in right state can activate
            if ((this.getInputStateBoolean(InputClass.BUTTON_X)) || (this.getInputStateBoolean(InputClass.RIGHT_SHOULDER_TOP)) || (this.getInputStateBoolean(InputClass.RIGHT_SHOULDER_BOTTOM))) {
                this.travelMode=BallClass.TRAVEL_MODE_CIRCLE;
                this.travelAngle=0.0;
                this.sendMessage(playerSprite,'start_shield',null);
                
                this.playSound('bowl');
            }
        }
    }
}
