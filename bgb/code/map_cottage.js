import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerWorldClass from './player_world.js';

export default class MapCottageClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_cottage');
        this.setCurrentImage('sprites/world_map_cottage');
        
        this.bannerHit=false;
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.layer=this.BACKGROUND_LAYER; // drawn in background

        Object.seal(this);
    }
    
    mapStartup() {
        // only send banner message once
        this.bannerHit=false;
    }
        
    onRun(tick) {
        let n,cx,cy;
        let playerSprite=this.getPlayerSprite();
        
        // are we colliding with player?
        if (!playerSprite.collide(this)) {
            this.bannerHit=false;
            return;
        }
        
        // trigger the win banner and fireworks
        if (!this.bannerHit) {
            this.sendMessageToGame('banner_set',{"title":null,"map":null,"pin":this.getData('pin')});
            this.bannerHit=true;
        
            // fireworks
            for (n=0;n!==10;n++) {
                cx=this.x+((100+Math.trunc(Math.random()*150))*((Math.random()>0.5)?-1:1));
                cy=this.y+((100+Math.trunc(Math.random()*150))*((Math.random()>0.5)?-1:1));

                this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,32,128,0.8,0.1,8,0.015,'particles/explode_red',10,0.4,false,550);
                this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,10,10,1.0,0.1,5,0.06,'particles/block',40,0.4,false,1500);
            }

            this.playSoundGlobal('pickup');
        }
    }
}
