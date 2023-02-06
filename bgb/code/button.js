import SpriteClass from '../../rpjs/engine/sprite.js';
import SquishFilterClass from '../../rpjs/filters/squish.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class ButtonClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.SQUISH_TICK=5;
        
            // variables
        
        this.addImage('sprites/button');
        this.setCurrentImage('sprites/button');
        
        this.squishCount=-1;
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.squishDrawFilter=new SquishFilterClass();
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new ButtonClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        let mode,sprite;
        
            // if squishing we can't step on again
            
        if (this.squishCount!==-1) return;
        
            // is button pushed (only if standing on it)
            
        if (!(interactSprite instanceof PlayerSideScrollClass)) return;
        if (interactSprite.standSprite!==this) return;
        
        mode=this.data.get('mode');
        
            // mode = show means show the first sprite
            // that has this show_id
            
        if (mode==='show') {
            sprite=this.game.map.getFirstSpriteWithData('id',this.data.get('show_id'));
            sprite.show=true;
        }
        
            // mode = liquid means move the liquid to
            // the position by liquid_y
            
        if (mode==='liquid') {
            this.game.map.moveLiquidTo(this.data.get('liquid_y'),this.data.get('liquid_move_speed'));
        }
        
            // click sound
            
        this.game.soundList.play('click');
        
            // start the squish
            
        this.squishCount=this.SQUISH_TICK;
        this.drawFilter=this.squishDrawFilter;
        
        this.canCollide=false;
        this.canStandOn=false;
    }
    
    run()
    {
            // squishing?
            
        if (this.squishCount===-1) return;
        
        this.drawFilterAnimationFactor=1.0-(this.squishCount/this.SQUISH_TICK);
        this.squishCount--;
        
        if (this.squishCount<=0) {
            this.delete();
        }
    }
}
