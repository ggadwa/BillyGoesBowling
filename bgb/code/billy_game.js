import GameClass from '../../rpjs/engine/game.js';
import PlayerWorldClass from './player_world.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BlockClass from './block.js';
import BreakBlockClass from './break_block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import BreakBlockHalfLeftClass from './break_block_half_left.js';
import BreakBlockHalfRightClass from './break_block_half_right.js';
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
import MapCottageClass from './map_cottage.js';
import MapBlockClass from './map_block.js';
import DrainPipeSnakeClass from './drain_pipe_snake.js';
import NinjaBunnyClass from './ninja_bunny.js';
import RotoCarrotClass from './roto_carrot.js';
import EasterHeadClass from './easter_head.js';
import ExecutionerClass from './executioner.js';
import MrCPUClass from './mr_cpu.js';
import BoneyOneEyeClass from './boney_one_eye.js';
import KangarangClass from './kangarang.js';
import BoomerangClass from './boomerang.js';
import KingGhastlyClass from './king_ghastly.js';
import WorldMainMapClass from '../maps/world_main.js';
import SnakesOnAPlainMapClass from '../maps/snakes_on_a_plain.js';
import ApocalypseCarrotMapClass from '../maps/apocalypse_carrot.js';
import HillsNinjaBunniesMapClass from '../maps/hills_ninja_bunnies.js';
import BuffetOfBlocksMapClass from '../maps/buffet_of_blocks.js';
import ExecutionerCastleMapClass from '../maps/executioners_castle.js';
import PlatformTroubledWatersMapClass from '../maps/platform_troubled_waters.js';
import SurfsUpMapClass from '../maps/surfs_up.js';
import SurfsDownMapClass from '../maps/surfs_down.js';
import HeadsUpMapClass from '../maps/heads_up.js';
import RainingCreepsMapClass from '../maps/raining_creeps.js';
import PuzzlingBlocksMapClass from '../maps/puzzling_blocks.js';
import NinjaJailMapClass from '../maps/ninja_jail.js';
import MrCPUCastleMapClass from '../maps/mr_cpu_castle.js';
import CarrotCatacylismMapClass from '../maps/carrot_catacylism.js';
import SnakePitMapClass from '../maps/snake_pit.js';
import NinjaMountainMapClass from '../maps/ninja_mountain.js';
import BoneyOneEyeCastleMapClass from '../maps/boney_one_eye_castle.js';
import KangarangCastleMapClass from '../maps/kangarang_castle.js';
import Cloud9MapClass from '../maps/cloud_9.js';
import CarrotChorusMapClass from '../maps/carrot_chorus.js';
import RunningAheadMapClass from '../maps/running_ahead.js';
import SpeedwayMapClass from '../maps/speedway.js';
import PlatformPerilMapClass from '../maps/platform_peril.js';
import NinjaHordeMapClass from '../maps/ninja_horde.js';
import SprintAThonMapClass from '../maps/spring_a_thon.js';
import KingGhastlyCastleMapClass from '../maps/king_ghastly_castle.js';

export default class BillyGameClass extends GameClass {

    static BANNER_MODE_FADE_IN=0;
    static BANNER_MODE_FADE_OUT=1;
    static BANNER_MODE_SHOW=2;
    static BANNER_MODE_NONE=3;
        
    static BANNER_FADE_TICK=10;
        
    static HEALTH_IMAGE_LIST=['ui/health_25','ui/health_50','ui/health_75','ui/health_100'];

    constructor() {
        super();
        
        this.bannerTitleText='';
        this.bannerMapName='';
        this.bannerMapRequiredPinCount=0;
        this.bannerMode=BillyGameClass.BANNER_MODE_NONE;
        this.bannerFadeCount=0;
        
        Object.seal(this);
    }
    
