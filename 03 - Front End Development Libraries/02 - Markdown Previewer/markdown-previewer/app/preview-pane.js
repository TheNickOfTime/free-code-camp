'use client'
// import 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
import { marked } from "marked"

export default function PreviewPane(props) {

    marked.use({
        breaks: true
    });

    return (
        <div id="preview-pane" className="bg-light text-dark border border-light">
            <div className="toolbar">
                Preview
            </div>
            <div id="preview" className="bg-dark text-light" dangerouslySetInnerHTML={{__html: marked.parse(props.markdown)}}>
            </div>
        </div>
    )
}