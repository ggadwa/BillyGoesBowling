export default class MapListClass
{
    constructor()
    {
        this.maps=new Map();
        
        Object.seal(this);
    }
    
    initialize(game)
    {
        this.create(game);
    }
    
    /**
     * Override this to build the list of maps this game will need.
     */
    create(game)
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
