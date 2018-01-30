import MapClass from '../engine/map.js';
import PlayerSideScrollClass from '../code/player_sidescroll.js';
import PinClass from '../code/pin.js';
import DoorClass from '../code/door.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BlockClass from '../code/block.js';
import CloudBlockClass from '../code/cloud_block.js';
import PlatformClass from '../code/platform.js';
import DrainPipeSnakeClass from '../code/drain_pipe_snake.js';
import NinjaBunnyClass from '../code/ninja_bunny.js';

export default class SideScrollBaseMapClass extends MapClass
{
    constructor(game)
    {
        super(game);
    }
    
    createMapItemForCharacter(ch)
    {
        switch (ch)
        {
                // tiles, return string path
                // an array would be better but it's easy to see the letter like this
                
            case 'A':
                return('ground_grass');
            case 'B':
                return('ground_grass_end_left');
            case 'C':
                return('ground_grass_end_right');
            case 'D':
                return('ground_grass_connect_left');
            case 'E':
                return('ground_grass_connect_right');
            case 'F':
                return('ground_dirt_fill');
            case 'G':
                return('girder_left_horizontal');
            case 'H':
                return('girder_middle_horizontal');
            case 'I':
                return('girder_right_horizontal');
            case 'J':
                return('girder_top_vertical');
            case 'K':
                return('girder_middle_vertical');
            case 'L':
                return('girder_bottom_vertical');
            case 'M':
                return('girder_connect');
            case 'N':
                return('ground_dirt_bottom');
            case 'O':
                return('ground_dirt_bottom_left');
            case 'P':
                return('ground_dirt_bottom_right');
        
                // sprites, return object
                
            case '*':
                return(new PlayerSideScrollClass(this.getGame()));
            case 'a':
                return(new DoorClass(this.getGame()));
            case 'b':
                return(new PinClass(this.getGame()));
            case 'c':
                return(new BreakBlockClass(this.getGame()));
            case 'd':
                return(new BreakBlockStrongClass(this.getGame()));
            case 'e':
                return(new ExplodeBlockClass(this.getGame()));
            case 'f':
                return(new BlockClass(this.getGame()));
            case 'g':
                return(new CloudBlockClass(this.getGame()));
            case 'h':
                return(new PlatformClass(this.getGame()));
                
            case '1':
                return(new DrainPipeSnakeClass(this.getGame()));
            case '2':
                return(new NinjaBunnyClass(this.getGame()));
                
         }
         
         return(null);
    }
}
