import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class TrophyClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/trophy');
        this.setCurrentImage('sprites/trophy');
        this.setEditorImage('sprites/trophy');
        
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
        return(new TrophyClass(this.game,x,y,this.data));
    }

    mapStartup()
    {
            // if trophy has been picked up once, then
            // make it transparent
            
        if (this.game.getData('trophy_'+this.game.map.getMapName())!==null) this.alpha=0.25;
    }
    
    runAI()
    {
            // are we colliding with player?
            
        if (!this.game.map.checkCollision(this)) return;
        if (this.collideSprite===null) return;
        if (!(this.collideSprite instanceof PlayerSideScrollClass)) return;
            
            // add pin
            
        if (this.game.getData('trophy_'+this.game.map.getMapName())===null) {
            this.game.setData('trophies',(this.game.getData('trophies')+1));
            this.game.setData(('tropy_'+this.game.map.getMapName()),true);
        }
        
        this.delete();
    }
}
