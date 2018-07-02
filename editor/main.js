import EditorClass from './editor.js';

let editor=null;

export function run(game,map)
{
        // start the editor
        
    editor=new EditorClass(game,map);
    editor.initialize();
    
        // hook up any tool buttons
        
    document.getElementById('compileButton').onclick=editor.compile.bind(editor);
}
