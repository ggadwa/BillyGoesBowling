import ControllerClass from '../engine/controller.js';

export default class BallClass extends ControllerClass
{
    constructor()
    {
        super();
        
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
    
    initialize(game,sprite)
    {
        let imgIdx;
        
        imgIdx=sprite.addImage(game.loadImage('../images/ball.png'));
        sprite.setCurrentImage(imgIdx);
    }
    
    canCollide()
    {
        return(false);
    }
    
    run(game,sprite,timestamp)
    {
        let input=game.getInput();
        let playerSprite=game.getMap().getSpritePlayer();
        let x,y,lftEdge,rgtEdge,botEdge;
        let xOffset=Math.trunc((playerSprite.getWidth()-sprite.getWidth())*0.5);
        
            // get the position by the mode
        
        x=playerSprite.getX()+xOffset;
        y=playerSprite.getRectTop()-this.HEAD_PIXEL_DISTANCE;
            
        switch (this.travelMode) {
            
            case this.TRAVEL_MODE_BOWL_DOWN:
                this.travelY+=20;
                botEdge=playerSprite.getRectBottom();
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
                    lftEdge=game.getMap().getMapViewportLeftEdge(game);
                    if (((x+this.travelX)+sprite.getWidth())<lftEdge) {
                        this.travelX=lftEdge-(x+sprite.getWidth());
                        this.travelY=0;
                        this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                    }
                }
                else {
                    this.travelX+=25;
                    rgtEdge=game.getMap().getMapViewportRightEdge(game);
                    if ((x+this.travelX)>rgtEdge) {
                        this.travelX=rgtEdge-x;
                        this.travelY=0;
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
                this.travelY-=30;
                if ((y+this.travelY)<=(-sprite.getHeight())) {
                    this.travelMode=this.TRAVEL_MODE_SLAM_DOWN;
                }
                y+=this.travelY;
                break;
                
            case this.TRAVEL_MODE_SLAM_DOWN:
                x=this.travelX;
                this.travelY+=40;
                botEdge=game.getMap().getMapViewportBottomEdge(game);
                if (((y+this.travelY)-sprite.getHeight())>botEdge) {
                    this.travelY=0;
                    this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                }
                y+=this.travelY;
                break;
                
        }
        
            // move ball and check for collisions
        
        sprite.setPosition(x,y);
            
        if ((this.travelMode===this.TRAVEL_MODE_BOWL_ACROSS) || (this.travelMode===this.TRAVEL_MODE_SLAM_DOWN)) {
            if (game.getMap().checkCollision(sprite)) {
                
                    // colliding with map, return ball
                    
                if (!sprite.hasCollideSprite()) {
                    this.travelY=0;
                    this.travelMode=this.TRAVEL_MODE_RETURN_DOWN;
                    return;
                }
                
                    // hit sprite
                    
                sprite.getCollideSprite().interactWithSprite(sprite,null);
                return;
            }
        }
        
            // change any travel mode
        
        if (this.travelMode===this.TRAVEL_MODE_FLOATING) {
            if (input.isDown()) {
                this.travelMode=this.TRAVEL_MODE_BOWL_DOWN;
                this.travelX=0;
                this.travelY=0;
                this.travelXDirection=(game.getMap().getSpritePlayer().getFacing()===sprite.FACING_LEFT)?-1:1;
            }
            if (input.isUp()) {
                this.travelMode=this.TRAVEL_MODE_SLAM_UP;
                this.travelX=playerSprite.getX()+xOffset;
                this.travelY=0;
            }
        }
    }
}
