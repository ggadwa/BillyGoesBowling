import WorldBaseMapClass from './world_base.js';
import GridSpotClass from '../engine/grid_spot.js';
import MapSpotClass from '../code/map_spot.js';
import MapCastleClass from '../code/map_castle.js';
import MapBlockClass from '../code/map_block.js';
import PlayerWorldClass from '../code/player_world.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';

export default class WorldMainMapClass extends WorldBaseMapClass
{
    constructor(game)
    {
        super(game);
    }
    
    getMapTileLayout()
    {
        return(
            [
                '.........................................................................................................................................................................',
                '........................FDDG.............................................................................................................................................',
                '...................FDDDDJAAC.........FDDDDDDDG....................FDDDDDDDDG..........................................................FDDDDDDDDDDDDG.....................',
                '................FDDJAAAAAAAC---------EAAAAAAAAG..................FAAAAAAAAAAG........................................................AAAAAAAAAAAAAAA.....................',
                '................BAAAAAAAAAEI..........HAAAAAAA-----------------AAAAAAAAAAAAAAAG..................FDDDDDDDDG..........................AAAAAAAAAAAAAAAAAAA.................',
                '................BAAAAAAAEC.............HAAAAEI..................AAAAAAAAAAAAAAA------------------AAAAAAAAAAA........................AAAAAAAAAAAAAAAAAAAAAAAA.............',
                '................BAAAAAAC................HEEI.......................AAAAAAAAAA.....................AAAAAAAAAAA-------------------------AAAAAAAAAAAAAAAAAAA................',
                '................BAAAAAAAC.............................................AAAAAAAA......................AAAAAAAA............................AAAAAAAAAAAAAAAAA................',
                '.....FDDDDDDDDG.HLAAAAAAAC...............................................AAAAAAAAA.................AAAAAAAA................................AAAAAAAA......................',
                '.....BAAAAAAAAC..BAAAAAAAADDDDDDDDDDC.......................................AAAAAAAAA................AAAAA...............................AAAAAAAAAAAAAA..................',
                '.....BA00AAAAAC--BAAAAAAAAAAAAAAAAAAAC.......................................AAAAAAAA.................|............................AAAAAAAAAAAAAAAAAAAAAA...............',
                '.....BAA000AAAC..HEEELAAAAAAAAAAAAAAAADDDDC.................................AAAAAAAAAAA................|.......................AAAAAAAAAAAAAAAAAAAAAAAAAAA...............',
                '.....BAAA00AAAKG.....BAAAAAAAAAAAAAAAAAAAAADC...............................AAAAAAAAA..................|.....................AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA............',
                '.....HLAAA0AAAAKDDDG.HEEEELAAAAAAAAAAAAAAAC............................AAAAAAAAAAAAAA..................|....................AAAAAA......AAAAAAAAAAAAAAAAAAAAA............',
                '......BAAAAAAAAAAAAC......HEEELAAAAAAAAAAEC......................AAAAAAAAAAAAAAA.....................AAAAA..................AAAAA........AAAAAAAAAAAA....AAAAAAA.........',
                '......HLAAAAAAMEEEEI..........HELAAAAAAAC...................AAAAAAAAAAAAAAAAAAA......................AAAAA.................AAAAAAA.........AAAAAA.........AAAAAAA........',
                '.......HEEEEEEI.................HEEELAAAADDC............AAAAAAAAAAAAAAAAA............................AAAAA.................AAAAAAA........AAAAAAAAA......AAAAAAAAAA......',
                '....................................HELAAAAAC........AAAAAAAAAAAAAAAAA.................................|.....................AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.......',
                '......................................BAAAAC......AAAAAAAAAAAAAAAAAAA..................................|......................AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.........',
                '......................................HLAAAADC----AAAAAAAAAAAAAAAAAAAA...............................AAAAAA....................AAAAAAAAAAAAAAAAAAAAAAAAAAAAA.............',
                '.......................................BAAAAAI....AAAAAAAAAAAAAAAAA.................................AAAAAAAAA------------------AAAAAAAAAAA...............................',
                '.......................................HEEEEI......AAAAAAAAAAAAA.....................................AAAAAA...................AAAAAAAAAAAA...............................',
                '.........................................................................................................................................................................',
                '.........................................................................................................................................................................'
            ]
        );
    }
    
