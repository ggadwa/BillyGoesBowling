import SpriteClass from '../engine/sprite.js';
import BallClass from '../code/ball.js';
import CloudBlockClass from './cloud_block.js';

export default class PlayerWorldClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.MOVE_NONE=-1;
        this.MOVE_LEFT=0;
        this.MOVE_RIGHT=1;
        this.MOVE_UP=2;
        this.MOVE_DOWN=3;
        
            // setup
            
        this.addImage('sprites/billy_world');
        this.setCurrentImage('sprites/billy_world');
        this.setEditorImage('sprites/billy_world');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.drawOffsetX=Math.trunc((this.game.map.MAP_TILE_SIZE-this.width)*0.5);        // so world player draws in the center of tiles
        
        this.move=this.MOVE_NONE;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PlayerWorldClass(this.game,x,y,this.data));
    }
    
    isPlayer()
    {
        return(true);
    }
    
    getTileIdxWithOffset(xOff,yOff)
    {
        let tx,ty;
        let map=this.game.map;
        
        tx=Math.trunc((this.x+(this.width*0.5))/map.MAP_TILE_SIZE)+xOff;
        ty=Math.trunc((this.y-(this.height*0.5))/map.MAP_TILE_SIZE)+yOff;
        
        if ((tx<0) || (tx>=map.MAP_TILE_WIDTH)) return(-1);
        if ((ty<0) || (ty>=map.MAP_TILE_HEIGHT)) return(-1);
        
        console.log(tx+','+ty+'='+map.tileData[(ty*map.MAP_TILE_WIDTH)+tx]);
        
        
        return(map.tileData[(ty*map.MAP_TILE_WIDTH)+tx]);
    }
    
    isTileIdxRoad(tileIdx)
    {
        return(((tileIdx>=34) && (tileIdx<=40)) || (tileIdx===42));
    }
    
    hasRoadLeft()
    {
        let tileIdx=this.getTileIdxWithOffset(-1,0);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    hasRoadRight()
    {
        let tileIdx=this.getTileIdxWithOffset(1,0);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    hasRoadUp()
    {
        let tileIdx=this.getTileIdxWithOffset(0,-1);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    hasRoadDown()
    {
        let tileIdx=this.getTileIdxWithOffset(0,1);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    runAI()
    {
        let tileIdx,oldTileX,oldTileY;
        let map=this.game.map;
        
            // input
            
        if (this.game.input.isLeft()) {
            if (this.hasRoadLeft()) this.move=this.MOVE_LEFT;
        }
        
        if (this.game.input.isRight()) {
            if (this.hasRoadRight()) this.move=this.MOVE_RIGHT;
        }
        
        if (this.game.input.isUp()) {
            if (this.hasRoadUp()) this.move=this.MOVE_UP;
        }
        
        if (this.game.input.isDown()) {
            if (this.hasRoadDown()) this.move=this.MOVE_DOWN;
        }
        
            // movement
            
        if (this.move===this.MOVE_NONE) return;
        
        oldTileX=Math.trunc((this.x+(this.width*0.5))/map.MAP_TILE_SIZE);
        oldTileY=Math.trunc((this.y-(this.height*0.5))/map.MAP_TILE_SIZE);

        switch (this.move) {
            case this.MOVE_LEFT:
                this.x-=4;
                break;
            case this.MOVE_RIGHT:
                this.x+=4;
                break;
            case this.MOVE_UP:
                this.y-=4;
                break;
            case this.MOVE_DOWN:
                this.y+=4;
                break;
        }
        
            // if we are on same tile, then exit
            
        if ((oldTileX===Math.trunc((this.x+(this.width*0.5))/map.MAP_TILE_SIZE)) && (oldTileY===Math.trunc((this.y-(this.height*0.5))/map.MAP_TILE_SIZE))) return;
        
            // time to stop moving or change direction?
            
        tileIdx=this.getTileIdxWithOffset(0,0);
        
        switch (tileIdx) {
            case 38:
            case 39:
                this.move=this.MOVE_NONE;           // cross or dot place
                break;
            case 34:
                this.move=(this.move===this.MOVE_LEFT)?this.MOVE_DOWN:this.MOVE_RIGHT;   // top left corner
                break;
            case 36:
                this.move=(this.move===this.MOVE_RIGHT)?this.MOVE_DOWN:this.MOVE_LEFT;   // top right corner
                break;
            case 40:
                this.move=(this.move===this.MOVE_LEFT)?this.MOVE_UP:this.MOVE_RIGHT;   // bottom left corner
                break;
            case 42:
                this.move=(this.move===this.MOVE_RIGHT)?this.MOVE_UP:this.MOVE_LEFT;   // bottom right corner
                break;
        }
    }
}
