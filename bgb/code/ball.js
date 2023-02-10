import SpriteClass from '../../rpjs/engine/sprite.js';
import BlockClass from './block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExplodeBlockClass from './explode_block.js';
import EasterHeadClass from './easter_head.js';
import ExecutionerClass from './executioner.js';

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
        
        this.REFORM_LIFE_TICK=400;
        this.REFORM_SHOW_TICK=200;
        
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
        
        this.travelReformStartTick=0;
        this.reformParticle=null;
        
        // setup
        this.addImage('sprites/ball');    
        this.setCurrentImage('sprites/ball');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        this.canRiseBlock=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BallClass(this.game,x,y,this.data));
    }
    
    returnBall(showDestroy) {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        let halfWid=Math.trunc(this.width*0.5);
        let halfHigh=Math.trunc(this.height*0.5);
        
        // ball destroyed
        if (showDestroy) {
            map.addParticle((this.x+halfWid),(this.y-halfHigh),8,8,1.0,0.1,4,0.03,'particles/ball',16,0.5,false,500);
            this.game.soundList.playAtSprite('ball_break',this,playerSprite);
        }
        
        // reset position and reform
        this.travelMode=this.TRAVEL_MODE_REFORM;
        this.travelReformStartTick=this.game.timestamp;
        
        this.x=playerSprite.x+Math.trunc((playerSprite.width-this.width)*0.5);
        this.y=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
        this.reformParticle=this.game.map.addParticle((this.x+halfWid),(this.y-halfHigh),8,16,1.0,0.1,6,0.03,'particles/ball',16,0.5,true,this.REFORM_LIFE_TICK);
        
        this.game.soundList.playAtSprite('ball_reform',this,playerSprite);
    }
    
    run() {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        let didCollide;
        let px,py,lftEdge,rgtEdge,topEdge,botEdge,tick;
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
            tick=this.game.timestamp-this.travelReformStartTick;
            if (tick>this.REFORM_LIFE_TICK) {
                this.alpha=1.0;
                this.travelMode=this.TRAVEL_MODE_FLOATING;
            }
            // otherwise fade in with particles
            else {
                this.x=px;
                this.y=py;
                if (tick<this.REFORM_SHOW_TICK) {
                    this.alpha=0.0;
                }
                else {
                    this.alpha=(tick-this.REFORM_SHOW_TICK)/(this.REFORM_LIFE_TICK-this.REFORM_SHOW_TICK);
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
                this.travelY+=30;
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
                    this.travelX-=30;
                    lftEdge=map.getMapViewportLeftEdge();
                    if (((px+this.travelX)+this.width)<lftEdge) {
                        this.travelX=lftEdge-(px+this.width);
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.returnBall(false);
                    }
                }
                else {
                    this.travelX+=30;
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
                this.travelY-=35;
                topEdge=map.getMapViewportTopEdge();
                if (this.travelY<=(topEdge-this.height)) {
                    this.travelMode=this.TRAVEL_MODE_SLAM_DOWN;
                }
                py=this.travelY;
                break;
                
            case this.TRAVEL_MODE_SLAM_DOWN:
                px=this.travelX;
                this.travelY+=40;
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
            
            playerSprite.canCollide=false; // get player and possible shield out of way
            playerSprite.shieldSprite.canCollide=false;
            didCollide=map.checkCollision(this);
            playerSprite.canCollide=true;
            playerSprite.shieldSprite.canCollide=true;
            
            if (didCollide) {
                
                // colliding with map, return ball
                // unless it's a defensive circle
                if (this.collideSprite===null) {
                    if (this.travelMode!==this.TRAVEL_MODE_CIRCLE) this.returnBall(true);
                    return;
                }
                
                // collide with sprites
                this.sendMessage(this.collideSprite,'hurt',null);
                
                // stop ball for certain sprites
                if ((this.collideSprite instanceof BlockClass) || (this.collideSprite instanceof BreakBlockStrongClass) || (this.collideSprite instanceof ExplodeBlockClass) || (this.collideSprite instanceof EasterHeadClass) || (this.collideSprite instanceof ExecutionerClass)) {
                    this.returnBall(true);
                }
                
                return;
            }
        }
        
        // hitting water auto returns the ball
        if (map.liquidY!==-1) {
            if (this.y>map.liquidY) {
                this.returnBall(true);
                return;
            }
        }
        
        // change any travel mode
        if (this.travelMode===this.TRAVEL_MODE_FLOATING) {
            
            // bowls down and across
            // we get the Y we will be bowling at from
            // the last ground contact, if in the air, then fire
            // at the tile line above, or if on ground, fire at current
            // tile line
            if (this.game.input.isKeyDown("ArrowRight")) {
                this.travelMode=this.TRAVEL_MODE_BOWL_DOWN;
                this.travelX=0;
                this.travelY=0;
                this.travelXDirection=playerSprite.flipX?-1:1;
                this.travelYBottom=(Math.trunc(playerSprite.lastGroundY/map.MAP_TILE_SIZE)*map.MAP_TILE_SIZE)-Math.trunc((map.MAP_TILE_SIZE-this.height)*0.5);
                if (!playerSprite.grounded) this.travelYBottom-=map.MAP_TILE_SIZE;
                
                this.game.soundList.playAtSprite('bowl',this,playerSprite);
            }
            
            // bowls up and back down  
            if (this.game.input.isKeyDown("ArrowUp")) {
                this.travelMode=this.TRAVEL_MODE_SLAM_UP;
                this.travelX=playerSprite.x+xOffset;
                this.travelY=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
                
                this.game.soundList.playAtSprite('bowl',this,playerSprite);
            }
            
            // bowls in a circle around player, both the shield sprite
            // and the player sprite check for this key and active their parts
            // we chain this so only ball in right state can activate
            if (this.game.input.isKeyDown("ArrowDown")) {
                this.travelMode=this.TRAVEL_MODE_CIRCLE;
                this.travelAngle=0.0;
                this.sendMessage(playerSprite,'start_shield',null);
                
                this.game.soundList.playAtSprite('bowl',this,playerSprite);
            }
        }
    }
}
