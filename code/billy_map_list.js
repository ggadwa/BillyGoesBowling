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
import RainingCreepsMapClass from '../maps/raining_creeps.js';
import PuzzlingBlocksMapClass from '../maps/puzzling_blocks.js';
import NinjaJailMapClass from '../maps/ninja_jail.js';
import MrCPUCastleMapClass from '../maps/mr_cpu_castle.js';
import CarrotCatacylismMapClass from '../maps/carrot_catacylism.js';
import SnakePitMapClass from '../maps/snake_pit.js';
import NinjaMachineMapClass from '../maps/ninja_machine.js';
import BoneyOneEyeCastleMapClass from '../maps/boney_one_eye_castle.js';
import KingGhastlyCastleMapClass from '../maps/king_ghastly_castle.js';

export default class BillyMapListClass extends MapListClass
{
    constructor(game)
    {
        super(game);
    }
    
    create()
    {
        let game=this.game;
        
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
        this.add('raining_creeps',new RainingCreepsMapClass(game));
        this.add('ninja_jail',new NinjaJailMapClass(game));
        this.add('puzzling_blocks',new PuzzlingBlocksMapClass(game));
        this.add('mr_cpu_castle',new MrCPUCastleMapClass(game));
        
        this.add('carrot_catacylism',new CarrotCatacylismMapClass(game));
        this.add('snake_pit',new SnakePitMapClass(game));
        this.add('ninja_machine',new NinjaMachineMapClass(game));
        this.add('boney_one_eye_castle',new BoneyOneEyeCastleMapClass(game));
        
        this.add('king_ghastly_castle',new KingGhastlyCastleMapClass(game));
    }
    
}
