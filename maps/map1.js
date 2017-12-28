import MapClass from '../engine/map.js';
import PlayerClass from '../code/player.js';
import BallClass from '../code/ball.js';
import BreakBlockClass from '../code/breakblock.js';
import ExplodeBlockClass from '../code/explodeblock.js';

export default class Map1Class extends MapClass
{
    constructor(gridPixelSize)
    {
        super(gridPixelSize);
    }
    
    initialize(game)
    {
        super.initialize();
        
            // tiles for this map
            
        this.addTile(game.loadImage('../images/ground_grass.png'));                     // A
        this.addTile(game.loadImage('../images/ground_grass_end_left.png'));            // B
        this.addTile(game.loadImage('../images/ground_grass_end_right.png'));           // C
        this.addTile(game.loadImage('../images/ground_grass_connect_left.png'));        // D
        this.addTile(game.loadImage('../images/ground_grass_connect_right.png'));       // E
        this.addTile(game.loadImage('../images/ground_dirt_fill.png'));                 // F
        this.addTile(game.loadImage('../images/girder_left_horizontal.png'));           // G
        this.addTile(game.loadImage('../images/girder_middle_horizontal.png'));         // H
        this.addTile(game.loadImage('../images/girder_right_horizontal.png'));          // I
        this.addTile(game.loadImage('../images/girder_top_vertical.png'));              // J
        this.addTile(game.loadImage('../images/girder_middle_vertical.png'));           // K
        this.addTile(game.loadImage('../images/girder_bottom_vertical.png'));           // L
        this.addTile(game.loadImage('../images/girder_connect.png'));                   // M
        
            // the map itself
    
        this.setMapFromText(game,
            [
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                 cc                                       cc                                                                                          ',
                '                 ccc                                    ccddc        cc                                                                               ',
                '                 cccc     ccc                  J       cccdddc      ccdcc                                                                             ',
                '  b            dcccccc  cccJcc               cdKd    ccccddddcccc  cccddccc                                                                           ',
                '             BAAAAACcccccccKccc             ccdMHHIddddddddddddddddddddcccccc                                                                         ',
                '  a      BAAAFFFFFFECccccccLcccc     ccccc  ddddddddcccccccccccccccccccccccccc                                AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA     ',
                'BAAAAAAAAFFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC'
            ]
        );

        /*
        this.setMapFromText(game,
            [
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '  b         c                                                                                                                                         ',
                '       c   c                                                                                                                                          ',
                '  a  c c                                                                                                                                              ',
                'BAAAAAAAAFFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC'
            ]
        );
        */
    }
    
    createSpriteForCharacterIndex(idx)
    {
        switch (idx)
        {
            case 0:
                return(new PlayerClass());              // a (always the player)
            case 1:
                return(new BallClass());                // b
            case 2:
                return(new BreakBlockClass());          // c
            case 3:
                return(new ExplodeBlockClass());        // d
         }
         
         return(null);
    }
}
