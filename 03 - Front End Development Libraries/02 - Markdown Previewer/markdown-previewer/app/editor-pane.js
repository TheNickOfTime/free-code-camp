'use client'

export default function EditorPane(props) {
    
    return (
        <div id="editor-pane" className="bg-light text-dark border border-light">
            <div className="toolbar">
                Editor
            </div>
            <textarea id="editor" className="bg-dark text-light" onChange={props.editorChange} value={props.markdown}>
                
            </textarea>
        </div>
    )
}