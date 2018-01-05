import MapClass from '../engine/map.js';
import PlayerClass from '../code/player.js';
import BallClass from '../code/ball.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BlockClass from '../code/block.js';
import cloudBlockClass from '../code/cloud_block.js';
import platformClass from '../code/platform.js';

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
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                                                                      ',
                '                                                                                                           e    BAAC                                  ',
                '                                                                                                    BAACh       ONNP            fffffccccccccc        ',
                '                                                                                   BAACh            ONNP                      fffffccccccccccc        ',
                '                 cc                                       ff                   ggggONNP                                     ffffffffcccccccccc        ',
                '                 ccc                                    cceec        ff ggggggg                                           ffffffffffffcccccccc        ',
                '      BAAC       cddc     ccc        dd        J       ccceeec      ffeff                                               fffffffffffffffccccccc        ',
                '  b   ONNP     ccccccc  cccJcc       de      ccKe    cccceeeecccc  ccceeccc                                         BAAAAAAAAAAAAAAAAAAAAAACccc       ',
                '             BAAAAACcccccccKccc      de     GHHMHHIeeeeeeeeeeeeeeeeeeeecccccc                                    BAADFFFFFFFFFFFFFFFFFFFFFFEACc       ',
                '  a      BAAADFFFFFECccccccLcccc     eeccc  eeeeeeeecccdddcccccccccccccccccccc                                BAADFFFFFFFFFFFFFFFFFFFFFFFFFFEAAAC     ',
                'BAAAAAAAADFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEAAAAC'
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
                '       c   ccc                                                                                                                                        ',
                '  a  ccccBAAAAAAAAAAC                                                                                                                                 ',
                'BAAAAAAAADFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC'
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
                return('ground_grass');
            case 'B':
                return('ground_grass_end_left');
            case 'C':
                return('ground_grass_end_right');
            case 'D':
                return('ground_grass_connect_left');
            case 'E':
                return('ground_grass_connect_right');
            case 'F':
                return('ground_dirt_fill');
            case 'G':
                return('girder_left_horizontal');
            case 'H':
                return('girder_middle_horizontal');
            case 'I':
                return('girder_right_horizontal');
            case 'J':
                return('girder_top_vertical');
            case 'K':
                return('girder_middle_vertical');
            case 'L':
                return('girder_bottom_vertical');
            case 'M':
                return('girder_connect');
            case 'N':
                return('ground_dirt_bottom');
            case 'O':
                return('ground_dirt_bottom_left');
            case 'P':
                return('ground_dirt_bottom_right');
        
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
            case 'g':
                return(new cloudBlockClass());
            case 'h':
                return(new platformClass());
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
