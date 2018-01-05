import GameClass from '../engine/game.js';
import Map1Class from '../maps/map1.js';

export default class BillyGoesBowlingClass extends GameClass
{
    constructor()
    {
        super();
        
        Object.seal(this);
    }
    
    getPreloadImages()
    {
        return(
            [
                'ball',
                'billy_left',
                'billy_right',
                'block',
                'break_block',
                'break_block_strong',
                'explode_block',
                'explode_block_1',
                'explode_block_2',
                'explode_block_3',
                'cloud_block',
                'girder_connect',
                'girder_top_vertical',
                'girder_middle_vertical',
                'girder_bottom_vertical',
                'girder_left_horizontal',
                'girder_middle_horizontal',
                'girder_right_horizontal',
                'ground_grass',
                'ground_grass_end_left',
                'ground_grass_end_right',
                'ground_grass_connect_left',
                'ground_grass_connect_right',
                'ground_dirt_fill',
                'ground_dirt_bottom',
                'ground_dirt_bottom_left',
                'ground_dirt_bottom_right',
                'particle_block',
                'particle_explode_block',
                'platform'
            ]
        );
    }
    
    getPreloadSounds()
    {
        return(
            [
                'crack',
                'explode',
                'pop'
            ]
        );
    }
    
    initialize()
    {
        super.initialize();
        
        this.setMap(new Map1Class(this,64));
    }
}
