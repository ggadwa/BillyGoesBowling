import MapListClass from '../resources/map_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import SnakesOnAPlainMapClass from '../maps/snakes_on_a_plain.js';
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
        this.add('Snakes on a Plain',new SnakesOnAPlainMapClass(game));
        this.add('Buffet of Blocks',new BuffetOfBlocksMapClass(game));
    }
    
}