    getMapSpriteLayout()
    {
        return(
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '         C    1 !        *',
                '     @',
                '        A',
                '         B',
                '               D  !',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            ]
        );
    }

    createMapTileForCharacter(ch)
    {
        let game=this.getGame();
        let imageList=game.getImageList();
        
        switch (ch)
        {
            case 'A':
                return(new GridSpotClass(game,imageList.get('world_grass'),true,false));
            case 'B':
                return(new GridSpotClass(game,imageList.get('world_grass_left'),true,false));
            case 'C':
                return(new GridSpotClass(game,imageList.get('world_grass_right'),true,false));
            case 'D':
                return(new GridSpotClass(game,imageList.get('world_grass_top'),true,false));
            case 'E':
                return(new GridSpotClass(game,imageList.get('world_grass_bottom'),true,false));
            case 'F':
                return(new GridSpotClass(game,imageList.get('world_grass_top_left'),true,false));
            case 'G':
                return(new GridSpotClass(game,imageList.get('world_grass_top_right'),true,false));
            case 'H':
                return(new GridSpotClass(game,imageList.get('world_grass_bottom_left'),true,false));
            case 'I':
                return(new GridSpotClass(game,imageList.get('world_grass_bottom_right'),true,false));
            case 'J':
                return(new GridSpotClass(game,imageList.get('world_grass_corner_top_left'),true,false));
            case 'K':
                return(new GridSpotClass(game,imageList.get('world_grass_corner_top_right'),true,false));
            case 'L':
                return(new GridSpotClass(game,imageList.get('world_grass_corner_bottom_left'),true,false));
            case 'M':
                return(new GridSpotClass(game,imageList.get('world_grass_corner_bottom_right'),true,false));

                
                
                
            case '-':
                return(new GridSpotClass(game,imageList.get('world_bridge_horizontal'),true,false));
            case '|':
                return(new GridSpotClass(game,imageList.get('world_bridge_vertical'),true,false));
                
            case '0':
                return(new GridSpotClass(game,imageList.get('world_mountain'),true,true));

            case '.':
                return(new GridSpotClass(game,imageList.get('world_water'),true,true));
        }
         
         return(null);
    }
    
    createMapSpriteForCharacter(ch)
    {
        let game=this.getGame();
        let sprite;
        
        switch (ch)
        {
            case '*':
                return(new PlayerWorldClass(game));
                
            case 'A':
                sprite=new MapSpotClass(game);
                sprite.setData('title','Buffet of Blocks');
                sprite.setData('map',new BuffetOfBlocksMapClass(game));
                return(sprite);
        
            case 'B':
                sprite=new MapSpotClass(game);
                sprite.setData('title','Puzzling Bombs');
                sprite.setData('map',new BuffetOfBlocksMapClass(game));
                return(sprite);

            case 'C':
                sprite=new MapSpotClass(game);
                sprite.setData('title','Drainpipe Snakes on a Plain');
                sprite.setData('map',new BuffetOfBlocksMapClass(game));
                return(sprite);

            case 'D':
                sprite=new MapSpotClass(game);
                sprite.setData('title','The Hills are Alive with Ninja Bunnies');
                sprite.setData('map',new BuffetOfBlocksMapClass(game));
                return(sprite);
                
            case '1':
                sprite=new MapCastleClass(game);
                sprite.setData('title','The Executioner\'s Castle');
                sprite.setData('map',null);
                sprite.setData('pin_count',2);
                sprite.setData('block_open_list',['bridge']);
                return(sprite);
                
            case 'a':
                sprite=new MapBlockClass(game);
                sprite.setData('id','bridge');
                return(sprite);
                
            case 'b':
                sprite=new MapBlockClass(game);
                sprite.setData('id','caves');
                return(sprite);

        }
         
         return(null);
    }

}
