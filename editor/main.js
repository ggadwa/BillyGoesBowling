import EditorClass from './editor.js';

let editor=null;

export function run(game)
{
        // start the editor
        
    editor=new EditorClass(game);
    editor.initialize();
    
        // hook up any tool buttons
        
    document.getElementById('compileButton').onclick=editor.compile.bind(editor);
}
