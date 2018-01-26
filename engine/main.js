import GameClass from './game.js';

let game=null;

export function run(gameObj)
{
        // run gets a game object that
        // controls the game, set this to a global
        // for the run loop
        
    game=gameObj;
    
        // loading the images is
        // async and requires a callback
        
    game.getImageList().load(game.getPreloadImages(),run2);
}

function run2()
{
        // loading the sounds is
        // async and requires a callback
        
    game.getSoundList().load(game.getPreloadSounds(),run3);
}

function run3()
{
        // loading the maps is
        // async and requires a callback
        
    game.getMapList().load(game.getPreloadMaps(),run4);
}
   
function run4()
{
    game.initialize();
    
    window.requestAnimationFrame(initTiming);
}

function initTiming(timestamp)
{
    game.initTiming(timestamp);
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
        game.setTimestamp(timestamp);
        game.run();
        game.draw();
    }
    catch (e) {
        window.cancelAnimationFrame(id);
        throw e;
    }
}