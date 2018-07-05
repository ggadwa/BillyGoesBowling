import ImageListClass from '../resources/image_list.js';

export default class BillyImageListClass extends ImageListClass
{
    constructor()
    {
        super();
    }
    
    fillImageList()
    {
            // tiles
            
        this.add('ground_grass_end_left',this.IMAGE_TILE);
        this.add('ground_grass',this.IMAGE_TILE);
        this.add('ground_grass_end_right',this.IMAGE_TILE);
        
        this.add('ground_grass_connect_left',this.IMAGE_TILE);
        this.add('ground_dirt_fill',this.IMAGE_TILE);
        this.add('ground_grass_connect_right',this.IMAGE_TILE);
        
        this.add('ground_dirt_bottom_left',this.IMAGE_TILE);
        this.add('ground_dirt_bottom',this.IMAGE_TILE);
        this.add('ground_dirt_bottom_right',this.IMAGE_TILE);
        
        this.add('girder_left_horizontal',this.IMAGE_TILE);
        this.add('girder_middle_horizontal',this.IMAGE_TILE);
        this.add('girder_right_horizontal',this.IMAGE_TILE);
        
        this.add('girder_top_vertical',this.IMAGE_TILE);
        this.add('girder_middle_vertical',this.IMAGE_TILE);
        this.add('girder_bottom_vertical',this.IMAGE_TILE);
        
        this.add('girder_connect',this.IMAGE_TILE);
        this.add('temp_1',this.IMAGE_TILE);
        this.add('temp_2',this.IMAGE_TILE);
        
        this.add('world_grass_top_left',this.IMAGE_TILE);
        this.add('world_grass_top',this.IMAGE_TILE);
        this.add('world_grass_top_right',this.IMAGE_TILE);
        
        this.add('world_grass_left',this.IMAGE_TILE);
        this.add('world_grass',this.IMAGE_TILE);
        this.add('world_grass_right',this.IMAGE_TILE);
        
        this.add('world_grass_bottom_left',this.IMAGE_TILE);
        this.add('world_grass_bottom',this.IMAGE_TILE);
        this.add('world_grass_bottom_right',this.IMAGE_TILE);
        
        this.add('world_grass_corner_top_left',this.IMAGE_TILE);
        this.add('world_grass_corner_top_right',this.IMAGE_TILE);
        this.add('world_bridge_horizontal',this.IMAGE_TILE);
        
        this.add('world_grass_corner_bottom_left',this.IMAGE_TILE);
        this.add('world_grass_corner_bottom_right',this.IMAGE_TILE);
        this.add('world_bridge_vertical',this.IMAGE_TILE);
        
        this.add('world_road_curve_top_left',this.IMAGE_TILE);
        this.add('world_road_horizontal',this.IMAGE_TILE);
        this.add('world_road_curve_top_right',this.IMAGE_TILE);
        
        this.add('world_road_vertical',this.IMAGE_TILE);
        this.add('world_road_cross',this.IMAGE_TILE);
        this.add('world_road_dot',this.IMAGE_TILE);

        this.add('world_road_curve_bottom_left',this.IMAGE_TILE);
        this.add('world_mountain',this.IMAGE_TILE);
        this.add('world_road_curve_bottom_right',this.IMAGE_TILE);
        
        this.add('world_water_1',this.IMAGE_TILE);
        
            // sprites
            
        this.add('ball',this.IMAGE_SPRITE);
        this.add('billy_left',this.IMAGE_SPRITE);
        this.add('billy_right',this.IMAGE_SPRITE);
        this.add('billy_world',this.IMAGE_SPRITE);
        this.add('pin',this.IMAGE_SPRITE);
        this.add('block',this.IMAGE_SPRITE);
        this.add('break_block',this.IMAGE_SPRITE);
        this.add('break_block_strong',this.IMAGE_SPRITE);
        this.add('explode_block_0',this.IMAGE_SPRITE);
        this.add('explode_block_1',this.IMAGE_SPRITE);
        this.add('explode_block_2',this.IMAGE_SPRITE);
        this.add('explode_block_3',this.IMAGE_SPRITE);
        this.add('cloud_block',this.IMAGE_SPRITE);
        
        this.add('platform',this.IMAGE_SPRITE);
        this.add('door',this.IMAGE_SPRITE);
        
        this.add('ninja_bunny',this.IMAGE_SPRITE);
        this.add('shurikin',this.IMAGE_SPRITE);
        this.add('drain_pipe_snake_cover',this.IMAGE_SPRITE);
        this.add('drain_pipe_snake_free',this.IMAGE_SPRITE);
        this.add('roto_carrot',this.IMAGE_SPRITE);
        
        this.add('particle_block',this.IMAGE_SPRITE);
        this.add('particle_explode_block',this.IMAGE_SPRITE);
        
        this.add('world_map_spot',this.IMAGE_SPRITE);
        this.add('world_map_castle',this.IMAGE_SPRITE);
        this.add('world_map_block',this.IMAGE_SPRITE);
        
            // UI
            
        this.add('ui_pin',this.IMAGE_UI);
        this.add('ui_banner',this.IMAGE_UI);
    }
    
}
