import MapClass from '../../rpjs/engine/map.js';
import PlayerWorldClass from '../code/player_world.js';

export default class WorldBaseMapClass extends MapClass
{
    constructor(game)
    {
        super(game);
        
        this.TILE_IDX_ROAD_VERTICAL=46;
        this.TILE_IDX_ROAD_HORIZONTAL=44;

        this.currentMapY=0;
    }
    
    calcOffset()
    {
        let sprite;
        let offX,offY;
        let wid=this.game.canvasWidth;
        let rgt=this.game.map.width-wid;
        let high=this.game.canvasHeight;
        let bot=this.game.map.height-high;
        
            // the offset tries to center on the player
            
        sprite=this.sprites[this.playerIdx];
        
        offX=sprite.x-Math.trunc(wid*0.5);
        if (offX<0) offX=0;
        if (offX>rgt) offX=rgt;
        
        this.offsetX=offX;
        
        offY=sprite.y-Math.trunc(high*0.5);
        if (offY<0) offY=0;
        if (offY>bot) offY=bot;
        
        this.offsetY=offY;
    }
    
    mapStartup()
    {
        let x,y,playerSprite;
        
        this.game.setData('player_health',4);   // world map resets health
        
            // background
            
        this.addTileBackground(this.game.imageList.get('backgrounds/water'),1.0,1.0,0.01,0.005);
        
            // music
            
        this.game.musicList.start('world');
        
            // spots record where the player went into a map
            // so we can reset position coming out
            
        x=this.game.getData('worldXPos');
        y=this.game.getData('worldYPos');
        if ((x===null) || (y===null)) return;
        
        playerSprite=this.getSpritePlayer();
        playerSprite.x=x;
        playerSprite.y=y;
    }
}
