import MapClass from '../engine/map.js';
import PlayerClass from '../code/player.js';
import BallClass from '../code/ball.js';
import BreakBlockClass from '../code/breakblock.js';
import BreakBlockStrongClass from '../code/breakblockstrong.js';
import ExplodeBlockClass from '../code/explodeblock.js';
import BlockClass from '../code/block.js';

export default class Map1Class extends MapClass
{
    constructor(game,gridPixelSize)
    {
        super(game,gridPixelSize);
    }
    
    initialize()
    {
        super.initialize();
        
            // the map itself
    
        this.setMapFromText('a',
            [
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                 cc                                       ff                                                                                          ',
                '                 ccc                                    cceec        ff                                                                               ',
                '                 cddc     ccc        dd        J       ccceeec      ffeff                                                                             ',
                '  b            ccccccc  cccJcc       de      ccKe    cccceeeecccc  ccceeccc                                                                           ',
                '             BAAAAACcccccccKccc      de     GHHMHHIeeeeeeeeeeeeeeeeeeeecccccc                                                                         ',
                '  a      BAAAFFFFFFECccccccLcccc     eeccc  eeeeeeeecccdddcccccccccccccccccccc                                AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA     ',
                'BAAAAAAAAFFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC'
            ]
        );

        /*
        this.setMapFromText('a',
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
    
    createMapItemForCharacter(ch)
    {
        switch (ch)
        {
                // tiles, return string path
                // an array would be better but it's easy to see the letter like this
                
            case 'A':
                return('../images/ground_grass.png');
            case 'B':
                return('../images/ground_grass_end_left.png');
            case 'C':
                return('../images/ground_grass_end_right.png');
            case 'D':
                return('../images/ground_grass_connect_left.png');
            case 'E':
                return('../images/ground_grass_connect_right.png');
            case 'F':
                return('../images/ground_dirt_fill.png');
            case 'G':
                return('../images/girder_left_horizontal.png');
            case 'H':
                return('../images/girder_middle_horizontal.png');
            case 'I':
                return('../images/girder_right_horizontal.png');
            case 'J':
                return('../images/girder_top_vertical.png');
            case 'K':
                return('../images/girder_middle_vertical.png');
            case 'L':
                return('../images/girder_bottom_vertical.png');
            case 'M':
                return('../images/girder_connect.png');
        
                // sprites, return object
                
            case 'a':
                return(new PlayerClass());
            case 'b':
                return(new BallClass());
            case 'c':
                return(new BreakBlockClass());
            case 'd':
                return(new BreakBlockStrongClass());
            case 'e':
                return(new ExplodeBlockClass());
            case 'f':
                return(new BlockClass());
         }
         
         return(null);
    }
    
    getMinGravityValue()
    {
        return(2);
    }
    
    getMaxGravityValue()
    {
        return(15);
    }
}
