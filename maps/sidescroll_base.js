import MapClass from '../engine/map.js';
import GridSpotClass from '../engine/grid_spot.js';
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
        let game=this.getGame();
        let imageList=game.getImageList();
        
        switch (ch)
        {
                // tiles, return string path
                // an array would be better but it's easy to see the letter like this
                
            case 'A':
                return(new GridSpotClass(game,imageList.get('ground_grass'),true,true));
            case 'B':
                return(new GridSpotClass(game,imageList.get('ground_grass_end_left'),true,true));
            case 'C':
                return(new GridSpotClass(game,imageList.get('ground_grass_end_right'),true,true));
            case 'D':
                return(new GridSpotClass(game,imageList.get('ground_grass_connect_left'),true,true));
            case 'E':
                return(new GridSpotClass(game,imageList.get('ground_grass_connect_right'),true,true));
            case 'F':
                return(new GridSpotClass(game,imageList.get('ground_dirt_fill'),true,true));
            case 'G':
                return(new GridSpotClass(game,imageList.get('girder_left_horizontal'),true,true));
            case 'H':
                return(new GridSpotClass(game,imageList.get('girder_middle_horizontal'),true,true));
            case 'I':
                return(new GridSpotClass(game,imageList.get('girder_right_horizontal'),true,true));
            case 'J':
                return(new GridSpotClass(game,imageList.get('girder_top_vertical'),true,true));
            case 'K':
                return(new GridSpotClass(game,imageList.get('girder_middle_vertical'),true,true));
            case 'L':
                return(new GridSpotClass(game,imageList.get('girder_bottom_vertical'),true,true));
            case 'M':
                return(new GridSpotClass(game,imageList.get('girder_connect'),true,true));
            case 'N':
                return(new GridSpotClass(game,imageList.get('ground_dirt_bottom'),true,true));
            case 'O':
                return(new GridSpotClass(game,imageList.get('ground_dirt_bottom_left'),true,true));
            case 'P':
                return(new GridSpotClass(game,imageList.get('ground_dirt_bottom_right'),true,true));
        
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
