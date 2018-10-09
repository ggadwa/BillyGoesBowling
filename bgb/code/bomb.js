import SpriteClass from '../../rpjs/engine/sprite.js';

export default class BombClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.BOMB_SPEED=7;
        
            // setup
            
        this.addImage('sprites/bomb');
        this.setCurrentImage('sprites/bomb');
        
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
        return(new BonbClass(this.game,x,y,this.data));
    }
    
    explode()
    {
        let cx,cy;
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y+Math.trunc(this.height*0.5);

        this.game.map.addParticle(cx,cy,32,128,0.8,0.1,8,0.015,'particles/explode_red',10,550);
        this.game.map.addParticle(cx,cy,24,104,0.7,0.1,6,0.008,'particles/explode_orange',8,540);
        this.game.map.addParticle(cx,cy,16,64,0.6,0.1,4,0.005,'particles/explode_yellow',6,530);
        this.game.soundList.playAtSprite('explode',this,this.game.map.getSpritePlayer());

        this.delete();
    }
    
    runAI()
    {
        let map=this.game.map;
        
        this.y+=this.BOMB_SPEED;
        
        if (this.game.map.liquidY!==-1) {
            if (this.y>=this.game.map.liquidY) {
                this.explode();
                return;
            }
        }

        if (map.checkCollision(this)) {
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            this.explode();
        }
    }
}
