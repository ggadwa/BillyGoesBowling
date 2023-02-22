import MapClass from '../../rpjs/engine/map.js';
import SideScrollBaseMapClass from '../maps/side_scroll_base.js';

export default class SideScrollNormalBaseMapClass extends SideScrollBaseMapClass {
 
    mapStartup() {
        super.mapStartup();
        
        // the backgrounds
        this.addParallaxBackground(this.game.imageList.get('backgrounds/sun'),0,0.0);
        this.addParallaxBackground(this.game.imageList.get('backgrounds/clouds'),(this.game.canvasHeight-400),0.4);
        this.addParallaxBackground(this.game.imageList.get('backgrounds/mountains'),(this.game.canvasHeight-300),0.6);
        
        // reset Y position based on the player sprite
        this.resetOffsetY();
        
        // music
        this.game.musicList.start('map');
    }

}
    