import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapCottageClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_cottage');
        this.setCurrentImage('sprites/world_map_cottage');
        this.setEditorImage('sprites/world_map_cottage');
        
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
        return(new MapCottageClass(this.game,x,y,this.data));
    }
        
    runAI()
    {
        let playerSprite=this.game.map.getSpritePlayer();
        
            // are we colliding with player?
            
        if (!playerSprite.collide(this)) return;
            
/*            
        if ((this.game.input.isAction()) || (this.game.input.isSelect())) {
        }
        */
    }
}
