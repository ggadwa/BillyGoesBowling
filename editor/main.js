import EditorClass from './editor.js';

let editor=null;

export function run(gameObj)
{
        // start the editor
        
    editor=new EditorClass(gameObj);
    editor.initialize();
    
        // hook up any tool buttons
        
    document.getElementById('compileButton').onclick=editor.compile.bind(editor);
}
