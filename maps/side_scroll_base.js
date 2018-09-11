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
        let offX,offY,playerY;
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
    }

    mapStartup()
    {
            // the backgrounds
            
        this.addParallaxBackground(this.game.imageList.get('backgrounds/sun'),0,0.0);
        this.addParallaxBackground(this.game.imageList.get('backgrounds/clouds'),(this.game.canvasHeight-400),0.4);
        this.addParallaxBackground(this.game.imageList.get('backgrounds/mountains'),(this.game.canvasHeight-300),0.6);
        
            // reset the player health and Y position based
            // only the player sprite
            
        this.game.setData('player_health',4);
        this.resetOffsetY();
    }
    
}
