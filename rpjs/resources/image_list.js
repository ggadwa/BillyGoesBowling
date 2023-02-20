export default class ImageListClass {

    constructor(game) {
        this.game=game;
        
        this.images=new Map();
        
        Object.seal(this);
    }
    
    async initialize() {
        let name,url,img,promises;

        // gather all image loads into promises
        promises=[];
        
        for (name of this.images.keys()) {
            url=this.game.resourceBasePath+'images/'+name+'.png';
            
            img=this.images.get(name);
            img.src=url;
            promises.push(
                img.decode()
                    .then(
                        ()=>{},
                        ()=>{ throw new Error('File not found: '+url) }
                    )
                );
        }
        
        await Promise.all(promises);
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
