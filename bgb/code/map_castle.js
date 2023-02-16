import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapCastleClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_castle');
        this.addImage('sprites/world_map_castle_locked');
        this.addImage('sprites/world_map_castle_wreck');
        this.setCurrentImage('sprites/world_map_castle');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.layer=this.BACKGROUND_LAYER; // drawn in background

        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new MapCastleClass(this.game,x,y,this.data));
    }
    
    isUnlocked() {
        return((parseInt(this.getData('pin'))<=parseInt(this.game.getData('pins')))||(this.game.isUnlocked()));
    }
    
    mapStartup() {
        if (this.game.getData('boss_'+this.getData('map'))!==null) {
            this.setCurrentImage('sprites/world_map_castle_wreck');
                    
            // if just defeated, explode
            if (this.game.getData('boss_explode_'+this.getData('map'))) {
                this.game.deleteData('boss_explode_'+this.getData('map'));      // only happens once
                this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),10,10,1.0,0.1,5,0.04,'particles/castle',40,0.5,false,1500);
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
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // are we colliding with player?
        if (!playerSprite.collide(this)) return;
            
        // change UI
        this.game.setBanner(this.getData('title'),this.getData('map'),this.getData('pin'));
        
        // if space than jump to map
        // save the X/Y so we can restore when we exit
        if (this.game.input.isKeyDown("Space")) {
            if (!this.isUnlocked()) {
                this.playSoundGlobal('locked_castle');
            }
            else {
                this.game.setData('worldXPos',playerSprite.x);
                this.game.setData('worldYPos',playerSprite.y);
                this.game.gotoMap(this.getData('map'));
            }
        }
    }
}
