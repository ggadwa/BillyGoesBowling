import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import InputClass from '../../rpjs/engine/input.js';
import PlayerWorldClass from './player_world.js';

export default class MapCastleClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_castle');
        this.addImage('sprites/world_map_castle_locked');
        this.addImage('sprites/world_map_castle_wreck');
        this.setCurrentImage('sprites/world_map_castle');
        
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
    
    isUnlocked() {
        return((parseInt(this.getData('pin'))<=parseInt(this.game.getGameDataCountForPrefix('pin_')))||(this.game.isUnlocked()));
    }
    
    onMapStart() {
        if (this.game.getData('boss_'+this.getData('map'))!==null) {
            this.setCurrentImage('sprites/world_map_castle_wreck');
                    
            // if just defeated, explode
            if (this.game.getData('boss_explode_'+this.getData('map'))) {
                this.game.deleteData('boss_explode_'+this.getData('map'));      // only happens once
                this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),ParticleDefsClass.CASTLE_BREAK_PARTICLE);
                this.playSoundGlobal('explode');
            }

        }
        else {
            if (this.isUnlocked()) {
                this.setCurrentImage('sprites/world_map_castle');
            }
            else {
                this.setCurrentImage('sprites/world_map_castle_locked');
            }
        }
        
        // only send banner message once
        this.bannerHit=false;
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        if (!playerSprite.collide(this)) {
            this.bannerHit=false;
            return;
        }
            
        // change UI
        if (!this.bannerHit) {
            this.sendMessageToGame('banner_set',{"title":this.getData('title'),"map":this.getData('map'),"pin":this.getData('pin')});
            this.bannerHit=true;
        }
        
        // if space than jump to map
        // save the X/Y so we can restore when we exit
        if ((this.getInputStateBoolean(InputClass.BUTTON_A)) || (this.getInputStateBoolean(InputClass.BUTTON_B))) {
            if (!this.isUnlocked()) {
                this.playSoundGlobal('locked_castle');
            }
            else {
                this.setGameData('worldXPos',playerSprite.x);
                this.setGameData('worldYPos',playerSprite.y);
                this.game.gotoMap(this.getData('map'));
            }
        }
    }
}
