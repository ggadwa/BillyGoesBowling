import SpriteClass from '../../rpjs/engine/sprite.js';

export default class PlayerWorldClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants 
        this.TILE_IDX_CROSS=47;
        this.TILE_IDX_DOT=48;
        this.TILE_IDX_ROAD_HORIZONTAL=44;
        this.TILE_IDX_ROAD_VERTICAL=46;
        this.TILE_IDX_ROAD_TOP_LEFT_CORNER=43;
        this.TILE_IDX_ROAD_TOP_RIGHT_CORNER=45;
        this.TILE_IDX_ROAD_BOTTOM_LEFT_CORNER=49;
        this.TILE_IDX_ROAD_BOTTOM_RIGHT_CORNER=51;
        this.TILE_IDX_BRIDGE_HORIZONTAL=39;
        this.TILE_IDX_BRIDGE_VERTICAL=42;
        this.TILE_IDX_GATE=53;
        this.TILE_IDX_LEFT_T=55;
        this.TILE_IDX_UP_T=56;
        this.TILE_IDX_BRIDGE_CENTER=57;
        this.WALK_FRAME_TICK=3;
        
        this.WALK_ANIMATION=['sprites/billy_world_1','sprites/billy_world_2','sprites/billy_world_3','sprites/billy_world_2'];
        
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
        this.drawOffsetX=Math.trunc((this.game.map.MAP_TILE_SIZE-this.width)*0.5); // so world player draws in the center of tiles
    }
    
    duplicate(x,y) {
        return(new PlayerWorldClass(this.game,x,y,this.data));
    }
    
    isPlayer() {
        return(true);
    }
    
    getTileIdxWithOffset(xOff,yOff) {
        let tx,ty;
        let map=this.game.map;
        
        tx=Math.trunc((this.x+(this.width*0.5))/map.MAP_TILE_SIZE)+xOff;
        ty=Math.trunc((this.y-(this.height*0.5))/map.MAP_TILE_SIZE)+yOff;
        
        if ((tx<0) || (tx>=map.MAP_TILE_WIDTH)) return(-1);
        if ((ty<0) || (ty>=map.MAP_TILE_HEIGHT)) return(-1);
        
        return(map.tileData[(ty*map.MAP_TILE_WIDTH)+tx]);
    }
    
    isTileIdxRoad(tileIdx) {
        if (tileIdx===this.TILE_IDX_CROSS) return(true);
        if (tileIdx===this.TILE_IDX_LEFT_T) return(true);
        if (tileIdx===this.TILE_IDX_UP_T) return(true);
        if (tileIdx===this.TILE_IDX_DOT) return(true);
        if (tileIdx===this.TILE_IDX_BRIDGE_CENTER) return(true);
        if (tileIdx===this.TILE_IDX_ROAD_HORIZONTAL) return(true);
        if (tileIdx===this.TILE_IDX_ROAD_VERTICAL) return(true);
        if (tileIdx===this.TILE_IDX_ROAD_TOP_LEFT_CORNER) return(true);
        if (tileIdx===this.TILE_IDX_ROAD_TOP_RIGHT_CORNER) return(true);
        if (tileIdx===this.TILE_IDX_ROAD_BOTTOM_LEFT_CORNER) return(true);
        if (tileIdx===this.TILE_IDX_ROAD_BOTTOM_RIGHT_CORNER) return(true);
        if (tileIdx===this.TILE_IDX_BRIDGE_HORIZONTAL) return(true);
        return(tileIdx===this.TILE_IDX_BRIDGE_VERTICAL);
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
        let map=this.game.map;
        
        // when walking, we just update the animation frame,
        // when not walking, we animate until we hit 0 and stop
        this.walkAnimationFrameCount--;
        if (this.walkAnimationFrameCount<0) {
            this.walkAnimationFrameCount=this.WALK_FRAME_TICK;

            if (this.moving) {
                this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
            }
            else {
                if (this.walkAnimationFrame!==0) this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
            }
            this.setCurrentImage(this.WALK_ANIMATION[this.walkAnimationFrame]);
        }
        
        // input 
        if (!this.moving) {
            this.moveToX=this.lastToX=this.x;
            this.moveToY=this.lastToY=this.y;
            
            if (this.game.input.isKeyDown("KeyA")) {
                if (this.hasRoadLeft()) this.moveToX=this.x-map.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.game.input.isKeyDown("KeyD")) {
                if (this.hasRoadRight()) this.moveToX=this.x+map.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.game.input.isKeyDown("KeyW")) {
                if (this.hasRoadUp()) this.moveToY=this.y-map.MAP_TILE_SIZE;
                this.moving=true;
            }

            if (this.game.input.isKeyDown("KeyS")) {
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
            
            case this.TILE_IDX_CROSS:
            case this.TILE_IDX_LEFT_T:
            case this.TILE_IDX_UP_T:
            case this.TILE_IDX_DOT:
            case this.TILE_IDX_BRIDGE_CENTER:
                this.moving=false;
                break;
                
            case this.TILE_IDX_GATE:        // gates bounce you back
                this.moveToX=this.lastToX;
                this.moveToY=this.lastToY;
                break;
                
            case this.TILE_IDX_ROAD_HORIZONTAL:
            case this.TILE_IDX_BRIDGE_HORIZONTAL:
                this.moveToX=this.x+(Math.sign(xDir)*map.MAP_TILE_SIZE);
                break;
                
            case this.TILE_IDX_ROAD_VERTICAL:
            case this.TILE_IDX_BRIDGE_VERTICAL:
                this.moveToY=this.y+(Math.sign(yDir)*map.MAP_TILE_SIZE);
                break;
            
            case this.TILE_IDX_ROAD_TOP_LEFT_CORNER:
                if (Math.sign(xDir)<0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y+map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x+map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case this.TILE_IDX_ROAD_TOP_RIGHT_CORNER:
                if (Math.sign(xDir)>0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y+map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x-map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case this.TILE_IDX_ROAD_BOTTOM_LEFT_CORNER:
                if (Math.sign(xDir)<0) {
                    this.moveToX=this.x;
                    this.moveToY=this.y-map.MAP_TILE_SIZE;
                }
                else {
                    this.moveToX=this.x+map.MAP_TILE_SIZE;
                    this.moveToY=this.y;
                }
                break;
                
            case this.TILE_IDX_ROAD_BOTTOM_RIGHT_CORNER:
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