    attachResources() {
        this.setResourceBasePath('bgb/');
        
        // image tiles
        this.addImage('tiles/ground_grass_end_left');
        this.addImage('tiles/ground_grass');
        this.addImage('tiles/ground_grass_end_right');
        this.addImage('tiles/ground_grass_connect_left');
        this.addImage('tiles/ground_dirt_fill');
        this.addImage('tiles/ground_grass_connect_right');
        this.addImage('tiles/ground_dirt_bottom_left');
        this.addImage('tiles/ground_dirt_bottom');
        this.addImage('tiles/ground_dirt_bottom_right');
        this.addImage('tiles/girder_left_horizontal');
        this.addImage('tiles/girder_middle_horizontal');
        this.addImage('tiles/girder_right_horizontal');
        this.addImage('tiles/girder_top_vertical');
        this.addImage('tiles/girder_middle_vertical');
        this.addImage('tiles/girder_bottom_vertical');
        this.addImage('tiles/girder_connect');
        this.addImage('tiles/castle_wall');
        this.addImage('tiles/castle_floor');
        this.addImage('tiles/ground_dirt_left');
        this.addImage('tiles/ground_dirt_right');
        this.addImage('tiles/ground_dirt_fill_2');
        this.addImage('tiles/decorate_bush');
        this.addImage('tiles/unused_3');
        this.addImage('tiles/unused_4');
        this.addImage('tiles/unused_5');
        this.addImage('tiles/unused_6');
        this.addImage('tiles/spring_base');
        this.addImage('tiles/world_grass_top_left');
        this.addImage('tiles/world_grass_top');
        this.addImage('tiles/world_grass_top_right');
        this.addImage('tiles/world_grass_left');
        this.addImage('tiles/world_grass');
        this.addImage('tiles/world_grass_right');
        this.addImage('tiles/world_grass_bottom_left');
        this.addImage('tiles/world_grass_bottom');
        this.addImage('tiles/world_grass_bottom_right');
        this.addImage('tiles/world_grass_corner_top_left');
        this.addImage('tiles/world_grass_corner_top_right');
        this.addImage('tiles/world_bridge_horizontal');
        this.addImage('tiles/world_grass_corner_bottom_left');
        this.addImage('tiles/world_grass_corner_bottom_right');
        this.addImage('tiles/world_bridge_vertical');
        this.addImage('tiles/world_road_curve_top_left');
        this.addImage('tiles/world_road_horizontal');
        this.addImage('tiles/world_road_curve_top_right');
        this.addImage('tiles/world_road_vertical');
        this.addImage('tiles/world_road_cross');
        this.addImage('tiles/world_road_dot');
        this.addImage('tiles/world_road_curve_bottom_left');
        this.addImage('tiles/world_mountain');
        this.addImage('tiles/world_road_curve_bottom_right');
        this.addImage('tiles/world_tree');
        this.addImage('tiles/world_gate');
        this.addImage('tiles/arrow_down');
        this.addImage('tiles/world_left_t');
        this.addImage('tiles/world_up_t');
        this.addImage('tiles/world_bridge_center');
        this.addImage('tiles/world_bush');
        
        this.addImage('sprites/ball');
        this.addImage('sprites/billy_walk_1');
        this.addImage('sprites/billy_walk_2');
        this.addImage('sprites/billy_walk_3');
        this.addImage('sprites/billy_jump_1');
        this.addImage('sprites/billy_fall_1');
        this.addImage('sprites/billy_shield');
        this.addImage('sprites/billy_world_1');
        this.addImage('sprites/billy_world_2');
        this.addImage('sprites/billy_world_3');
        this.addImage('sprites/pin');
        this.addImage('sprites/block');
        this.addImage('sprites/break_block');
        this.addImage('sprites/break_block_strong');
        this.addImage('sprites/explode_block_0');
        this.addImage('sprites/explode_block_1');
        this.addImage('sprites/explode_block_2');
        this.addImage('sprites/explode_block_3');
        this.addImage('sprites/cloud_block');
        this.addImage('sprites/platform');
        this.addImage('sprites/door');
        this.addImage('sprites/gravestone');
        this.addImage('sprites/button');
        this.addImage('sprites/spring_close');
        this.addImage('sprites/spring_open');
        this.addImage('sprites/trophy');
        this.addImage('sprites/ninja_bunny');
        this.addImage('sprites/ninja_bunny_jump');
        this.addImage('sprites/shurikin');
        this.addImage('sprites/snake_1');
        this.addImage('sprites/snake_2');
        this.addImage('sprites/snake_pipe_1');
        this.addImage('sprites/snake_pipe_2');
        this.addImage('sprites/roto_carrot_1');
        this.addImage('sprites/roto_carrot_2');
        this.addImage('sprites/bomb');
        this.addImage('sprites/easter_head');
        this.addImage('sprites/easter_head_fire');
        this.addImage('sprites/fish');
        this.addImage('sprites/executioner_1');
        this.addImage('sprites/axe');
        this.addImage('sprites/mr_cpu_1');
        this.addImage('sprites/mr_cpu_2');
        this.addImage('sprites/boney_one_eye');
        this.addImage('sprites/eye');
        this.addImage('sprites/kangarang');
        this.addImage('sprites/boomerang');
        this.addImage('sprites/king_ghastly_1');
        this.addImage('sprites/king_ghastly_2');
        this.addImage('sprites/world_map_spot_red');
        this.addImage('sprites/world_map_spot_yellow');
        this.addImage('sprites/world_map_spot_green');
        this.addImage('sprites/world_map_castle');
        this.addImage('sprites/world_map_castle_locked');
        this.addImage('sprites/world_map_castle_wreck');
        this.addImage('sprites/world_map_cottage');
        this.addImage('sprites/world_map_block');
        this.addImage('sprites/break_block_half_left');
        this.addImage('sprites/break_block_half_right');
        
        this.addImage('particles/block');
        this.addImage('particles/pipe');
        this.addImage('particles/ball');
        this.addImage('particles/fish');
        this.addImage('particles/explode_red');
        this.addImage('particles/explode_orange');
        this.addImage('particles/explode_yellow');
        this.addImage('particles/smoke');
        this.addImage('particles/skull');
        this.addImage('particles/castle');
            
        this.addImage('backgrounds/sun');
        this.addImage('backgrounds/clouds');
        this.addImage('backgrounds/mountains');
        this.addImage('backgrounds/castle');
        this.addImage('backgrounds/water');
        
        this.addImage('ui/pin');
        this.addImage('ui/trophy');
        this.addImage('ui/score_box');
        this.addImage('ui/checkmark');
        this.addImage('ui/health_100');
        this.addImage('ui/health_75');
        this.addImage('ui/health_50');
        this.addImage('ui/health_25');
        this.addImage('ui/banner');
        this.addImage('ui/win_banner');
        
        // sounds
        this.addSound('click');
        this.addSound('crack');
        this.addSound('bomb_tick');
        this.addSound('explode');
        this.addSound('pop');
        this.addSound('boing');
        this.addSound('jump');
        this.addSound('thud');
        this.addSound('boss_appear');
        this.addSound('boss_dead');
        this.addSound('monster_die');
        this.addSound('hurt');
        this.addSound('pipe_break');
        this.addSound('bowl');
        this.addSound('ball_break');
        this.addSound('ball_reform');
        this.addSound('shield');
        this.addSound('teleport');
        this.addSound('locked_castle');
        this.addSound('door');
        this.addSound('pickup');
        this.addSound('splash');
        this.addSound('jet');
        this.addSound('funeral_march');
        
        // music
        this.addMusic('world');
        this.addMusic('map');
        this.addMusic('boss');
        
        // maps
        this.addMap('world_main',new WorldMainMapClass(this));
        this.addMap('snakes_on_a_plain',new SnakesOnAPlainMapClass(this));
        this.addMap('apocalypse_carrot',new ApocalypseCarrotMapClass(this));
        this.addMap('hills_ninja_bunnies',new HillsNinjaBunniesMapClass(this));
        this.addMap('buffet_of_blocks',new BuffetOfBlocksMapClass(this));
        this.addMap('executioners_castle',new ExecutionerCastleMapClass(this));
        
        this.addMap('platform_troubled_waters',new PlatformTroubledWatersMapClass(this));
        this.addMap('surfs_up',new SurfsUpMapClass(this));
        this.addMap('surfs_down',new SurfsDownMapClass(this));
        
        this.addMap('heads_up',new HeadsUpMapClass(this));
        this.addMap('raining_creeps',new RainingCreepsMapClass(this));
        this.addMap('ninja_jail',new NinjaJailMapClass(this));
        this.addMap('puzzling_blocks',new PuzzlingBlocksMapClass(this));
        this.addMap('mr_cpu_castle',new MrCPUCastleMapClass(this));
        
        this.addMap('carrot_catacylism',new CarrotCatacylismMapClass(this));
        this.addMap('snake_pit',new SnakePitMapClass(this));
        this.addMap('ninja_mountain',new NinjaMountainMapClass(this));
        this.addMap('boney_one_eye_castle',new BoneyOneEyeCastleMapClass(this));
        
        this.addMap('kangarang_castle',new KangarangCastleMapClass(this));
        
        this.addMap('cloud_9',new Cloud9MapClass(this));
        this.addMap('carrot_chorus',new CarrotChorusMapClass(this));
        this.addMap('running_ahead',new RunningAheadMapClass(this));
        this.addMap('speedway',new SpeedwayMapClass(this));
        this.addMap('platform_peril',new PlatformPerilMapClass(this));
        this.addMap('ninja_horde',new NinjaHordeMapClass(this));
        this.addMap('spring_a_thon',new SprintAThonMapClass(this));
        this.addMap('king_ghastly_castle',new KingGhastlyCastleMapClass(this));
    }
    
