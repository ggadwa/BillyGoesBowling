import GameClass from '../engine/game.js';
import BillyImageList from '../code/billy_image_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import PlayerWorldClass from '../code/player_world.js';
import PlayerSideScrollClass from '../code/player_world.js';
import BlockClass from '../code/block.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import CloudBlockClass from '../code/cloud_block.js';
import ExplodeBlockClass from '../code/explode_block.js';
import PlatformClass from '../code/platform.js';
import PinClass from '../code/pin.js';
import MapSpotClass from '../code/map_spot.js';
import MapCastleClass from '../code/map_castle.js';
import MapBlockClass from '../code/map_block.js';
import DrainPipeSnakeClass from '../code/drain_pipe_snake.js';
import NinjaBunnyClass from '../code/ninja_bunny.js';
import RotoCarrotClass from '../code/roto_carrot.js';

export default class BillyGameClass extends GameClass
{
    constructor()
    {
        super();
        
        this.imageList=new BillyImageList();
        
        Object.seal(this);
    }
    
    createData()
    {
        this.setData('pins',0);             // number of pins
        this.setData('banner_text','');     // banner messages
        this.setData('banner_count',-1);
    }
    
    
    fillSpriteList()
    {
        this.spriteList.add('ball',['ball']);
        this.spriteList.add('billySideScroll',['billy_left']);
        this.spriteList.add('billyWorld',['billy_world']);
        this.spriteList.add('pin',['pin']);
        this.spriteList.add('block',['block']);
        this.spriteList.add('breakBlock',['break_block']);
        this.spriteList.add('breakBlockStrong',['break_block_strong']);
        this.spriteList.add('explodeBlock',['explode_block','explode_block_1','explode_block_2','explode_block_3']);
        this.spriteList.add('cloudBlock',['cloud_block']);
        
        this.spriteList.add('worldMapSpot',['world_map_spot']);
        this.spriteList.add('worldMapCastle',['world_map_castle']);
        this.spriteList.add('worldMapBlock',['world_map_block']);
        this.spriteList.add('platform',['platform']);
        
        this.spriteList.add('ninjaBunny',['ninja_bunny']);
        this.spriteList.add('drainPipeSnake',['drain_pipe_snake_cover']);
        this.spriteList.add('rotoCarrot',['roto_carrot']);
    }
    
    getEditorEntityPaletteList()
    {
        return([
            new PlayerWorldClass(this,0,0,null),
            new PlayerSideScrollClass(this,0,0,null),
            new BlockClass(this,0,0,null),
            new BreakBlockClass(this,0,0,null),
            new BreakBlockStrongClass(this,0,0,null),
            new CloudBlockClass(this,0,0,null),
            new ExplodeBlockClass(this,0,0,null),
            new PlatformClass(this,0,0,null),
            new PinClass(this,0,0,null),
            new MapSpotClass(this,0,0,null),
            new MapCastleClass(this,0,0,null),
            new MapBlockClass(this,0,0,null),
            new DrainPipeSnakeClass(this,0,0,null),
            new NinjaBunnyClass(this,0,0,null),
            new RotoCarrotClass(this,0,0,null),
        ]);
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
                'world_grass_corner_top_left',
                'world_grass_corner_top_right',
                'world_grass_corner_bottom_left',
                'world_grass_corner_bottom_right',
                'world_water_1',
                'world_water_2',
                'world_water_3',
                'world_water_4',
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
    
    setBanner(str,pinCount)
    {   
        let count=this.getData('banner_count');
        
        if (count===-1) {
            this.setData('banner_count',0);
        }
        else {
            if (count>=10) this.setData('banner_count',10);
        }
        
        this.setData('banner_text',str);
        this.setData('banner_pin_count',pinCount);
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
        let count,mx,lx,rx,wid,pinCount;
        
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
                
            wid=this.getImageList().get('ui_banner').width;
            mx=Math.trunc(this.canvasWidth*0.5);
            lx=mx-Math.trunc(wid*0.5);
            this.drawUIImage('ui_banner',lx,(this.canvasHeight-70));
            
            pinCount=this.getData('banner_pin_count');
            if (pinCount===-1) {
                this.setupUIText('bolder 36px Arial','#000000','center','alphabetic');
                this.drawUIText(this.getData('banner_text'),mx,(this.canvasHeight-25));
            }
            else {
                this.setupUIText('bolder 36px Arial','#000000','left','alphabetic');
                this.drawUIText(this.getData('banner_text'),(lx+5),(this.canvasHeight-25));
                
                rx=lx+wid;
                this.drawUIImage('ui_pin',(rx-95),(this.canvasHeight-55));
                this.drawUIText(('x '+pinCount),(rx-60),(this.canvasHeight-25));
            }
            
            this.drawSetAlpha(1.0);
        }
    }
}
