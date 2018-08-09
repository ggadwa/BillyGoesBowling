import SpriteClass from '../engine/sprite.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';

export default class ExecutionersAxeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.topY=this.y-800;
        this.axeDirection=-1;
        
            // setup
            
        this.addImage('sprites/axe');
        this.setCurrentImage('sprites/axe');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new ExecutionersAxeClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.x-=Math.trunc(this.width*0.5);     // recenter on axe width from launch point
    }
    
    runAI()
    {
        let map=this.game.map;
        let sprites,sprite;
        
            // travel in current direction
            
        this.y+=(25*this.axeDirection);
        
            // switch directions at top
            
        if (this.axeDirection<0) {
            if (this.y<this.topY) {
                this.axeDirection=1;
                this.y=this.topY;
            }
            return;
        }

            // collisions
            
        if (!map.checkCollision(this)) return;
        
            // interact with sprites, like destroying clouds
            
        if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
        
            // explode if we hit a break block
            
        if (!(this.collideSprite instanceof BreakBlockStrongClass)) return;
        
        sprites=map.getSurroundSprites(this,Math.trunc(this.width*0.5),0,Math.trunc(this.game.map.MAP_TILE_SIZE*0.5));
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }

        this.delete();
    }
}
