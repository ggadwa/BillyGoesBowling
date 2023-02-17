import MapClass from '../../rpjs/engine/map.js';
import SideScrollBaseMapClass from '../maps/side_scroll_base.js';

export default class SideScrollCastleBaseMapClass extends SideScrollBaseMapClass {

    mapStartup() {
        super.mapStartup();
        
        // the backgrounds
        this.addParallaxBackground(this.game.imageList.get('backgrounds/sun'),0,0.0);
        this.addParallaxBackground(this.game.imageList.get('backgrounds/clouds'),(this.game.canvasHeight-400),0.4);
        this.addParallaxBackground(this.game.imageList.get('backgrounds/castle'),(this.game.canvasHeight-300),0.6);
        
        // default liquid color
        this.liquidWaveHeight=10;
        this.liquidRTintFactor=1.0;
        this.liquidGTintFactor=0.2;
        this.liquidBTintFactor=0.2;
        
        this.resetOffsetY();
        
        // music
        this.game.musicList.start('boss');
    }

}
