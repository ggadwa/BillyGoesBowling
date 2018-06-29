import TileClass from '../engine/tile.js';

export default class TileListClass
{
    constructor(game)
    {
        this.game=game;
        this.tiles=[];
    }

    initialize(callback)
    {
        this.game.fillTileList();
        this.loadProcess(0,callback);
    }
    
    loadProcessLoaded(index,callback)
    {
        index++;
        if (index>=this.tiles.length) {
            callback();
            return;
        }
            
        this.loadProcess(index,callback);
    }
    
    loadProcessError(name)
    {
        alert('Missing Tile Image: '+name);
    }
    
    loadProcess(index,callback)
    {
        let tile=this.tiles[index];
        let name=tile.name;
        
        tile.image=new Image();
        
        tile.image.onload=this.loadProcessLoaded.bind(this,index,callback);
        tile.image.onerror=this.loadProcessError.bind(this,name);
        tile.image.src='images/tiles/'+name+'.png';
    }
    
    add(name,solid)
    {
        this.tiles.push(new TileClass(name,solid));
    }
}
