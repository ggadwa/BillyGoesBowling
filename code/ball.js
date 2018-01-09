import SpriteClass from '../engine/sprite.js';
import BlockClass from './block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExplodeBlockClass from './explode_block.js';

export default class BallClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.TRAVEL_MODE_FLOATING=0;
        this.TRAVEL_MODE_BOWL_DOWN=1;
        this.TRAVEL_MODE_BOWL_ACROSS=2;
        this.TRAVEL_MODE_RETURN_DOWN=3;
        this.TRAVEL_MODE_SLAM_UP=4;
        this.TRAVEL_MODE_SLAM_DOWN=5;
        
        this.HEAD_PIXEL_DISTANCE=10;
        
        this.travelMode=this.TRAVEL_MODE_FLOATING;
        this.travelX=0;
        this.travelY=0;
        this.travelXDirection=1;
        this.travelYAcross=0;
        
        Object.seal(this);
    }
    
    initialize()
    {
        let imgIdx;
        
        imgIdx=this.addImage('ball');
        this.setCurrentImage(imgIdx);
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let input=game.getInput();
        let playerSprite=map.getSpritePlayer();
        let collideSprite;
        let x,y,lftEdge,rgtEdge,topEdge,botEdge;
        let xOffset=Math.trunc((playerSprite.width-this.width)*0.5);
        
            // get the position by the mode
        
        x=playerSprite.x+xOffset;
        y=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
            
        switch (this.travelMode) {
            
            case this.TRAVEL_MODE_BOWL_DOWN:
                this.travelY+=30;
                botEdge=playerSprite.y;
                if ((y+this.travelY)>=botEdge) {
                    this.travelX=0;
                    this.travelY=botEdge-y;
                    this.travelYAcross=botEdge;
                    this.travelMode=this.TRAVEL_MODE_BOWL_ACROSS;
                }
                y+=this.travelY;
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
                    this.travelX+=25;
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
        
        this.setPosition(x,y);
            
        if ((this.travelMode===this.TRAVEL_MODE_BOWL_ACROSS) || (this.travelMode===this.TRAVEL_MODE_SLAM_DOWN)) {
            if (map.checkCollision(this)) {
                
                    // colliding with map, return ball
                    
                if (!this.hasCollideSprite()) {
                    this.travelY=0;
                    this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                    return;
                }
                
                    // hit sprite
                
                collideSprite=this.getCollideSprite();    
                collideSprite.interactWithSprite(this,null);
                
                    // stop ball for everything but breakable blocks
                    
                if ((collideSprite instanceof BlockClass) || (collideSprite instanceof BreakBlockStrongClass) || (collideSprite instanceof ExplodeBlockClass)) {
                    this.travelY=0;
                    this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                }
                
                return;
            }
        }
        
            // change any travel mode
        
        if (this.travelMode===this.TRAVEL_MODE_FLOATING) {
            if (input.isDown()) {
                this.travelMode=this.TRAVEL_MODE_BOWL_DOWN;
                this.travelX=0;
                this.travelY=0;
                this.travelXDirection=(map.getSpritePlayer().getFacing()===this.FACING_LEFT)?-1:1;
            }
            if (input.isUp()) {
                this.travelMode=this.TRAVEL_MODE_SLAM_UP;
                this.travelX=playerSprite.x+xOffset;
                this.travelY=(playerSprite.y-playerSprite.height)-this.HEAD_PIXEL_DISTANCE;
            }
        }
    }
}
