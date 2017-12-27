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
        this.addTile(game.loadImage('../images/girder_bottom_vertical.png'));           // M
        this.addTile(game.loadImage('../images/girder_connect.png'));                   // N
        
            // controllers for this map
                
        this.addController(new PlayerClass());              // a (always the player)
        this.addController(new BallClass());                // b
        this.addController(new BreakBlockClass());          // c
        this.addController(new ExplodeBlockClass());        // d
        
            // the map itself
    
        this.setMapFromText(game,
            [
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                 cc                                       cc                                                                                          ',
                '                 ccc                                    ccddc        cc                                                                               ',
                '                 cccc     ccc                  d       cccdddc      ccdcc                                                                             ',
                '  b             cccccc  cccJcc                dJd    ccccddddcccc  cccddccc                                                                           ',
                '             BAAAAACcccccccKccc               dKdddddddddddddddddddddddcccccc                                                                         ',
                '  a      BAAAFFFFFFECccccccMcccc              dMcccccccccccccccccccccccccccccc                                AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA     ',
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
}
