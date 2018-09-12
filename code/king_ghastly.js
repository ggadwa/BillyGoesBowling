import SpriteClass from '../engine/sprite.js';
import GrayFilterClass from '../filters/gray.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockClass from '../code/break_block.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BallClass from './ball.js';

export default class KingGhastlyClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.TILE_IDX_BUMP=18;
        this.GHASTLY_SPEED=8;
        this.JUMP_HEIGHT=-40;
        this.BACKUP_TICK=10;
        
            // variables
            
        this.backupCount=-1;
        this.isDropping=true;
        this.isDead=false;
        
            // setup
        
        this.addImage('sprites/king_ghastly');
        this.setCurrentImage('sprites/king_ghastly');
        this.setEditorImage('sprites/king_ghastly');
        
        this.show=false;            // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new KingGhastlyClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.isDropping=true;
        this.isDead=false;
    }
    
    smashBlocks()
    {
        let map=this.game.map;
        let sprite,sprites;
        
        sprites=map.getSpritesWithinBox(this.x,((this.y-this.height)-64),((this.x+this.width)+256),(this.y+64),this,BreakBlockClass);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        sprites=map.getSpritesWithinBox(this.x,((this.y-this.height)-64),((this.x+this.width)+256),(this.y+64),this,ExplodeBlockClass);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        map.shake(4);
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
            map.shake(10);
        }
        
            // dead, do nothig
            
        if (this.isDead) {
            this.y+=1;
            return;
        }
        
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            playerSprite.warpOut();
            this.isDead=true;
            this.gravityFactor=0.0;
            this.drawFilter=new GrayFilterClass();
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,this.game.imageList.get('particles/skull'),30,2500);
        }

            // are we backing up?

        if (this.backupCount!==-1) {
            this.backupCount--;
            
            this.x-=this.GHASTLY_SPEED;
            if (map.checkCollision(this)) this.x+=this.GHASTLY_SPEED;
            return;
        }
        
            // always head towards the right
            // any collisions with breaking blocks forces
            // ghastly back, any other up
            
        this.x+=this.GHASTLY_SPEED;
        
        if (map.checkCollision(this)) {
            this.x-=this.GHASTLY_SPEED;
            
            if (this.grounded) {
                this.motion.y=this.JUMP_HEIGHT;
                
                if (this.collideSprite!==null) {
                    if (this.collideSprite instanceof BreakBlockClass) this.backupCount=this.BACKUP_TICK;
                }
                
                this.smashBlocks();
            }
        }
    }
    
}
