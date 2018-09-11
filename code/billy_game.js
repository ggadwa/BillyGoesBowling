import GameClass from '../engine/game.js';
import BillyImageList from './billy_image_list.js';
import BillySoundList from './billy_sound_list.js';
import BillyMapList from './billy_map_list.js';
import WorldMainMapClass from '../maps/world_main.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';
import PlayerWorldClass from './player_world.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BlockClass from './block.js';
import BreakBlockClass from './break_block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import CloudBlockClass from './cloud_block.js';
import ExplodeBlockClass from './explode_block.js';
import PlatformClass from './platform.js';
import DoorClass from './door.js';
import PinClass from './pin.js';
import TrophyClass from './trophy.js';
import ButtonClass from './button.js';
import SpringClass from './spring.js';
import MapSpotClass from './map_spot.js';
import MapCastleClass from './map_castle.js';
import MapBlockClass from './map_block.js';
import DrainPipeSnakeClass from './drain_pipe_snake.js';
import NinjaBunnyClass from './ninja_bunny.js';
import RotoCarrotClass from './roto_carrot.js';
import EasterHeadClass from './easter_head.js';
import ExecutionerClass from './executioner.js';
import SirBawkBawkClass from './sir_bawk_bawk.js';
import BoneyOneEyeClass from './boney_one_eye.js';

export default class BillyGameClass extends GameClass
{
    constructor()
    {
        super();
        
        this.imageList=new BillyImageList(this);
        this.soundList=new BillySoundList(this);
        this.mapList=new BillyMapList(this);
        
        this.HEALTH_IMAGE_LIST=['ui/health_25','ui/health_50','ui/health_75','ui/health_100'];
        
        Object.seal(this);
    }
    
    createData()
    {
        this.setData('pins',0);                 // number of pins
        this.setData('trophies',0);             // number of trophies
        this.setData('player_health',4);
        this.setData('banner_text','');         // banner messages
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
            new ButtonClass(this,0,0,null),
            new SpringClass(this,0,0,null),
            new TrophyClass(this,0,0,null),
            new DrainPipeSnakeClass(this,0,0,null),
            new NinjaBunnyClass(this,0,0,null),
            new RotoCarrotClass(this,0,0,null),
            new EasterHeadClass(this,0,0,null),
            new ExecutionerClass(this,0,0,null),
            new SirBawkBawkClass(this,0,0,null),
            new BoneyOneEyeClass(this,0,0,null),
            new MapSpotClass(this,0,0,null),
            new MapCastleClass(this,0,0,null)
        ]);
    }
   
    getStartMap()
    {
        //return(this.mapList.get('world_main'));
        //return(this.mapList.get('snakes_on_a_plain'));
        //return(this.mapList.get('apocalypse_carrot'));
        //return(this.mapList.get('buffet_of_blocks'));
        //return(this.mapList.get('hills_ninja_bunnies'));
        return(this.mapList.get('executioners_castle'));
        //return(this.mapList.get('heads_up'));
        //return(this.mapList.get('platform_troubled_waters'));
        //return(this.mapList.get('surfs_up'));
        //return(this.mapList.get('surfs_down'));
        //return(this.mapList.get('heads_up'));

        //return(this.mapList.get('raining_creeps'));
        //return(this.mapList.get('puzzling_blocks'));
        //return(this.mapList.get('ninja_jail'));
        //return(this.mapList.get('sir_bawk_bawk_castle'));
        
        //return(this.mapList.get('boney_one_eye_castle'));

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
        let count,mx,lx,rx,wid,pinCount,trophyCount,health;
        let playerSprite=this.map.getSpritePlayer();
        
            // side scrolling UI
            
        if (playerSprite instanceof PlayerSideScrollClass) {
            health=this.getData('player_health');
            if (health>0) this.drawUIImage(this.HEALTH_IMAGE_LIST[health-1],5,5);
        }
        
            // world UI
            
        else {
            this.drawUIImage('ui/pin',(this.canvasWidth-100),5);

            pinCount=this.getData('pins');
            this.setupUIText('24px Arial','#000000','left','alphabetic');
            if (pinCount<10) {
                this.drawUIText(('x 0'+pinCount),(this.canvasWidth-65),38);
            }
            else {
                this.drawUIText(('x '+pinCount),(this.canvasWidth-65),38);
            }
            
            this.drawUIImage('ui/trophy',(this.canvasWidth-100),(this.canvasHeight-65));
            
            trophyCount=this.getData('trophies');
            this.setupUIText('24px Arial','#000000','left','alphabetic');
            if (trophyCount<10) {
                this.drawUIText(('x 0'+trophyCount),(this.canvasWidth-65),(this.canvasHeight-32));
            }
            else {
                this.drawUIText(('x '+trophyCount),(this.canvasWidth-65),(this.canvasHeight-32));
            }
        }
        
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
                
            wid=this.imageList.get('ui/banner').width;
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
                this.drawUIImage('ui/pin',(rx-120),(this.canvasHeight-65));
                
                if (pinCount<10) {
                    this.drawUIText(('x 0'+pinCount),(rx-80),(this.canvasHeight-25));
                }
                else {
                    this.drawUIText(('x '+pinCount),(rx-80),(this.canvasHeight-25));
                }
            }
            
            this.drawSetAlpha(1.0);
        }
    }
}
