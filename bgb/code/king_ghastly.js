import SpriteClass from '../../rpjs/engine/sprite.js';
import GrayFilterClass from '../../rpjs/filters/gray.js';
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
        this.isFirstShow=true;
        
            // setup
        
        this.addImage('sprites/king_ghastly_1');
        this.addImage('sprites/king_ghastly_2');
        this.setCurrentImage('sprites/king_ghastly_1');
        
        this.show=false;            // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.grayDrawFilter=new GrayFilterClass();
        
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
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
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
        this.game.soundList.play('thud');
    }
    
    run()
    {
        let time, oldTime;
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // the first time we get called is
            // when we first appear, so play sound fx
            
        if (this.show) {
            if (this.isFirstShow) {
                this.isFirstShow=false;
                this.game.soundList.play('boss_appear');
            }
        }
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
            map.shake(10);
            this.game.soundList.play('thud');
        }
        
            // dead, do nothig
            
        if (this.isDead) {
            this.y+=6;
            return;
        }
        
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            playerSprite.warpOut();
            this.isDead=true;
            this.gravityFactor=0.0;
            this.drawFilter=this.grayDrawFilter;
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
            this.game.soundList.play('boss_dead');
            
            // update the state
            this.game.setData(('boss_'+map.name),true);
            this.game.setData(('boss_explode_'+map.name),true);
            this.game.setData(('time_'+map.name),1000000);
        
            // update the time
            time=this.game.stopCompletionTimer();
            oldTime=this.game.getData('time_'+map.name);
            if (time<oldTime) this.game.setData(('time_'+map.name),time);

            // save the data
            this.game.persistData();
            
            map.forceCameraSprite=this;
            return;
        }

            // are we backing up?

        if (this.backupCount!==-1) {
            this.backupCount--;
            
            this.x-=this.GHASTLY_SPEED;
            if (map.checkCollision(this)) this.x+=this.GHASTLY_SPEED;
            return;
        }
        
            // image
            
        if ((Math.trunc(this.game.timestamp/200)&0x1)===0) {
            this.setCurrentImage('sprites/king_ghastly_1');
        }
        else {
            this.setCurrentImage('sprites/king_ghastly_2');
        }
        
            // always head towards the player
        
        this.x+=this.GHASTLY_SPEED;
        
            // any collisions with breaking blocks forces
            // ghastly back, any other up
        
        if (map.checkCollision(this)) {
            this.x-=this.GHASTLY_SPEED;
            
            if (this.grounded) {
                this.motion.y=this.JUMP_HEIGHT;
                
                if (this.collideSprite!==null) {
                    if (this.collideSprite instanceof BreakBlockClass) this.backupCount=this.BACKUP_TICK;
                }
                
                this.smashBlocks();
            }
            
            if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
            if (this.standSprite!==null) this.standSprite.interactWithSprite(this,null);        // instant death if he stands on you so you can't cross under him
        }
    }
    
}
