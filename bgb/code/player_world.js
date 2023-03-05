import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
import MapClass from '../../rpjs/engine/map.js';

export default class PlayerWorldClass extends SpriteClass {

    static TILE_IDX_CROSS=47;
    static TILE_IDX_DOT=48;
    static TILE_IDX_ROAD_HORIZONTAL=44;
    static TILE_IDX_ROAD_VERTICAL=46;
    static TILE_IDX_ROAD_TOP_LEFT_CORNER=43;
    static TILE_IDX_ROAD_TOP_RIGHT_CORNER=45;
    static TILE_IDX_ROAD_BOTTOM_LEFT_CORNER=49;
    static TILE_IDX_ROAD_BOTTOM_RIGHT_CORNER=51;
    static TILE_IDX_BRIDGE_HORIZONTAL=39;
    static TILE_IDX_BRIDGE_VERTICAL=42;
    static TILE_IDX_GATE=53;
    static TILE_IDX_LEFT_T=55;
    static TILE_IDX_UP_T=56;
    static TILE_IDX_BRIDGE_CENTER=57;
    static WALK_FRAME_TICK=6;
    static SPEED=8;
        
    static WALK_ANIMATION=['sprites/billy_world_1','sprites/billy_world_2','sprites/billy_world_3','sprites/billy_world_2'];

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // setup
        this.addImage('sprites/billy_world_1');
        this.addImage('sprites/billy_world_2');
        this.addImage('sprites/billy_world_3');
        this.setCurrentImage('sprites/billy_world_1');
        
        this.show=true;
        
        this.moving=false;
        this.moveToX=0;
        this.moveToY=0;
        this.lastToX=0;
        this.lastToY=0;
        this.walkAnimationFrame=0;
        this.walkAnimationFrameCount=-1;
        
