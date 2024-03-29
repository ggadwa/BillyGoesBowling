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
        alpha:1.0,
        imageName:'overlays/sun'
    };
    
    static CLOUD_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:240,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        alpha:1.0,
        imageName:'overlays/clouds'
    };
    
    static MOVING_CLOUD_UPPER_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:240,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:-0.4,
        yScroll:0.0,
        alpha:1.0,
        imageName:'overlays/clouds'
    };
    
    static MOVING_CLOUD_LOWER_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:400,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:0.2,
        yScroll:0.0,
        alpha:1.0,
        imageName:'overlays/clouds'
    };
    
    static MOUNTAIN_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:340,
        xFactor:0.6,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        alpha:1.0,
        imageName:'overlays/mountains'
    };
    
    static CASTLE_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_PARALLAX,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:340,
        xFactor:0.6,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        alpha:1.0,
        imageName:'overlays/castle'
    };
    
    static MINE_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_TILE,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:0,
        xFactor:0.4,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        alpha:1.0,
        imageName:'overlays/cave'
    };
    
    static MINE_FOREGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_TILE,
        layer:OverlayClass.FOREGROUND_LAYER,
        yOffset:0,
        xFactor:0.0,
        yFactor:0.0,
        xScroll:0.0,
        yScroll:0.0,
        alpha:0.97,
        imageName:'overlays/spotlight'
    };
    
    static WORLD_BACKGROUND_OVERLAY={
        overlayType:OverlayClass.TYPE_TILE,
        layer:OverlayClass.BACKGROUND_LAYER,
        yOffset:0,
        xFactor:1.0,
        yFactor:1.0,
        xScroll:0.3,
        yScroll:0.2,
        alpha:1.0,
        imageName:'overlays/water'
    };

}
