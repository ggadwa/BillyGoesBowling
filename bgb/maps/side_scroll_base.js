import MapClass from '../../rpjs/engine/map.js';
import PlayerSideScrollClass from '../code/player_sidescroll.js';

export default class SideScrollBaseMapClass extends MapClass
{
    constructor(game)
    {
        super(game);
        
        this.PLAYER_NATURAL_MAP_HEIGHT_OFFSET=0.7;

        this.currentMapY=0;
        this.forceCameraSprite=null;
    }
    
    calcOffset()
    {
        let sprite;
        let offX,offY,playerY;
        let wid=this.game.canvasWidth;
        let rgt=this.game.map.width-wid;
        let high=this.game.canvasHeight;
        let bot=this.game.map.height-high;
        
            // get sprite to focus camera on
           
        if (this.forceCameraSprite===null) {
            sprite=this.sprites[this.playerIdx];
        }
        else {
            sprite=this.forceCameraSprite;
        }
        
            // the X offset follows the sprite
            
        offX=sprite.x-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        this.offsetX=offX;
        
            // we only change the current
            // map Y if the sprite gets too close to edges
            
        playerY=sprite.y-(sprite.height*2);
        if (playerY<this.currentMapY) this.currentMapY=playerY;
        
        playerY=sprite.y-Math.trunc(high*this.PLAYER_NATURAL_MAP_HEIGHT_OFFSET);
        if (playerY>this.currentMapY) this.currentMapY=playerY;
        
        offY=this.currentMapY;
        if (offY<0) offY=0;
        if (offY>bot) offY=bot;
        
        this.offsetY=offY;
    }
    
    resetOffsetY()
    {
        let sprite=this.sprites[this.playerIdx];
        this.currentMapY=sprite.y-Math.trunc(this.game.canvasHeight*this.PLAYER_NATURAL_MAP_HEIGHT_OFFSET);
        
        this.forceCameraSprite=null;
    }

    
}
