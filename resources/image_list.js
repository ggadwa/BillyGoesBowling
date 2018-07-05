import ImageClass from '../resources/image.js';

export default class ImageListClass
{
    constructor()
    {
        this.IMAGE_TILE=0;
        this.IMAGE_SPRITE=1;
        this.IMAGE_UI=2;
        
        this.images=[];
        
        Object.seal(this);
    }
    
    initialize(callback)
    {
        this.fillImageList();
        this.load(callback);
    }
    
    fillImageList()
    {
    }
    
    add(name,imgType)
    {
        this.images.push(new ImageClass(name,imgType));
    }
    
    get(name,imgType)
    {
        let image;
        
        for (image of this.images) {
            if ((image.name===name) && (image.imgType===imgType)) return(image);
        }
        
        return(null);
    }
    
    getArrayOfImageType(imgType)
    {
        let image;
        let typeImages=[];
        
        for (image of this.images) {
            if (image.imgType===imgType) typeImages.push(image);
        }
        
        return(typeImages);
    }
    
    loadProcessLoaded(index,callback)
    {
        index++;
        if (index>=this.images.length) {
            callback();
            return;
        }
            
        this.loadProcess(index,callback);
    }
    
    loadProcessError(fileName)
    {
        console.log('Missing Image: '+fileName);        // this will abort the loading process
    }
    
    loadProcess(index,callback)
    {
        let image=this.images[index];
        let fileName=null;
        
        switch (image.imgType) {
            case this.IMAGE_TILE:
                fileName='images/tiles/'+image.name+'.png';
                break;
            case this.IMAGE_SPRITE:
                fileName='images/sprites/'+image.name+'.png';
                break;
            case this.IMAGE_UI:
                fileName='images/ui/'+image.name+'.png';
                break;
        }
        
        image.img.onload=this.loadProcessLoaded.bind(this,index,callback);
        image.img.onerror=this.loadProcessError.bind(this,fileName);
        image.img.src=fileName;
    }
    
    load(callback)
    {
        this.loadProcess(0,callback);
    }
    
}
