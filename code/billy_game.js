import GameClass from '../engine/game.js';
import PlayerClass from '../code/player.js';
import PinClass from '../code/pin.js';
import DoorClass from '../code/door.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BlockClass from '../code/block.js';
import CloudBlockClass from '../code/cloud_block.js';
import PlatformClass from '../code/platform.js';
import DrainPipeSnakeClass from '../code/drain_pipe_snake.js';
import NinjaBunnyClass from '../code/ninja_bunny.js';

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
    
    createMapItemForCharacter(ch)
    {
        switch (ch)
        {
                // tiles, return string path
                // an array would be better but it's easy to see the letter like this
                
            case 'A':
                return('ground_grass');
            case 'B':
                return('ground_grass_end_left');
            case 'C':
                return('ground_grass_end_right');
            case 'D':
                return('ground_grass_connect_left');
            case 'E':
                return('ground_grass_connect_right');
            case 'F':
                return('ground_dirt_fill');
            case 'G':
                return('girder_left_horizontal');
            case 'H':
                return('girder_middle_horizontal');
            case 'I':
                return('girder_right_horizontal');
            case 'J':
                return('girder_top_vertical');
            case 'K':
                return('girder_middle_vertical');
            case 'L':
                return('girder_bottom_vertical');
            case 'M':
                return('girder_connect');
            case 'N':
                return('ground_dirt_bottom');
            case 'O':
                return('ground_dirt_bottom_left');
            case 'P':
                return('ground_dirt_bottom_right');
        
                // sprites, return object
                
            case '*':
                return(new PlayerClass(this));
            case 'a':
                return(new DoorClass(this));
            case 'b':
                return(new PinClass(this));
            case 'c':
                return(new BreakBlockClass(this));
            case 'd':
                return(new BreakBlockStrongClass(this));
            case 'e':
                return(new ExplodeBlockClass(this));
            case 'f':
                return(new BlockClass(this));
            case 'g':
                return(new CloudBlockClass(this));
            case 'h':
                return(new PlatformClass(this));
                
            case '1':
                return(new DrainPipeSnakeClass(this));
            case '2':
                return(new NinjaBunnyClass(this));
         }
         
         return(null);
    }
    
    getStartMapName()
    {
        //return('second_pin');
        return('bowling_hub');
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
