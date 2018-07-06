import SpriteClass from '../engine/sprite.js';
import BallClass from '../code/ball.js';
import CloudBlockClass from './cloud_block.js';

export default class PlayerSideScrollClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // setup
            
        this.addImage('sprites/billy_left');
        this.addImage('sprites/billy_right');
        
        this.setCurrentImage('sprites/billy_right');
        this.setEditorImage('sprites/billy_right');
        this.setFacing(this.FACING_RIGHT);
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PlayerSideScrollClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.getGame().getMap().addSprite(new BallClass(0,0,null));
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let input=game.getInput();
        
            // input
            
        if (input.isLeft()) {
            this.moveWithCollision(-12,0);
            this.setCurrentImage('sprites/billy_left');
            this.setFacing(this.FACING_LEFT);
        }
        
        if (input.isRight()) {
            this.moveWithCollision(12,0);
            this.setCurrentImage('sprites/billy_right');
            this.setFacing(this.FACING_RIGHT);
        }
        
        this.clampX(0,(map.width-this.width));
        
        if ((input.isAction()) && (this.grounded)) this.addMotion(0,-35);
        
            // check for standing on a cloud
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
    }
}
