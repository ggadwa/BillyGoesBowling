export default class ControllerClass
{
    constructor()
    {
    }
    
    /**
     * Sets up this game sprite.  Add in images here.
     */
    initialize(game,sprite)
    {
    }
    
    /**
     * A gravity factor of 0.0 = object is static, no gravity
     */
    getGravityFactor()
    {
        return(0.0);
    }
    
    /**
     * Can this object collide with other objects?
     */
    canCollide()
    {
        return(true);
    }
    
    /**
     * Called when another sprite is interacting with this one, this
     * is up to the game developer what this means.
     */
    interactWithSprite(sprite,interactSprite,dataObj)
    {
    }
    
    /**
     * Called for each physics tick.
     */
    run(game,sprite,timestamp)
    {
    }
}
