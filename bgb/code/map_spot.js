import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapSpotClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_spot_red');
        this.addImage('sprites/world_map_spot_yellow');
        this.addImage('sprites/world_map_spot_green');
        this.setCurrentImage('sprites/world_map_spot_red');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.background=true;           // a background sprite, draws in the same plane as the map

        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new MapSpotClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        let hasPin=(this.game.getData('pin_'+this.getData('map'))!==null);
        let hasTrophy=(this.game.getData('trophy_'+this.getData('map'))!==null);
        
        // change image based on if the player has collected the
        // pin and/or the trophy
        if ((hasPin) && (hasTrophy)) {
            this.setCurrentImage('sprites/world_map_spot_green');
            return;
        }
        
        if (hasPin) this.setCurrentImage('sprites/world_map_spot_yellow');
    }

    runAI() {
        let playerSprite=this.game.map.getSpritePlayer();
        
        // are we colliding with player?
        if (!playerSprite.collide(this)) return;
            
        // change UI
        this.game.setBanner(this.getData('title'),-1);
        
        // if space than jump to map
        // save the X/Y so we can restore when we exit
        if (this.game.input.isKeyDown("Space")) {
            this.game.setData('worldXPos',playerSprite.x);
            this.game.setData('worldYPos',playerSprite.y);
            this.game.gotoMap(this.getData('map'));
        }
    }

}
