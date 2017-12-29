import GameClass from '../engine/game.js';
import Map1Class from '../maps/map1.js';

export default class BillyGoesBowlingClass extends GameClass
{
    constructor()
    {
        super();
        
        Object.seal(this);
    }
    
    initialize()
    {
        super.initialize();
        
        this.setMap(new Map1Class(this,64));
    }
}
