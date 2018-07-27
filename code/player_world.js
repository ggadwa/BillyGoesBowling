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
        
        this.moving=false;
        this.moveToX=0;
        this.moveToY=0;
        
        Object.seal(this);
    }
    
    mapStartup()
    {
        this.drawOffsetX=Math.trunc((this.game.map.MAP_TILE_SIZE-this.width)*0.5);        // so world player draws in the center of tiles
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
        
        return(map.tileData[(ty*map.MAP_TILE_WIDTH)+tx]);
    }
    
    isTileIdxRoad(tileIdx)
    {
        return(((tileIdx>=34) && (tileIdx<=40)) || (tileIdx===42) || (tileIdx===30) || (tileIdx===33));
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
        let tileIdx,xDir,yDir;
        let map=this.game.map;
        
            // input
            
        if (!this.moving) {
            this.moveToX=this.x;
            this.moveToY=this.y;
            
            if (this.game.input.isLeft()) {
                if (this.hasRoadLeft()) this.moveToX=this.x-map.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.game.input.isRight()) {
                if (this.hasRoadRight()) this.moveToX=this.x+map.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.game.input.isUp()) {
                if (this.hasRoadUp()) this.moveToY=this.y-map.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.game.input.isDown()) {
                if (this.hasRoadDown()) this.moveToY=this.y+map.MAP_TILE_SIZE;
                this.moving=true;
            }
        }
        
            // movement
            
        if (!this.moving) return;
        
        xDir=this.moveToX-this.x;
        yDir=this.moveToY-this.y;
        
        if (this.x!==this.moveToX) this.x+=(Math.sign(xDir)*16);
        if (this.y!==this.moveToY) this.y+=(Math.sign(yDir)*16);
        
            // have we changed tiles?
            
        if ((this.x!==this.moveToX) || (this.y!==this.moveToY)) return;
        
            // time to stop moving or change direction?
            
        tileIdx=this.getTileIdxWithOffset(0,0);
        
        switch (tileIdx) {
            
            case 38:        // cross and dots
            case 39:
                this.moving=false;
                break;
                
            case 35:    // horizontal
            case 30:
                this.moveToX=this.x+(Math.sign(xDir)*map.MAP_TILE_SIZE);
                break;
                
            case 37:    // vertical
            case 33:
                this.moveToY=this.y+(Math.sign(yDir)*map.MAP_TILE_SIZE);
                break;
            
            case 34:   // top left corner
                if (Math.sign(xDir)<0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y+map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x+map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case 36:   // top right corner
                if (Math.sign(xDir)>0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y+map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x-map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case 40:   // bottom left corner
                if (Math.sign(xDir)<0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y-map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x+map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case 42:   // bottom right corner
                if (Math.sign(xDir)>0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y-map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x-map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
        }
    }
}
