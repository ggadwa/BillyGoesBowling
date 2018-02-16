import GameClass from '../engine/game.js';
import WorldMainMapClass from '../maps/world_main.js';

export default class BillyGameClass extends GameClass
{
    constructor()
    {
        super();
        
        Object.seal(this);
    }
    
    createData()
    {
        this.setData('pins',0);             // number of pins
        this.setData('banner_text','');     // banner messages
        this.setData('banner_count',-1);
    }
    
    getPreloadImages()
    {
        return(
            [
                'ball',
                'billy_left',
                'billy_right',
                'billy_world',
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
                'world_map_spot',
                'world_map_castle',
                'world_map_block',
                'world_grass',
                'world_grass_left',
                'world_grass_right',
                'world_grass_top',
                'world_grass_bottom',
                'world_grass_top_left',
                'world_grass_top_right',
                'world_grass_bottom_left',
                'world_grass_bottom_right',
                'world_mountain',
                'world_bridge_horizontal',
                'world_bridge_vertical',
                'world_water',
                'ui_pin',
                'ui_banner'
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
    }
    
    setBanner(str)
    {   
        let count=this.getData('banner_count');
        
        if (count===-1) {
            this.setData('banner_count',0);
        }
        else {
            if (count>=10) this.setData('banner_count',10);
        }
        
        this.setData('banner_text',str);

    }
    
    runAI()
    {
        let bannerCount;
        
            // run any banners
        
        bannerCount=this.getData('banner_count');

        if (bannerCount!==-1) {
            bannerCount++;
            this.setData('banner_count',((bannerCount>=20)?-1:bannerCount));
        }
    }
    
    drawUI()
    {
        let count,mx,wid;
        
            // the pin readout
            
        this.drawUIImage('ui_pin',(this.canvasWidth-110),2);
        this.setupUIText('24px Arial','#000000','left','alphabetic');
        this.drawUIText(('x '+this.getData('pins')),(this.canvasWidth-75),25);
        
            // banners
            
        count=this.getData('banner_count');
        if (count!==-1) {
            
                // the alpha
                
            if (count<10) {
                this.drawSetAlpha(count/10);
            }
            else {
                if (count>10) this.drawSetAlpha(1.0-((count-10)/10));
            }
            
                // the banner
                
            mx=Math.trunc(this.canvasWidth*0.5);
            wid=this.getImageList().get('ui_banner').width;
            this.drawUIImage('ui_banner',(mx-Math.trunc(wid*0.5)),(this.canvasHeight-70));
            this.setupUIText('bolder 36px Arial','#000000','center','alphabetic');
            this.drawUIText(this.getData('banner_text'),mx,(this.canvasHeight-27));
            
            this.drawSetAlpha(1.0);
        }
    }
}
