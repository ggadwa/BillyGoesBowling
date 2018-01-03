import MapClass from '../engine/map.js';
import PlayerClass from '../code/player.js';
import BallClass from '../code/ball.js';
import BreakBlockClass from '../code/breakBlock.js';
import BreakBlockStrongClass from '../code/breakBlockStrong.js';
import ExplodeBlockClass from '../code/explodeBlock.js';
import BlockClass from '../code/block.js';
import cloudBlockClass from '../code/cloudBlock.js';

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
                '                 ccc                                    cceec        ff ggggggg                                                                       ',
                '                 cddc     ccc        dd        J       ccceeec      ffeff    gggggg                                                                   ',
                '  b            ccccccc  cccJcc       de      ccKe    cccceeeecccc  ccceeccc       ggggggg                                                             ',
                '             BAAAAACcccccccKccc      de     GHHMHHIeeeeeeeeeeeeeeeeeeeecccccc                                                                         ',
                '  a      BAAADFFFFFECccccccLcccc     eeccc  eeeeeeeecccdddcccccccccccccccccccc                                BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC     ',
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
