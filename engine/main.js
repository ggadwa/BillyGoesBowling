import GameClass from './game.js';

let game=null;

export function run(gameObj)
{
        // run gets a game object that
        // controls the game, set this to a global
        // for the run loop
        
    game=gameObj;
    
        // start everything up
        
    game.initialize();
    game.prepare();
    window.requestAnimationFrame(runLoop);
}

function runLoop(timestamp)
{
    let id;
    
        // exiting?

    if (game.isCancelled()) return;
    
        // next frame
        
    id=window.requestAnimationFrame(runLoop);

        // run the game
        // all errors stop the main loop
        
    timestamp=Math.trunc(timestamp);
        
    try {    
        game.run(timestamp);
        game.draw(timestamp);
    }
    catch (e) {
        window.cancelAnimationFrame(id);
        throw e;
    }
}
