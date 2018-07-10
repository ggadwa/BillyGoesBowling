import SoundListClass from '../resources/sound_list.js';

export default class BillySoundListClass extends SoundListClass
{
    constructor()
    {
        super();
    }
    
    create()
    {
        this.add('crack');
        this.add('explode');
        this.add('pop');
    }
    
}
