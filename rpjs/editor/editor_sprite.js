export default class EditorSpriteClass {
    
    constructor(className,img,x,y,data) {
        this.className=className;
        this.img=img;
        this.x=x;
        this.y=y;
        this.data=data;
        
        Object.seal(this);
    }
    
}
