import MapListClass from '../resources/map_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';

export default class BillyMapListClass extends MapListClass
{
    constructor()
    {
        super();
    }
    
    create(game)
    {
        this.add('World Main',new WorldMainMapClass(game));
        this.add('Buffet of Blocks',new BuffetOfBlocksMapClass(game));
    }
    
}
