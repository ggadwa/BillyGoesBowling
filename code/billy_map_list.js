import MapListClass from '../resources/map_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import SnakesOnAPlainMapClass from '../maps/snakes_on_a_plain.js';
import ApocalypseCarrotMapClass from '../maps/apocalypse_carrot.js';
import HillsNinjaBunniesMapClass from '../maps/hills_ninja_bunnies.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';
import ExecutionerCastleMapClass from '../maps/executioners_castle.js';

export default class BillyMapListClass extends MapListClass
{
    constructor()
    {
        super();
    }
    
    create(game)
    {
        this.add('world_main',new WorldMainMapClass(game));
        this.add('snakes_on_a_plain',new SnakesOnAPlainMapClass(game));
        this.add('apocalypse_carrot',new ApocalypseCarrotMapClass(game));
        this.add('hills_ninja_bunnies',new HillsNinjaBunniesMapClass(game));
        this.add('buffet_of_blocks',new BuffetOfBlocksMapClass(game));
        this.add('executioners_castle',new ExecutionerCastleMapClass(game));
    }
    
}
