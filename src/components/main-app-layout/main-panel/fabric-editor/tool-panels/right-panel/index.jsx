import React from 'react';
import './index.css'

const FabEditorRight =({deleteActObject})=>{
    return (
        <aside className="editor-right-panel">
            <div className="fab-icon-button" onClick={deleteActObject}>
                <span>DELETE</span>
            </div>
        </aside>
    );
}

export default FabEditorRight;