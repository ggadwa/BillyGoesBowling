import SpriteClass from '../engine/sprite.js';

export default class ShurikinClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.needTravelSetup=false;
        this.travelX=0;
        this.travelY=0;
        
        Object.seal(this);
    }
    
    initialize()
    {
        let imgIdx;
        
        imgIdx=this.addImage('shurikin');
        this.setCurrentImage(imgIdx);
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.needTravelSetup=true;
        this.travelX=0;
        this.travelY=0;
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let playerSprite=map.getSpritePlayer();
        
            // if first call, then we need to setup
            // the travel
            
        if (this.needTravelSetup) {
            this.needTravelSetup=false;
            this.travelX=(playerSprite.x<this.x)?-5:5;
            this.travelY=(playerSprite.y<this.y)?-3:3;
        }
        
        this.x+=this.travelX;
        this.y+=this.travelY;

        if (map.checkCollision(this)) {
            this.delete();
        }
    }
}