    createData() {
        if (!this.restorePersistedData()) {
            // any new data we need if a new game
        }
    }
    
    getEditorSpritePaletteList() {
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
            new MrCPUClass(this,0,0,null),
            new BoneyOneEyeClass(this,0,0,null),
            new KangarangClass(this,0,0,null),
            new KingGhastlyClass(this,0,0,null),
            new MapSpotClass(this,0,0,null),
            new MapCastleClass(this,0,0,null),
            new MapCottageClass(this,0,0,null),
            new BreakBlockHalfLeftClass(this,0,0,null),
            new BreakBlockHalfRightClass(this,0,0,null)
        ]);
    }
   
    getStartMap() {
        return('world_main');
    }
    
    onMessage(fromSprite,cmd,data) {
        switch (cmd) {
            case 'banner_set':
                this.bannerTitleText=data.title;
                this.bannerMapName=data.map;
                this.bannerMapRequiredPinCount=data.pin;
                this.bannerMode=BillyGameClass.BANNER_MODE_FADE_IN;
                this.bannerFadeCount=BillyGameClass.BANNER_FADE_TICK;
                break;
            case 'banner_clear':
                if ((this.bannerMode!==BillyGameClass.BANNER_MODE_FADE_OUT) && (this.bannerMode!==BillyGameClass.BANNER_MODE_NONE)) { // if already fading or gone, do nothing
                    this.bannerMode=BillyGameClass.BANNER_MODE_FADE_OUT;
                    this.bannerFadeCount=BillyGameClass.BANNER_FADE_TICK;
                }
                break;
        }
    }
    
    onRun(tick) {
        switch (this.bannerMode) {
            case BillyGameClass.BANNER_MODE_FADE_IN:
                this.bannerFadeCount--;
                if (this.bannerFadeCount===0) this.bannerMode=BillyGameClass.BANNER_MODE_SHOW;
                break;
            case BillyGameClass.BANNER_MODE_FADE_OUT:
                this.bannerFadeCount--;
                if (this.bannerFadeCount===0) this.bannerMode=BillyGameClass.BANNER_MODE_NONE;
                break; 
        }
    }
    
    drawUI() {
        let mx,lx,rx,dx,wid;
        let time,min,sec,timeStr;
        let playerSprite=this.map.getPlayerSprite();
        
        // side scrolling UI 
        if (playerSprite instanceof PlayerSideScrollClass) {
            if (playerSprite.health>0) this.drawUIImage(BillyGameClass.HEALTH_IMAGE_LIST[playerSprite.health-1],5,5);
        }
        
        // world UI  
        else {
            this.setupUIText('24px Arial','#000000','right','alphabetic');
            
            this.drawUIImage('ui/score_box',10,(this.canvasHeight-74));
            this.drawUIImage('ui/pin',20,(this.canvasHeight-67));
            this.drawUIText((this.getGameDataCountForPrefix('pin_')+'/21'),110,(this.canvasHeight-33));
            
            this.drawUIImage('ui/score_box',(this.canvasWidth-120),(this.canvasHeight-74));
            this.drawUIImage('ui/trophy',(this.canvasWidth-110),(this.canvasHeight-68));
            this.drawUIText((this.getGameDataCountForPrefix('trophy_')+'/21'),(this.canvasWidth-20),(this.canvasHeight-33));

            if (this.bannerMode!==BillyGameClass.BANNER_MODE_NONE) {
            
                // the alpha
                switch (this.bannerMode) {
                    case BillyGameClass.BANNER_MODE_FADE_IN:
                        this.drawSetAlpha(1.0-(this.bannerFadeCount/BillyGameClass.BANNER_FADE_TICK));
                        break;
                    case BillyGameClass.BANNER_MODE_FADE_OUT:
                        this.drawSetAlpha(this.bannerFadeCount/BillyGameClass.BANNER_FADE_TICK);
                        break;
                }

                // special win banner
                if (this.bannerTitleText===null) {
                    wid=this.imageList.get('ui/win_banner').width;
                    mx=Math.trunc(this.canvasWidth*0.5);
                    lx=mx-Math.trunc(wid*0.5);
                    this.drawUIImage('ui/win_banner',lx,(this.canvasHeight-260));
                }

                // regular banner
                else {
                    wid=this.imageList.get('ui/banner').width;
                    mx=Math.trunc(this.canvasWidth*0.5);
                    lx=mx-Math.trunc(wid*0.5);
                    this.drawUIImage('ui/banner',lx,(this.canvasHeight-74));

                    // checkmark for completing level
                    dx=lx+10;
                    if ((this.getData('pin_'+this.bannerMapName)===true) || (this.getData('boss_'+this.bannerMapName)===true)) {
                        this.drawUIImage('ui/checkmark',dx,(this.canvasHeight-67));
                        dx+=35;
                    }

                    // trophy for getting hidden trophy
                    if (this.getData('trophy_'+this.bannerMapName)===true) {
                        this.drawUIImage('ui/trophy',dx,(this.canvasHeight-67));
                        dx+=35;
                    }

                    // map title
                    this.setupUIText('bolder 36px Arial','#000000','left','alphabetic');
                    this.drawUIText(this.bannerTitleText,dx,(this.canvasHeight-29));

                    // times
                    time=this.getData('time_'+this.bannerMapName);
                    if (time!==null) {
                        min=Math.trunc(time/60.0);
                        sec=time-(min*60.0);
                        timeStr=min+':'+(sec<10?'0':'')+sec.toFixed(2);
                        dx+=(10+this.measureUITextWidth(this.bannerTitleText));
                        this.setupUIText('18px Arial','#000000','left','alphabetic');
                        this.drawUIText(timeStr,dx,(this.canvasHeight-29));
                    }

                    // required pins for bosses
                    if (this.bannerMapRequiredPinCount!==-1) {
                        rx=lx+wid;
                        this.drawUIImage('ui/pin',(rx-36),(this.canvasHeight-67));
                        this.setupUIText('bolder 36px Arial','#000000','right','alphabetic');
                        this.drawUIText(this.bannerMapRequiredPinCount,(rx-41),(this.canvasHeight-29));
                    }
                }

                this.drawSetAlpha(1.0);
            }
        }
    }
}
