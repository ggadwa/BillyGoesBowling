export default class SpriteClass
{
    constructor(name,imageNames)
    {
        this.name=name;
        this.imageNames=imageNames;
        this.images=[];
    }
    
    loadImages(callback)
    {
        this.loadProcessLoaded(-1,callback);
    }
    
    loadProcessLoaded(index,callback)
    {
        index++;
        if (index>=this.imageNames.length) {
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
        let img=new Image();
        
        this.images[index]=img;
        
        img.onload=this.loadProcessLoaded.bind(this,index,callback);
        img.onerror=this.loadProcessError.bind(this,name);
        img.src='images/sprites/'+this.imageNames[index]+'.png';
    }
    

}
