export default class ImageClass
{
    constructor(name,imgType)
    {
        this.name=name;
        this.imgType=imgType;
        this.img=new Image();
        
        Object.seal(this);
    }
}
