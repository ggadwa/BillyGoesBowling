import EditorClass from './editor.js';

let editor=null;

export function run(game)
{
        // start the editor
        
    editor=new EditorClass(game);
    editor.initialize();
    
        // hook up any tool buttons
        
    document.getElementById('mapUpButton').onclick=editor.mapUp.bind(editor);
    document.getElementById('mapDownButton').onclick=editor.mapDown.bind(editor);
    document.getElementById('mapLeftButton').onclick=editor.mapLeft.bind(editor);
    document.getElementById('mapRightButton').onclick=editor.mapRight.bind(editor);
    document.getElementById('fillFromZeroZeroButton').onclick=editor.fillFromZeroZero.bind(editor);
    document.getElementById('compileButton').onclick=editor.compile.bind(editor);
}
