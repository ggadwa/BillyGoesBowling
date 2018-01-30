import GameClass from '../engine/game.js';
import WorldMainMapClass from '../maps/world_main.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';

export default class BillyGameClass extends GameClass
{
    constructor()
    {
        super();
        
        this.setData('pins',0);             // number of pins
        this.setData('door_name','');
        
        Object.seal(this);
    }
    
    getPreloadImages()
    {
        return(
            [
                'ball',
                'billy_left',
                'billy_right',
                'pin',
                'door',
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
                'platform',
                'ninja_bunny',
                'shurikin',
                'drain_pipe_snake_cover',
                'drain_pipe_snake_free',
                'roto_carrot',
                'world_dot',
                'world_grass',
                'world_grass_left',
                'world_grass_right',
                'world_grass_top',
                'world_grass_bottom',
                'world_grass_top_left',
                'world_grass_top_right',
                'world_grass_bottom_left',
                'world_grass_bottom_right',
                'world_water',
                'ui_pin'
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
    
    getPreloadMaps()
    {
        return(
            [
                'bowling_hub',
                'second_pin',
                'snakes_plain',
                'puzzling_bombs',
                'hill_ninja',
                'cloud_ninja',
                'easy_boss'
            ]
        );
    }
    
    getStartMap()
    {
        return(new WorldMainMapClass(this));
        //return(new BuffetOfBlocksMapClass(this));
    }
    
    runAI()
    {
            // clear the door name
            
        this.setData('door_name','');
    }
    
    drawUI()
    {
        let str;
        
            // the pin readout
            
        this.drawUIImage('ui_pin',(this.canvasWidth-110),2);
        this.setupUIText('24px Arial','#000000','left','alphabetic');
        this.drawUIText(('x '+this.getData('pins')),(this.canvasWidth-75),25);
        
            // the door text
            
        str=this.getData('door_name');
        if (str.length!==0) {
            this.setupUIText('bolder 36px Arial','#000000','center','alphabetic');
            this.drawUIText(str,Math.trunc(this.canvasWidth*0.5),(this.canvasHeight-40));
        }
    }
}
