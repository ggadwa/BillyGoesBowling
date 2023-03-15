import OverlayClass from '../../rpjs/engine/overlay.js';

export default class OverlayDefsClass {
        
    static SUN_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:0,
        xFactor:0.0,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        imageName:'backgrounds/sun'
    };
    
    static CLOUD_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:240,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        imageName:'backgrounds/clouds'
    };
    
    static MOVING_CLOUD_UPPER_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:240,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:-0.4,
        yScroll:0.0,
        imageName:'backgrounds/clouds'
    };
    
    static MOVING_CLOUD_LOWER_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:400,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:0.2,
        yScroll:0.0,
        imageName:'backgrounds/clouds'
    };
    
    static MOUNTAIN_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:340,
        xFactor:0.6,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        imageName:'backgrounds/mountains'
    };
    
    static CASTLE_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:340,
        xFactor:0.6,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        imageName:'backgrounds/castle'
    };
    
    static MINE_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_TILE,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:0,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        imageName:'backgrounds/cave'
    };
    
    static MINE_FOREGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_TILE,
        layer:OverlayClass.FOREGROUND_LAYER,
        yOffset:0,
        xFactor:0.0,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        imageName:'backgrounds/spotlight'
    };
    
    static WORLD_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_TILE,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:0,
        xFactor:1.0,
        yFactor:1.0,
        xScroll:0.3,
        yScroll:0.2,
        imageName:'backgrounds/water'
    };

}
