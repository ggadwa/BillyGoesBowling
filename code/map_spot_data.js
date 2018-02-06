export default class MapSpotDataClass
{
    constructor(title,mapName,gridX,gridY)
    {
        this.title=title;
        this.mapName=mapName;
        this.gridX=gridX;
        this.gridY=gridY;
        
        Object.seal(this);
    }
}
