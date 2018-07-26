import GameClass from '../engine/game.js';
import BillyImageList from '../code/billy_image_list.js';
import BillySoundList from '../code/billy_sound_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';
import PlayerWorldClass from '../code/player_world.js';
import PlayerSideScrollClass from '../code/player_sidescroll.js';
import BlockClass from '../code/block.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import CloudBlockClass from '../code/cloud_block.js';
import ExplodeBlockClass from '../code/explode_block.js';
import PlatformClass from '../code/platform.js';
import DoorClass from '../code/door.js';
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
        this.soundList=new BillySoundList();
        
        Object.seal(this);
    }
    
    createData()
    {
        this.setData('pins',0);             // number of pins
        this.setData('banner_text','');     // banner messages
        this.setData('banner_count',-1);
    }
    
    
    getEditorSpritePaletteList()
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
            new DoorClass(this,0,0,null),
            new PinClass(this,0,0,null),
            new MapSpotClass(this,0,0,null),
            new MapCastleClass(this,0,0,null),
            new MapBlockClass(this,0,0,null),
            new DrainPipeSnakeClass(this,0,0,null),
            new NinjaBunnyClass(this,0,0,null),
            new RotoCarrotClass(this,0,0,null),
        ]);
    }
   
    getStartMap()
    {
        return(new WorldMainMapClass(this));
        //return(new BuffetOfBlocksMapClass(this));
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
            
        this.drawUIImage('ui/pin',(this.canvasWidth-110),2);
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
            this.drawUIImage('ui/banner',lx,(this.canvasHeight-70));
            
            pinCount=this.getData('banner_pin_count');
            if (pinCount===-1) {
                this.setupUIText('bolder 36px Arial','#000000','center','alphabetic');
                this.drawUIText(this.getData('banner_text'),mx,(this.canvasHeight-25));
            }
            else {
                this.setupUIText('bolder 36px Arial','#000000','left','alphabetic');
                this.drawUIText(this.getData('banner_text'),(lx+5),(this.canvasHeight-25));
                
                rx=lx+wid;
                this.drawUIImage('ui/pin',(rx-95),(this.canvasHeight-55));
                this.drawUIText(('x '+pinCount),(rx-60),(this.canvasHeight-25));
            }
            
            this.drawSetAlpha(1.0);
        }
    }
}
