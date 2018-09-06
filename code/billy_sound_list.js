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
        this.add('explode');
        this.add('pop');
    }
    
}
