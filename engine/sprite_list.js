import SpriteClass from './sprite.js';

export default class SpriteListClass
{
    constructor(game)
    {
        this.game=game;
        this.sprites=[];
    }

    initialize(callback)
    {
        this.game.fillSpriteList();
        this.loadProcess(0,callback);
    }
    
    loadProcessLoaded(index,callback)
    {
        index++;
        if (index>=this.sprites.length) {
            callback();
            return;
        }
            
        this.loadProcess(index,callback);
    }
    
    loadProcessError(name)
    {
        alert('Missing Sprite Image: '+name);
    }
    
    loadProcess(index,callback)
    {
        let sprite=this.sprites[index];
        let name=sprite.name;
        
        sprite.images.push(new Image());
        
        sprite.images[0].onload=this.loadProcessLoaded.bind(this,index,callback);
        sprite.images[0].onerror=this.loadProcessError.bind(this,name);
        sprite.images[0].src='images/sprites/'+name+'.png';
    }
    
    add(name)
    {
        this.sprites.push(new SpriteClass(name));
    }
}
