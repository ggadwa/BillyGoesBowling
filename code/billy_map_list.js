import MapListClass from '../resources/map_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import SnakesOnAPlainMapClass from '../maps/snakes_on_a_plain.js';
import ApocalypseCarrotMapClass from '../maps/apocalypse_carrot.js';
import HillsNinjaBunniesMapClass from '../maps/hills_ninja_bunnies.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';
import ExecutionerCastleMapClass from '../maps/executioners_castle.js';
import PlatformTroubledWaterMapClass from '../maps/platform_troubled_water.js';
import SurfsUpMapClass from '../maps/surfs_up.js';
import SurfsDownMapClass from '../maps/surfs_down.js';
import HeadsUpMapClass from '../maps/heads_up.js';

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
        
        this.add('platform_troubled_waters',new PlatformTroubledWaterMapClass(game));
        this.add('surfs_up',new SurfsUpMapClass(game));
        this.add('surfs_down',new SurfsDownMapClass(game));
        
        this.add('heads_up',new HeadsUpMapClass(game));
    }
    
}
