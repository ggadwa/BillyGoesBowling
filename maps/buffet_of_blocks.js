import SideScrollBaseMapClass from './sidescroll_base.js';

export default class BuffetOfBlocksMapClass extends SideScrollBaseMapClass
{
    constructor(game)
    {
        super(game);
    }
    
    mapStartup()
    {
        super.mapStartup();
    }
    
    getMapTileLayout()
    {
        return(
            [
                '',
                '',
                '',
                '',
                '',
                '                                                                                                                @',
                '                                                                                                          e    BAAC               @',
                '                                                                                                   BAACh       ONNP            fffffccccccccc',
                '                                                                                  BAACh            ONNP                      fffffccccccccccc',
                '                cc                                       ff         @         ggggONNP                                     ffffffffcccccccccc',
                '                ccc                 @                  cceec        ff ggggggg                                           ffffffffffffcccccccc',
                '                cddc     ccc        dd        J       ccceeec      ffeff                                               fffffffffffffffccccccc',
                '              ccccccc  cccJcc       de      ccKe    cccceeeecccc  ccceeccc                                         BAAAAAAAAAAAAAAAAAAAAAACccc',
                '            BAAAAACcccccccKccc      de     GHHMHH@eeeeeeeeeeeeeeeeeeeecccccc                                    BAADFFFFFFFFFFFFFFFFFFFFFFEACc',
                ' *   b   BAAADFFFFFECccccccLcccc     eeccc  eeeeeeeecccdddcccccccccccccccccccc          @           @         BAADFFFFFFFFFFFFFFFFFFFFFFFFFFEAAAC',
                'BAAAAAAAADFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEAAAAC'
            ]
        );
    }

    getMapSpriteLayout()
    {
        return(
            [
                '',
                '',
                '',
                '',
                '',
                '                                                                                                                @',
                '                                                                                                          e                       @',
                '                                                                                                       h                       fffffccccccccc',
                '                                                                                      h                                      fffffccccccccccc',
                '                cc                                       ff         @         ggggONNP                                     ffffffffcccccccccc',
                '                ccc                 @                  cceec        ff ggggggg                                           ffffffffffffcccccccc',
                '                cddc     ccc        dd        J       ccceeec      ffeff                                               fffffffffffffffccccccc',
                '              ccccccc  cccJcc       de      ccKe    cccceeeecccc  ccceeccc                                                                 ccc',
                '            BAAAAACcccccccKccc      de     GHHMHH@eeeeeeeeeeeeeeeeeeeecccccc                                    BAADFFFFFFFFFFFFFFFFFFFFFFEACc',
                ' *   b   BAAADFFFFFECccccccLcccc     eeccc  eeeeeeeecccdddcccccccccccccccccccc          @           @         BAADFFFFFFFFFFFFFFFFFFFFFFFFFFEAAAC',
                'BAAAAAAAADFFFFFFFFFFEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEAAAAC'
            ]
        );
    }

}
