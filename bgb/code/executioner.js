import SpriteClass from '../../rpjs/engine/sprite.js';
import GrayFilterClass from '../../rpjs/filters/gray.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import AxeClass from './axe.js';

export default class ExecutionerClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.TILE_IDX_BUMP=18;
        this.MAX_SPEED=8;
        this.JUMP_HEIGHT=-40;
        
            // variables
            
        this.executionerSpeed=0;
        this.lastLaunchXPosition=-1;
        this.launchXPositionsLeft=null;     // array of axe launch positions, loaded on startup
        this.launchXPositionsRight=null;
        this.isDropping=true;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.launchLeft=true;
        this.launchPos=null;
        
            // setup
        
        this.addImage('sprites/executioner_1');
        this.addImage('sprites/executioner_2');
        this.setCurrentImage('sprites/executioner_1');
        
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
        return(new ExecutionerClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.launchXPositionsLeft=this.data.get('axe_x_launch_left');
        this.launchXPositionsRight=this.data.get('axe_x_launch_right');
        this.lastLaunchXPosition=-1;
        this.isDropping=true;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.launchLeft=true;
        this.launchPos=this.launchXPositionsLeft.slice();
    }
    
    fireAxe()
    {
        let n,ex,launchX,sx,sy;
        
            // time to switch to other list?
            
        if (this.launchPos.length===0) {
            this.launchPos=this.launchLeft?this.launchXPositionsRight.slice():this.launchXPositionsLeft.slice();
            this.launchLeft=!this.launchLeft;
        }
        
            // are we at the next launch position
            
        ex=Math.trunc((this.x+Math.trunc(this.width*0.5))/this.game.map.MAP_TILE_SIZE);
        
        for (n=0;n!=this.launchPos.length;n++) {
            launchX=this.launchPos[n];
            
            if (ex===launchX) {
                
                    // only fire one at a time
                    
                this.launchPos.splice(n,1);
                
                    // fire
                    
                sx=(launchX*this.game.map.MAP_TILE_SIZE)+Math.trunc(this.game.map.MAP_TILE_SIZE*0.5);
                sy=this.y-Math.trunc(this.height*0.5);

                this.game.map.addSprite(new AxeClass(this.game,sx,sy,null));
                
                this.game.soundList.playAtSprite('jump',this,this.game.map.getSpritePlayer());
                return;
            }
        }
    }
    
    runAI()
    {
        let map=this.game.map;
        let speed,bumpUp;
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
        else {
            if (!this.grounded) {
                this.inAir=true;
            }
            else {
                if (this.inAir) {
                    this.inAir=false;
                    map.shake(3);
                    this.game.soundList.play('thud');
                }
            }
        }
        
            // dead, do nothig
            
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
            // image
            
        if ((Math.trunc(this.game.timestamp/200)&0x1)===0) {
            this.setCurrentImage('sprites/executioner_1');
        }
        else {
            this.setCurrentImage('sprites/executioner_2');
        }
        
            // always follow the player, but with
            // an acceleration
            
        if ((playerSprite.x+Math.trunc(playerSprite.width*0.5))<(this.x+Math.trunc(this.width*0.5))) {
            if (this.executionerSpeed>-this.MAX_SPEED) {
                this.executionerSpeed-=0.5;
            }
            else {
                this.executionerSpeed=-this.MAX_SPEED;
            }
        }
        else {
            if (this.executionerSpeed<this.MAX_SPEED) {
                this.executionerSpeed+=0.5;
            }
            else {
                this.executionerSpeed=this.MAX_SPEED;
            }
        }
        
            // we need to bump up at collisions to get the
            // executioner can get out of holes he's digging
        
        speed=Math.trunc(this.executionerSpeed);
        this.x+=speed;
        
        if (map.checkCollision(this)) {
            this.x-=speed;

                // run collisions

            bumpUp=false;

            if (this.collideSprite!==null) {
                if (this.collideSprite instanceof BreakBlockStrongClass) bumpUp=true;
                this.collideSprite.interactWithSprite(this,null);
             }

                // only check for bumping if we are in the air, otherwise
                // just complete the jump

            if (this.grounded) {
                bumpUp=bumpUp||(this.collideTileIdx===this.TILE_IDX_BUMP);
                if (bumpUp) this.motion.y=this.JUMP_HEIGHT;
            }
        }
        
            // time to fire axe?

        this.fireAxe();
        
            // hit the liquid?
            
        if (this.y>=map.liquidY) {
            playerSprite.warpOut();
            this.isDead=true;
            this.gravityFactor=0.0;
            this.drawFilter=this.grayDrawFilter;
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,2500);
            this.game.soundList.play('boss_dead');
            
            this.game.setData(('boss_'+map.name),true);
            this.game.setData(('boss_explode_'+map.name),true);
            this.game.persistData();
            
            map.forceCameraSprite=this;
        }
    }
    
}
