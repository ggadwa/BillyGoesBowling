import ImageListClass from '../resources/image_list.js';

export default class BillyImageListClass extends ImageListClass
{
    constructor()
    {
        super();
    }
    
    create()
    {
            // tiles
            
        this.add('tiles/ground_grass_end_left');
        this.add('tiles/ground_grass');
        this.add('tiles/ground_grass_end_right');
        
        this.add('tiles/ground_grass_connect_left');
        this.add('tiles/ground_dirt_fill');
        this.add('tiles/ground_grass_connect_right');
        
        this.add('tiles/ground_dirt_bottom_left');
        this.add('tiles/ground_dirt_bottom');
        this.add('tiles/ground_dirt_bottom_right');
        
        this.add('tiles/girder_left_horizontal');
        this.add('tiles/girder_middle_horizontal');
        this.add('tiles/girder_right_horizontal');
        
        this.add('tiles/girder_top_vertical');
        this.add('tiles/girder_middle_vertical');
        this.add('tiles/girder_bottom_vertical');
        
        this.add('tiles/girder_connect');
        this.add('tiles/temp_1');
        this.add('tiles/temp_2');
        
        this.add('tiles/world_grass_top_left');
        this.add('tiles/world_grass_top');
        this.add('tiles/world_grass_top_right');
        
        this.add('tiles/world_grass_left');
        this.add('tiles/world_grass');
        this.add('tiles/world_grass_right');
        
        this.add('tiles/world_grass_bottom_left');
        this.add('tiles/world_grass_bottom');
        this.add('tiles/world_grass_bottom_right');
        
        this.add('tiles/world_grass_corner_top_left');
        this.add('tiles/world_grass_corner_top_right');
        this.add('tiles/world_bridge_horizontal');
        
        this.add('tiles/world_grass_corner_bottom_left');
        this.add('tiles/world_grass_corner_bottom_right');
        this.add('tiles/world_bridge_vertical');
        
        this.add('tiles/world_road_curve_top_left');
        this.add('tiles/world_road_horizontal');
        this.add('tiles/world_road_curve_top_right');
        
        this.add('tiles/world_road_vertical');
        this.add('tiles/world_road_cross');
        this.add('tiles/world_road_dot');

        this.add('tiles/world_road_curve_bottom_left');
        this.add('tiles/world_mountain');
        this.add('tiles/world_road_curve_bottom_right');
        
        this.add('tiles/world_water_1');
        
            // sprites
            
        this.add('sprites/ball');
        this.add('sprites/billy_left');
        this.add('sprites/billy_right');
        this.add('sprites/billy_world');
        this.add('sprites/pin');
        this.add('sprites/block');
        this.add('sprites/break_block');
        this.add('sprites/break_block_strong');
        this.add('sprites/explode_block_0');
        this.add('sprites/explode_block_1');
        this.add('sprites/explode_block_2');
        this.add('sprites/explode_block_3');
        this.add('sprites/cloud_block');
        
        this.add('sprites/platform');
        this.add('sprites/door');
        
        this.add('sprites/ninja_bunny');
        this.add('sprites/shurikin');
        this.add('sprites/drain_pipe_snake_cover_left');
        this.add('sprites/drain_pipe_snake_free_left');
        this.add('sprites/drain_pipe_snake_cover_right');
        this.add('sprites/drain_pipe_snake_free_right');
        this.add('sprites/roto_carrot');
        
        this.add('sprites/particle_block');
        this.add('sprites/particle_explode_block');
        
        this.add('sprites/world_map_spot');
        this.add('sprites/world_map_castle');
        this.add('sprites/world_map_block');
        
            // UI
            
        this.add('ui/pin');
        this.add('ui/banner');
    }
    
}
