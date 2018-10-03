export default class ImageListClass
{
    constructor(game)
    {
        this.game=game;
        
        this.images=new Map();
        
        Object.seal(this);
    }
    
    initialize(callback)
    {
        this.create();
        this.load(callback);
    }
    
    /**
     * Override this to build the list of images this game will need.
     */
    create()
    {
    }
    
    add(name)
    {
        this.images.set(name,new Image());
    }
    
    get(name)
    {
        return(this.images.get(name));
    }
    
    getArrayOfImageByPrefix(prefix)
    {
        let typeImages=[];
        
        this.images.forEach(function(value,key,map) {
           if (key.startsWith(prefix)) typeImages.push(value);
        });
        
        return(typeImages);
    }
    
    loadProcessError(path)
    {
        console.log('Missing Image: '+path);        // this will abort the loading process
    }
    
    loadProcess(keyIter,count,callback)
    {
        let rtn,name,img,path;
        
            // get next key
            
        rtn=keyIter.next();
        if (rtn.done) {
            callback();
            return;
        }
        
        this.game.drawProgress('Loading Images',count,(this.images.size-1));

        name=rtn.value;
        path=this.game.resourceBasePath+'images/'+name+'.png';
        img=this.images.get(name);
        
        img.onload=this.loadProcess.bind(this,keyIter,(count+1),callback);
        img.onerror=this.loadProcessError.bind(this,path);
        img.src=path;
    }
    
    load(callback)
    {
        this.loadProcess(this.images.keys(),0,callback);
    }
    
}
