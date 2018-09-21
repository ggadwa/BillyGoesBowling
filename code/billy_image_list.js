import ImageListClass from '../resources/image_list.js';

export default class BillyImageListClass extends ImageListClass
{
    constructor(game)
    {
        super(game);
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
        this.add('tiles/castle_wall');
        this.add('tiles/castle_floor');
        
        this.add('tiles/ground_dirt_left');
        this.add('tiles/ground_dirt_right');
        this.add('tiles/ground_dirt_fill_2');
        
        this.add('tiles/unused_2');
        this.add('tiles/unused_3');
        this.add('tiles/unused_4');
        
        this.add('tiles/unused_5');
        this.add('tiles/unused_6');
        this.add('tiles/unused_7');
        
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
        
        this.add('tiles/world_tree');
        this.add('tiles/world_gate');
        this.add('tiles/arrow_down');
        
        this.add('tiles/world_left_t');
        this.add('tiles/world_up_t');
        
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
        this.add('sprites/gravestone');
        this.add('sprites/button');
        this.add('sprites/spring_close');
        this.add('sprites/trophy');
        
        this.add('sprites/ninja_bunny');
        this.add('sprites/shurikin');
        this.add('sprites/drain_pipe_snake_cover_left');
        this.add('sprites/drain_pipe_snake_free_left');
        this.add('sprites/drain_pipe_snake_cover_right');
        this.add('sprites/drain_pipe_snake_free_right');
        this.add('sprites/roto_carrot');
        this.add('sprites/bomb');
        this.add('sprites/easter_head_left');
        this.add('sprites/easter_head_right');
        this.add('sprites/rock');
        
        this.add('sprites/executioner_axe');
        this.add('sprites/axe');
        this.add('sprites/bawk_bawk');
        this.add('sprites/boney_one_eye');
        this.add('sprites/eye');
        this.add('sprites/king_ghastly');
        
        this.add('sprites/world_map_spot_red');
        this.add('sprites/world_map_spot_yellow');
        this.add('sprites/world_map_spot_green');
        this.add('sprites/world_map_castle');
        this.add('sprites/world_map_castle_locked');
        this.add('sprites/world_map_castle_wreck');
        this.add('sprites/world_map_block');
        
            // particles
            
        this.add('particles/block');
        this.add('particles/pipe');
        this.add('particles/explode_block');
        this.add('particles/skull');
        
            // backgrounds
            
        this.add('backgrounds/sun');
        this.add('backgrounds/clouds');
        this.add('backgrounds/mountains');
        this.add('backgrounds/water');
        
            // UI
            
        this.add('ui/pin');
        this.add('ui/trophy');
        this.add('ui/score_box');
        this.add('ui/health_100');
        this.add('ui/health_75');
        this.add('ui/health_50');
        this.add('ui/health_25');
        this.add('ui/banner');
    }
    
}
