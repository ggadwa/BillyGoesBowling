import SpriteClass from '../../rpjs/engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExecutionerClass from './executioner.js';

export default class AxeClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.SPEED=20;
        
        // setup
        this.addImage('sprites/axe');
        this.setCurrentImage('sprites/axe');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        this.canRiseBlock=false;
        
        this.flipY=true;
        
        this.setCollideSpriteClassIgnoreList([ExecutionerClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new AxeClass(this.game,x,y,this.data));
    }
    
    onCollideSprite(sprite) {
        let sprites,checkSprite;

        // pop clouds
        if (sprite instanceof CloudBlockClass) {
            this.sendMessage(sprite,'pop',null);
            return;
        }
        
        // break any strong blocks
        if (sprite instanceof BreakBlockStrongClass) {
            sprites=this.game.map.getSpritesWithinBox((this.x+10),(this.y+10),((this.x+this.width)-10),(this.y+20),this,BreakBlockStrongClass);
        
            for (checkSprite of sprites) {
                this.sendMessage(checkSprite,'explode',null);
            }
            
            this.delete();
        }
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.delete();
    }
    
    onRun(tick) {
        // constant speed
        this.y+=this.SPEED;

        // collisions
        this.checkCollision();        
    }
}
