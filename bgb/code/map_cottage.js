import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapCottageClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_cottage');
        this.setCurrentImage('sprites/world_map_cottage');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.layer=this.BACKGROUND_LAYER; // drawn in background
        
        this.canFireParticles=true;

        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new MapCottageClass(this.game,x,y,this.data));
    }
        
    runAI()
    {
        let n,cx,cy;
        let playerSprite=this.game.map.getSpritePlayer();
        
            // are we colliding with player?
            
        if (!playerSprite.collide(this)) {
            this.canFireParticles=true;
            return;
        }
        
            // trigger the win banner
            
        this.game.setBanner(null,this.getData('pin'));
        
            // if we just landed here, we can fire
            // random particles
            
        if (!this.canFireParticles) return;
        
        this.canFireParticles=false;
        
        for (n=0;n!==10;n++) {
            cx=this.x+((100+Math.trunc(Math.random()*150))*((Math.random()>0.5)?-1:1));
            cy=this.y+((100+Math.trunc(Math.random()*150))*((Math.random()>0.5)?-1:1));

            this.game.map.addParticle(cx,cy,32,128,0.8,0.1,8,0.015,'particles/explode_red',10,0.4,false,550);
            this.game.map.addParticle(cx,cy,10,10,1.0,0.1,5,0.06,'particles/block',40,0.4,false,1500);
        }
        
        this.game.soundList.play('pickup');
    }
}
