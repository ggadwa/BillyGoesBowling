export default class MapBlockDataClass
{
    constructor(title,fileName,pinCount,gridX,gridY)
    {
        this.title=title;
        this.fileName=fileName;
        this.pinCount=pinCount;
        this.gridX=gridX;
        this.gridY=gridY;
        
        Object.seal(this);
    }
}
