import SpriteClass from '../engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapCastleClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_castle');
        this.addImage('sprites/world_map_castle_wreck');
        this.setCurrentImage('sprites/world_map_castle');
        this.setEditorImage('sprites/world_map_castle');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.background=true;           // a background sprite, draws in the same plane as the map

        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new MapCastleClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        if (this.game.getData('boss_'+this.getData('map'))!==null) this.setCurrentImage('sprites/world_map_castle_wreck');
    }
    
    runAI()
    {
        let playerSprite=this.game.map.getSpritePlayer();
        
            // are we colliding with player?
            
        if (!playerSprite.collide(this)) return;
            
            // change UI
            
        this.game.setBanner(this.getData('title'),this.getData('pin'));
        
            // if action or select, than jump to map
            // save the X/Y so we can restore when we exit
            
        if ((this.game.input.isAction()) || (this.game.input.isSelect())) {
            this.game.setData('worldXPos',playerSprite.x);
            this.game.setData('worldYPos',playerSprite.y);
            this.game.gotoMap(this.getData('map'));
        }
    }
}
