export default class RandomClass {
        
    static mwcW=0;
    static mwcZ=0;
    
    static setSeed(seed)
    {
        RandomClass.mwcW=(seed<<16)&0xFFFF;
        RandomClass.mwcZ=seed&0xFFFF;
    }
    
    static setSeedCurrentTimestamp() {
        RandomClass.setSeed(performance.now());
    }

    static random()
    {
        let r;

        RandomClass.mwcZ=(36969*(RandomClass.mwcZ&0xFFFF)+(RandomClass.mwcZ>>16))&0xFFFFFFFF;
        RandomClass.mwcW=(18000*(RandomClass.mwcW&0xFFFF)+(RandomClass.mwcW>>16))&0xFFFFFFFF;
        r=((RandomClass.mwcZ<<16)+RandomClass.mwcW)&0xFFFFFFFF;

        return((r/=0xFFFFFFFF)+0.5);
    }
    
    static randomScaled(scale) {
        return(RandomClass.random()*scale);
    }
    
    static randomScaledInt(scale) {
        return(Math.trunc(RandomClass.random()*scale));
    }
    
    static randomBoolean() {
        return(RandomClass.random()>0.5);
    }
}
