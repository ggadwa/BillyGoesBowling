import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import WorldMainMapClass from '../maps/world_main.js';

export default class PinClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/pin');
        this.setCurrentImage('sprites/pin');
        this.setEditorImage('sprites/pin');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PinClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
            // if pin has been picked up once, then
            // make it transparent
            
        if (this.game.getData('pin_'+this.game.map.getMapName())!==null) this.alpha=0.25;
    }
    
    runAI()
    {
            // are we colliding with player?
            
        if (!this.game.map.checkCollision(this)) return;
        if (this.collideSprite===null) return;
        if (!(this.collideSprite instanceof PlayerSideScrollClass)) return;
            
            // add pin
            
        if (this.game.getData('pin_'+this.game.map.getMapName())===null) {
            this.game.setData(this.game.getData('pins')+1);
            this.game.setData(('pin_'+this.game.map.getMapName()),true);
        }
        
        this.delete();
        
            // jump back to map
            
        this.game.gotoMap('World Main');
    }
}
