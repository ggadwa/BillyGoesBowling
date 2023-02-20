export default class ImageListClass {

    constructor(game) {
        this.game=game;
        
        this.images=new Map();
        
        Object.seal(this);
    }
    
    async initialize() {
        let name,img;
        let count;
        
        count=0;
        
        for (name of this.images.keys()) {
            this.game.drawProgress('Loading Images',count,(this.images.size-1));
            
            img=this.images.get(name);
            img.src=this.game.resourceBasePath+'images/'+name+'.png';
            try {
                await img.decode();
            }
            catch (e) {
                throw new Error('Missing image png: '+img.src);
            }
            
            count++;
        }
    }
    
    add(name) {
        this.images.set(name,new Image());
    }
    
    get(name) {
        return(this.images.get(name));
    }
    
    getArrayOfImageByPrefix(prefix) {
        let typeImages=[];
        
        this.images.forEach(function(value,key,map) {
           if (key.startsWith(prefix)) typeImages.push(value);
        });
        
        return(typeImages);
    }
}
