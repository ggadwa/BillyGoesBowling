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
                '...................FDDDDAAAC.............................................................................................................................................',
                '................FDDAAAAAAAAAG............................................................................................................................................',
                '................BAAAAAAAAAAAC............................................................................................................................................',
                '................BAAAAA...................................................................................................................................................',
                '................BAAAAA...................................................................................................................................................',
                '................BAAAAA...................................................................................................................................................',
                '.....FDDDDDDDDG.HAAAAA...................................................................................................................................................',
                '.....BAAMAAAAAC..BAAAA...................................................................................................................................................',
                '.....BAAMMAAAAAJJAAAAA...................................................................................................................................................',
                '.....BAAMMMAAAC..HEEEA...................................................................................................................................................',
                '.....BAAAMMAAAAG.....B...................................................................................................................................................',
                '.....HAAAAMAAAAADDDG.HEEE................................................................................................................................................',
                '......BAAAAAAAAAAAAC.....................................................................................................................................................',
                '......HAAAAAAAAEEEEI.....................................................................................................................................................',
                '.......HEEEEEEI..........................................................................................................................................................',
                '.........................................................................................................................................................................',
                '.........................................................................................................................................................................',
                '.........................................................................................................................................................................',
                '.........................................................................................................................................................................',
                '.........................................................................................................................................................................',
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
                '          C   1 a',
                '     *',
                '        A',
                '         B',
                '               D  b',
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
                return(new GridSpotClass(game,imageList.get('world_bridge_horizontal'),true,false));
            case 'K':
                return(new GridSpotClass(game,imageList.get('world_bridge_vertical'),true,false));
                
            case 'M':
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
