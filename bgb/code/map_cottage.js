import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
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
    
    onMapStart() {
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
            this.sendMessageToGame('banner_set',{"title":"Princess Bowling Sensei's Cottage","map":null,"pin":-1});
            this.bannerHit=true;
        }
        
        // if space than jump to map
        // save the X/Y so we can restore when we exit
        if ((this.getInputStateBoolean(InputClass.BUTTON_A)) || (this.getInputStateBoolean(InputClass.BUTTON_B))) {
            this.setCurrentSaveSlotData('worldXPos',playerSprite.x);
            this.setCurrentSaveSlotData('worldYPos',playerSprite.y);
            this.game.gotoMap('won');
        }
    }
}
