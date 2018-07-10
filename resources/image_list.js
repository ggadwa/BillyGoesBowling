export default class ImageListClass
{
    constructor()
    {
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
    
    loadProcess(keyIter,callback)
    {
        let rtn,name,img,path;
        
            // get next key
            
        rtn=keyIter.next();
        if (rtn.done) {
            callback();
            return;
        }

        name=rtn.value;
        path='images/'+name+'.png';
        img=this.images.get(name);
        
        img.onload=this.loadProcess.bind(this,keyIter,callback);
        img.onerror=this.loadProcessError.bind(this,path);
        img.src=path;
    }
    
    load(callback)
    {
        this.loadProcess(this.images.keys(),callback);
    }
    
}
