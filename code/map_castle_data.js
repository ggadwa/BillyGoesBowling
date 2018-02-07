export default class MapCastleDataClass
{
    constructor(title,map,pinCount,mapBlockOpenList,gridX,gridY)
    {
        this.title=title;
        this.map=map;
        this.pinCount=pinCount;
        this.mapBlockOpenList=mapBlockOpenList;
        this.gridX=gridX;
        this.gridY=gridY;
        
        Object.seal(this);
    }
}
