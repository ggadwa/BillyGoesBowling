import EntityClass from '../engine/entity.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import WorldMainMapClass from '../maps/world_main.js';

export default class PinClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('pin');
        this.setCurrentImage('pin');
        this.setEditorImage('pin');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    mapStartup()
    {
        let game=this.getGame();
        
            // if pin has been picked up once, then
            // make it transparent
            
        if (game.getData('pin_'+game.getMap().getMapName())!==null) this.alpha=0.25;
    }
    
    runAI()
    {
        let game=this.getGame();
        
            // are we colliding with player?
            
        if (!game.getMap().checkCollision(this)) return;
        if (this.collideSprite===null) return;
        if (!(this.collideSprite instanceof PlayerSideScrollClass)) return;
            
            // add pin
            
        if (game.getData('pin_'+game.getMap().getMapName())===null) {
            game.setData(game.getData('pins')+1);
            game.setData(('pin_'+game.getMap().getMapName()),true);
        }
        
        this.delete();
        
            // jump back to map
            
        game.gotoMap(new WorldMainMapClass(game));
    }
}
