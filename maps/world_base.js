import MapClass from '../engine/map.js';
import PlayerWorldClass from '../code/player_world.js';

export default class WorldBaseMapClass extends MapClass
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
                return('world_grass');
            case 'B':
                return('world_grass_left');
            case 'C':
                return('world_grass_right');
            case 'D':
                return('world_grass_top');
            case 'E':
                return('world_grass_bottom');
            case 'F':
                return('world_grass_top_left');
            case 'G':
                return('world_grass_top_right');
            case 'H':
                return('world_grass_bottom_left');
            case 'I':
                return('world_grass_bottom_right');

            case '.':
                return('world_water');
        
                // sprites, return object
                
            case '*':
                return(new PlayerWorldClass(this.getGame()));

        }
         
         return(null);
    }
}
