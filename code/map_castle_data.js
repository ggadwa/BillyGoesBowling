export default class MapCastleDataClass
{
    constructor(title,pinCount,mapBlockOpenList,gridX,gridY)
    {
        this.title=title;
        this.pinCount=pinCount;
        this.mapBlockOpenList=mapBlockOpenList;
        this.gridX=gridX;
        this.gridY=gridY;
        
        Object.seal(this);
    }
}
