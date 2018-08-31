import MapClass from '../engine/map.js';
import PlayerSideScrollClass from '../code/player_sidescroll.js';

export default class SideScrollBaseMapClass extends MapClass
{
    constructor(game)
    {
        super(game);
        
        this.PLAYER_NATURAL_MAP_HEIGHT_OFFSET=0.7;

        this.currentMapY=0;
    }
    
    calcOffset()
    {
        let sprite;
        let offX,offY,playerY,playerDoubleHigh;
        let wid=this.game.canvasWidth;
        let rgt=this.game.map.width-wid;
        let high=this.game.canvasHeight;
        let bot=this.game.map.height-high;
        
            // the X offset follows the player
            
        sprite=this.sprites[this.playerIdx];
        offX=sprite.x-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        this.offsetX=offX;
        
            // we only change the current
            // map Y if the player gets too close to edges
          
        playerY=sprite.y-Math.trunc(high*this.PLAYER_NATURAL_MAP_HEIGHT_OFFSET);
        playerDoubleHigh=sprite.height*2;
        
        if ((playerY-sprite.height)<(this.currentMapY-(high-playerDoubleHigh))) this.currentMapY-=10;
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
    }

    mapStartup()
    {
            // starting a side scrolling map resets the health
            
        this.game.setData('player_health',4);

        this.resetOffsetY();
    }
    
}
