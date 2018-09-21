import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import BombClass from './bomb.js';

export default class RotoCarrotClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.CARROT_SPEED=12;
        this.CARROT_Y_ARC=30;
        this.CARROT_PAUSE_TICK=20;
        this.CARROT_ARC_TICK=50;
        this.BOMB_DROP_TICK=100;
        
            // variables
            
        this.addImage('sprites/roto_carrot');
        this.setCurrentImage('sprites/roto_carrot');
        this.setEditorImage('sprites/roto_carrot');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.originalY=0;
        this.bombTick=0;
        this.carrotPause=0;
        this.carrotArc=0;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new RotoCarrotClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.originalY=this.y;
        this.bombTick=this.BOMB_DROP_TICK;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),64,128,0.8,0.01,0,0,this.game.imageList.get('particles/skull'),1,500);
            this.delete();
        }
    }
    
    dropBomb()
    {
        let sx,sy;
        
        sx=this.x+(Math.trunc(this.width*0.5)-16);
        sy=this.y+35;

        this.game.map.addSprite(new BombClass(this.game,sx,sy,null));
    }

    runAI()
    {
        let rad;
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // is carrot paused?
            
        if (this.carrotPause>0) {
            this.carrotPause--;
            return;
        }
        
            // always travel left to right
            
        this.x-=this.CARROT_SPEED;
        if (this.x<(-this.width)) this.x=map.rightEdge;
        
            // Y goes in a cos wave
            
        this.carrotArc++;
        
        rad=((this.carrotArc%this.CARROT_ARC_TICK)*(2*Math.PI))/this.CARROT_ARC_TICK;
        this.y=this.originalY+Math.trunc(Math.cos(rad)*this.CARROT_Y_ARC);
        
            // check for collisions to hurt player
            // but always go through objects
        
        if (map.checkCollision(this)) {
            if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
        }
        
            // drop bomb at specific intervals,
        
        if (this.bombTick>0) {
            this.bombTick--;
            return;
        }
        
        this.carrotPause=this.CARROT_PAUSE_TICK;
        this.bombTick=this.BOMB_DROP_TICK;
        this.dropBomb();
    }
}
