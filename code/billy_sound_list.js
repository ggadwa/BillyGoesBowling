import SoundListClass from '../resources/sound_list.js';

export default class BillySoundListClass extends SoundListClass
{
    constructor()
    {
        super();
    }
    
    fillSoundList()
    {
        this.add('crack');
        this.add('explode');
        this.add('pop');
    }
    
}
