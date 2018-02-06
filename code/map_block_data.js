export default class MapBlockDataClass
{
    constructor(gridX,gridY)
    {
        this.gridX=gridX;
        this.gridY=gridY;
        
        Object.seal(this);
    }
}
