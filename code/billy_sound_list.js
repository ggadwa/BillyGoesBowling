import SoundListClass from '../resources/sound_list.js';

export default class BillySoundListClass extends SoundListClass
{
    constructor(game)
    {
        super(game);
    }
    
    create()
    {
        this.add('click');
        this.add('crack');
        this.add('bomb_tick');
        this.add('explode');
        this.add('pop');
        this.add('boing');
        this.add('thud');
        this.add('boss_appear');
        this.add('boss_dead');
        this.add('monster_die');
        this.add('hurt');
        this.add('pipe_break');
        this.add('teleport');
        this.add('locked_castle');
    }
    
}