        Object.seal(this);
    }
    
    mapStartup() {
        this.drawOffsetX=Math.trunc((MapClass.MAP_TILE_SIZE-this.width)*0.5); // so world player draws in the center of tiles
    }
    
    isPlayer() {
        return(true);
    }
    
    getTileIdxWithOffset(xOff,yOff) {
        let tx,ty;
        let map=this.game.map;
        
        tx=Math.trunc((this.x+(this.width*0.5))/MapClass.MAP_TILE_SIZE)+xOff;
        ty=Math.trunc((this.y-(this.height*0.5))/MapClass.MAP_TILE_SIZE)+yOff;
        
        if ((tx<0) || (tx>=MapClass.MAP_TILE_WIDTH)) return(-1);
        if ((ty<0) || (ty>=MapClass.MAP_TILE_HEIGHT)) return(-1);
        
        return(map.tileData[(ty*MapClass.MAP_TILE_WIDTH)+tx]);
    }
    
    isTileIdxRoad(tileIdx) {
        if (tileIdx===PlayerWorldClass.TILE_IDX_CROSS) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_LEFT_T) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_UP_T) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_DOT) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_BRIDGE_CENTER) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_ROAD_HORIZONTAL) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_ROAD_VERTICAL) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_ROAD_TOP_LEFT_CORNER) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_ROAD_TOP_RIGHT_CORNER) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_ROAD_BOTTOM_LEFT_CORNER) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_ROAD_BOTTOM_RIGHT_CORNER) return(true);
        if (tileIdx===PlayerWorldClass.TILE_IDX_BRIDGE_HORIZONTAL) return(true);
        return(tileIdx===PlayerWorldClass.TILE_IDX_BRIDGE_VERTICAL);
    }
    
    hasRoadLeft() {
        let tileIdx=this.getTileIdxWithOffset(-1,0);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    hasRoadRight() {
        let tileIdx=this.getTileIdxWithOffset(1,0);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    hasRoadUp() {
        let tileIdx=this.getTileIdxWithOffset(0,-1);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    hasRoadDown() {
        let tileIdx=this.getTileIdxWithOffset(0,1);
        return(this.isTileIdxRoad(tileIdx));
    }
    
    onRun(tick) {
        let tileIdx,xDir,yDir;
        
        // when walking, we just update the animation frame,
        // when not walking, we animate until we hit 0 and stop
        this.walkAnimationFrameCount--;
        if (this.walkAnimationFrameCount<0) {
            this.walkAnimationFrameCount=PlayerWorldClass.WALK_FRAME_TICK;

            if (this.moving) {
                this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
            }
            else {
                if (this.walkAnimationFrame!==0) this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
            }
            this.setCurrentImage(PlayerWorldClass.WALK_ANIMATION[this.walkAnimationFrame]);
        }
        
        // input 
        if (!this.moving) {
            this.moveToX=this.lastToX=this.x;
            this.moveToY=this.lastToY=this.y;
            
            if (this.getInputStateIsNegative(InputClass.LEFT_STICK_X)) {
                if (this.hasRoadLeft()) this.moveToX=this.x-MapClass.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.getInputStateIsPositive(InputClass.LEFT_STICK_X)) {
                if (this.hasRoadRight()) this.moveToX=this.x+MapClass.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.getInputStateIsNegative(InputClass.LEFT_STICK_Y)) {
                if (this.hasRoadUp()) this.moveToY=this.y-MapClass.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.getInputStateIsPositive(InputClass.LEFT_STICK_Y)) {
                if (this.hasRoadDown()) this.moveToY=this.y+MapClass.MAP_TILE_SIZE;
                this.moving=true;
            }
            
            // change UI when we start moving
            if (this.moving) {
                this.sendMessageToGame('banner_clear',null);
            }
        }
        
        // movement
        if (!this.moving) return;
        
        xDir=this.moveToX-this.x;
        yDir=this.moveToY-this.y;
        
        if (this.x!==this.moveToX) this.x+=(Math.sign(xDir)*PlayerWorldClass.SPEED);
        if (this.y!==this.moveToY) this.y+=(Math.sign(yDir)*PlayerWorldClass.SPEED);
        
        // have we changed tiles?   
        if ((this.x!==this.moveToX) || (this.y!==this.moveToY)) return;
        
        // time to stop moving or change direction?
        tileIdx=this.getTileIdxWithOffset(0,0);
        
        switch (tileIdx) {
            
            case PlayerWorldClass.TILE_IDX_CROSS:
            case PlayerWorldClass.TILE_IDX_LEFT_T:
            case PlayerWorldClass.TILE_IDX_UP_T:
            case PlayerWorldClass.TILE_IDX_DOT:
            case PlayerWorldClass.TILE_IDX_BRIDGE_CENTER:
                this.moving=false;
                break;
                
            case PlayerWorldClass.TILE_IDX_GATE:        // gates bounce you back
                this.moveToX=this.lastToX;
                this.moveToY=this.lastToY;
                break;
                
            case PlayerWorldClass.TILE_IDX_ROAD_HORIZONTAL:
            case PlayerWorldClass.TILE_IDX_BRIDGE_HORIZONTAL:
                this.moveToX=this.x+(Math.sign(xDir)*MapClass.MAP_TILE_SIZE);
                break;
                
            case PlayerWorldClass.TILE_IDX_ROAD_VERTICAL:
            case PlayerWorldClass.TILE_IDX_BRIDGE_VERTICAL:
                this.moveToY=this.y+(Math.sign(yDir)*MapClass.MAP_TILE_SIZE);
                break;
            
            case PlayerWorldClass.TILE_IDX_ROAD_TOP_LEFT_CORNER:
                if (Math.sign(xDir)<0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y+MapClass.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x+MapClass.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case PlayerWorldClass.TILE_IDX_ROAD_TOP_RIGHT_CORNER:
                if (Math.sign(xDir)>0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y+MapClass.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x-MapClass.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case PlayerWorldClass.TILE_IDX_ROAD_BOTTOM_LEFT_CORNER:
                if (Math.sign(xDir)<0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y-MapClass.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x+MapClass.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case PlayerWorldClass.TILE_IDX_ROAD_BOTTOM_RIGHT_CORNER:
                if (Math.sign(xDir)>0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y-MapClass.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x-MapClass.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
        }
    }
}
