import SpriteClass from '../engine/sprite.js';
import BlockClass from './block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExplodeBlockClass from './explode_block.js';
import EasterHeadClass from './easter_head.js';
import ExecutionerClass from './executioner.js';

export default class BallClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // statics
            
        this.TRAVEL_MODE_FLOATING=0;
        this.TRAVEL_MODE_BOWL_DOWN=1;
        this.TRAVEL_MODE_BOWL_ACROSS=2;
        this.TRAVEL_MODE_RETURN_DOWN=3;
        this.TRAVEL_MODE_SLAM_UP=4;
        this.TRAVEL_MODE_SLAM_DOWN=5;
        
        this.HEAD_PIXEL_DISTANCE=10;
        
            // variables
            
        this.travelMode=this.TRAVEL_MODE_FLOATING;
        this.travelX=0;
        this.travelY=0;
        this.travelXDirection=1;
        this.travelYAcross=0;
        this.travelYBottom=0;
        
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
    
    duplicate(x,y)
    {
        return(new BallClass(this.game,x,y,this.data));
    }
    
    returnBall()
    {
        this.travelY=this.game.map.getMapViewportTopEdge()-this.height;
        this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        let x,y,lftEdge,rgtEdge,topEdge,botEdge;
        let xOffset=Math.trunc((playerSprite.width-this.width)*0.5);
        
            // if the ball is hidden, it means the player
            // is dead or warping out, so do nothing here
            
        if (!this.show) return;
        
            // get the position by the mode
        
        x=playerSprite.x+xOffset;
        y=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
            
        switch (this.travelMode) {
            
            case this.TRAVEL_MODE_BOWL_DOWN:
                this.travelY+=30;
                if ((y+this.travelY)>=this.travelYBottom) {
                    this.travelX=0;
                    this.travelYAcross=this.travelYBottom;
                    this.travelMode=this.TRAVEL_MODE_BOWL_ACROSS;
                    
                    y=this.travelYBottom;
                }
                else {
                    y+=this.travelY;
                }
                break;
                
            case this.TRAVEL_MODE_BOWL_ACROSS:
                y=this.travelYAcross;
                
                if (this.travelXDirection<0) {
                    this.travelX-=30;
                    lftEdge=map.getMapViewportLeftEdge();
                    if (((x+this.travelX)+this.width)<lftEdge) {
                        this.travelX=lftEdge-(x+this.width);
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                    }
                }
                else {
                    this.travelX+=30;
                    rgtEdge=map.getMapViewportRightEdge();
                    if ((x+this.travelX)>rgtEdge) {
                        this.travelX=rgtEdge-x;
                        this.travelY=map.getMapViewportTopEdge()-this.height;
                        this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                    }
                }
                
                x+=this.travelX;
                break;
                
            case this.TRAVEL_MODE_RETURN_DOWN:
                this.travelY+=25;
                if (this.travelY>=y) {
                    this.travelY=y;
                    this.travelMode=this.TRAVEL_MODE_FLOATING;
                }
                y=this.travelY;
                break;
                
            case this.TRAVEL_MODE_SLAM_UP:
                x=this.travelX;
                this.travelY-=35;
                topEdge=map.getMapViewportTopEdge();
                if (this.travelY<=(topEdge-this.height)) {
                    this.travelMode=this.TRAVEL_MODE_SLAM_DOWN;
                }
                y=this.travelY;
                break;
                
            case this.TRAVEL_MODE_SLAM_DOWN:
                x=this.travelX;
                this.travelY+=40;
                botEdge=map.getMapViewportBottomEdge();
                if ((this.travelY-this.height)>botEdge) {
                    this.travelY=0;
                    this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                }
                y=this.travelY;
                break;
                
        }
        
            // move ball and check for collisions
        
        this.x=x;
        this.y=y;
            
        if ((this.travelMode===this.TRAVEL_MODE_BOWL_ACROSS) || (this.travelMode===this.TRAVEL_MODE_SLAM_UP) || (this.travelMode===this.TRAVEL_MODE_SLAM_DOWN)) {
            if (map.checkCollision(this)) {
                
                    // colliding with map, return ball
                    
                if (this.collideSprite===null) {
                    this.returnBall();
                    return;
                }
                
                     // collide with sprites
                    
                this.collideSprite.interactWithSprite(this,null);
                
                    // stop ball for certain sprites
                    
                if ((this.collideSprite instanceof BlockClass) || (this.collideSprite instanceof BreakBlockStrongClass) || (this.collideSprite instanceof ExplodeBlockClass) || (this.collideSprite instanceof EasterHeadClass) || (this.collideSprite instanceof ExecutionerClass)) {
                    this.returnBall();
                }
                
                return;
            }
        }
        
            // change any travel mode
        
        if (this.travelMode===this.TRAVEL_MODE_FLOATING) {
            
                // bowls down and across
                // we get the Y we will be bowling at from
                // the last ground contact, if in the air, then fire
                // at the tile line above, or if on ground, fire at current
                // tile line.  If falling, you can't fire
                
            if ((this.game.input.isDown()) && (playerSprite.motion.y<=0)) {
                this.travelMode=this.TRAVEL_MODE_BOWL_DOWN;
                this.travelX=0;
                this.travelY=0;
                this.travelXDirection=playerSprite.data.get('facing_direction');
                this.travelYBottom=(Math.trunc(playerSprite.lastGroundY/map.MAP_TILE_SIZE)*map.MAP_TILE_SIZE)-Math.trunc((map.MAP_TILE_SIZE-this.height)*0.5);
                if (!playerSprite.grounded) this.travelYBottom-=map.MAP_TILE_SIZE;
            }
            
                // bowls up and back down
                
            if (this.game.input.isUp()) {
                this.travelMode=this.TRAVEL_MODE_SLAM_UP;
                this.travelX=playerSprite.x+xOffset;
                this.travelY=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
            }
        }
    }
}
