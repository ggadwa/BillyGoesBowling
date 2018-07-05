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
    
    loadProcess(index,callback)
    {
        let sprite=this.sprites[index];
        sprite.loadImages(this.loadProcessLoaded.bind(this,index,callback));
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
    
    add(name,imageNames)
    {
        this.sprites.push(new SpriteClass(name,imageNames));
    }
    
    get(name)
    {
        let sprite;
        
        for (sprite of this.sprites)
        {
            if (sprite.name===name) return(sprite);
        }
        
        return(null);
    }
}
