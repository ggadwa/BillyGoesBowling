import ControllerClass from '../engine/controller.js';

export default class ElevatorClass extends ControllerClass
{
    constructor(stations)
    {
        super();
        
        this.stations=stations;
        this.currentStation=0;
        this.waitTick=33;
        
        Object.seal(this);
    }
    
    initialize(game,sprite)
    {
            // start at the first station
            
        this.currentStation=0;
        this.waitTick=33;
        
            // load the elevator image
            
        let imgIdx;
        
        imgIdx=sprite.addImage(game.loadImage('../images/elevator.png'));
        sprite.setCurrentImage(imgIdx);            
    }
    
    run(game,sprite,timestamp)
    {
        let y,nextY,nextIdx;
        
            // waiting at a station
            
        this.waitTick--;
        if (this.waitTick>0) return;
        
            // moving to station
            
        nextIdx=this.currentStation+1;
        if (nextIdx===this.stations.length) nextIdx=0;
            
        y=sprite.getY();
        nextY=this.stations[nextIdx];
            
        sprite.move(0,((y>nextY)?-4:4));
        
            // at station?
            
        if (sprite.getY()===nextY) {
            this.currentStation=nextIdx;
            this.waitTick=33;
        }
    }
}
