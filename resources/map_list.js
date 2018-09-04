export default class MapListClass
{
    constructor(game)
    {
        this.game=game;
        this.maps=new Map();
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.create();
    }
    
    /**
     * Override this to build the list of maps this game will need.
     */
    create()
    {
    }
    
    add(name,map)
    {
        this.maps.set(name,map);
    }
    
    get(name)
    {
        return(this.maps.get(name));
    }
    
}
