import SpriteClass from '../../rpjs/engine/sprite.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExecutionerClass from './executioner.js';

export default class AxeClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.COLLIDE_CLASS_IGNORE=[ExecutionerClass];
        
        // variables
        this.topY=this.y-800;
        
        // setup
        this.addImage('sprites/axe');
        this.setCurrentImage('sprites/axe');
        this.flipY=false; // starts going up
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        this.canRiseBlock=false; // so execution doesn't hit own axe
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new AxeClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.x-=Math.trunc(this.width*0.5); // recenter on axe width from launch point
    }
    
    run() {
        let map=this.game.map;
        let sprites,sprite;
        
        // travel in current direction
        this.y+=(this.flipY?25:-25);
        
        // switch directions at top
        if (!this.flipY) {
            if (this.y<this.topY) {
                this.flipY=true;
                this.y=this.topY;
            }
            return;
        }

        // collisions
        if (!this.checkCollision(this.COLLIDE_CLASS_IGNORE)) return;
        
        // interact with sprites, like destroying clouds
        if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
        
        // explode if we hit a break block
        if (!(this.collideSprite instanceof BreakBlockStrongClass)) return;
        
        sprites=map.getSpritesWithinBox((this.x+10),(this.y+10),((this.x+this.width)-10),(this.y+20),this,BreakBlockStrongClass);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }

        this.delete();
    }
}
