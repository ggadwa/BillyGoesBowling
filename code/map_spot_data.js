export default class MapSpotDataClass
{
    constructor(title,map,gridX,gridY)
    {
        this.title=title;
        this.map=map;
        this.gridX=gridX;
        this.gridY=gridY;
        
        Object.seal(this);
    }
}
