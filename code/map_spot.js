import SpriteClass from '../engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapSpotClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.setCurrentImage(this.addImage('world_map_spot'));
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.background=true;           // a background sprite, draws in the same plane as the map
        
            // the door settings, we use the original
            // spawn position of the door for these
           /* 
        this.doorData=new Map();
        
        this.doorData.set(16,new DoorDataClass('My Second Pin','second_pin',1));
        this.doorData.set(28,new DoorDataClass('Snakes on a Plain','snakes_plain',2));
        this.doorData.set(38,new DoorDataClass('Puzzling Bombs','puzzling_bombs',2));
        this.doorData.set(45,new DoorDataClass('The Hills Are Alive With Ninjas','hill_ninja',3));
        this.doorData.set(47,new DoorDataClass('Cloudy with Chance of Ninjas','cloud_ninja',3));
        this.doorData.set(49,new DoorDataClass('The Easy Boss','easy_boss',5));
        */
        Object.seal(this);
    }
    /*
    runAI()
    {
        let data;
        let game=this.getGame();
        
            // are we colliding with player?
            
        if (!game.getMap().checkCollision(this)) return;
        if (this.collideSprite===null) return;
        if (!(this.collideSprite instanceof PlayerSideScrollClass)) return;
            
            // change UI
            
        data=this.doorData.get(this.gridSpawnX);
        if (data===null) return;
        
        if (game.getData('pins')>=data.pinCount) {
            game.setData('door_name',data.title);
        }
        else {
            game.setData('door_name',(data.title+' - Need '+data.pinCount+' Pins'));
        }
    }
    */
}
