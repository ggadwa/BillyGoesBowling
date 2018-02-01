import MapClass from '../engine/map.js';
import GridSpotClass from '../engine/grid_spot.js';
import PlayerWorldClass from '../code/player_world.js';
import MapSpotClass from '../code/map_spot.js';

export default class WorldBaseMapClass extends MapClass
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

            case '.':
                return(new GridSpotClass(game,imageList.get('world_water'),true,true));
        
                // sprites, return object
                
            case '*':
                return(new PlayerWorldClass(game));
            case '#':
                return(new MapSpotClass(game));

        }
         
         return(null);
    }
}
