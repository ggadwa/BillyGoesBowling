export default class ImageListClass
{
    constructor()
    {
        this.images=new Map();
        
        Object.seal(this);
    }
    
    get(name)
    {
        return(this.images.get(name));
    }
    
    loadProcessLoaded(imageList,index,callback)
    {
        index++;
        if (index>=imageList.length) {
            callback();
            return;
        }
            
        this.loadProcess(imageList,index,callback);
    }
    
    loadProcessError(name)
    {
        console.log('Missing Image: '+name);        // this will abort the game loading process
    }
    
    loadProcess(imageList,index,callback)
    {
        let name=imageList[index];
        
        let img=new Image();
        this.images.set(name,img);
        
        img.onload=this.loadProcessLoaded.bind(this,imageList,index,callback);
        img.onerror=this.loadProcessError.bind(this,name);
        img.src='../images/'+name+'.png';
    }
    
    load(imageList,callback)
    {
        this.loadProcess(imageList,0,callback);
    }
    
}
