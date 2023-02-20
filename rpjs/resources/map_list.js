export default class MapListClass {

    constructor(game) {
        this.game=game;
        this.maps=new Map();
        
        Object.seal(this);
    }
    
    initialize() {
    }
    
    add(name,map) {
        map.name=name;
        this.maps.set(name,map);
    }
    
    get(name) {
        return(this.maps.get(name));
    }
    
}
