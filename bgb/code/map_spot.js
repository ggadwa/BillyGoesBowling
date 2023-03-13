import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
import PlayerWorldClass from './player_world.js';

export default class MapSpotClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_spot_red');
        this.addImage('sprites/world_map_spot_yellow');
        this.addImage('sprites/world_map_spot_green');
        this.setCurrentImage('sprites/world_map_spot_red');
        
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
    
    onMapStart() {
        let hasPin=(this.game.getData('pin_'+this.getData('map'))!==null);
        let hasTrophy=(this.game.getData('trophy_'+this.getData('map'))!==null);
        
        // change image based on if the player has collected the
        // pin and/or the trophy
        if ((hasPin) && (hasTrophy)) {
            this.setCurrentImage('sprites/world_map_spot_green');
            return;
        }
        
        if (hasPin) this.setCurrentImage('sprites/world_map_spot_yellow');
        
        // only send banner message once
        this.bannerHit=false;
    }

    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // are we colliding with player?
        if (!playerSprite.collide(this)) {
            this.bannerHit=false;
            return;
        }
            
        // change UI
        if (!this.bannerHit) {
            this.sendMessageToGame('banner_set',{"title":this.getData('title'),"map":this.getData('map'),"pin":-1});
            this.bannerHit=true;
        }
        
        // if space than jump to map
        // save the X/Y so we can restore when we exit
        if ((this.getInputStateBoolean(InputClass.BUTTON_A)) || (this.getInputStateBoolean(InputClass.BUTTON_B))) {
            this.setGameData('worldXPos',playerSprite.x);
            this.setGameData('worldYPos',playerSprite.y);
            this.game.gotoMap(this.getData('map'));
        }
    }

}
