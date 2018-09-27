import MapClass from '../engine/map.js';
import SideScrollNormalBaseMapClass from '../maps/side_scroll_normal_base.js';
import PlayerSideScrollClass from '../code/player_sidescroll.js';
import BlockClass from '../code/block.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import CloudBlockClass from '../code/cloud_block.js';
import ExplodeBlockClass from '../code/explode_block.js';
import PlatformClass from '../code/platform.js';
import DoorClass from '../code/door.js';
import PinClass from '../code/pin.js';
import TrophyClass from '../code/trophy.js';
import ButtonClass from '../code/button.js';
import SpringClass from '../code/spring.js';
import DrainPipeSnakeClass from '../code/drain_pipe_snake.js';
import NinjaBunnyClass from '../code/ninja_bunny.js';
import RotoCarrotClass from '../code/roto_carrot.js';
import EasterHeadClass from '../code/easter_head.js';

export default class Cloud9MapClass extends SideScrollNormalBaseMapClass
{
    create()
    {
        this.createTileData=null;
        this.createSprites=[];
    }
    
    mapStartup()
    {
        super.mapStartup();
        
        this.liquidY=3616;
    }
}
