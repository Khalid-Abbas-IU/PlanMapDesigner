import React from 'react';
import './index.css'

const FabEditorRight =({deleteActObject,testingText})=>{
    return (
        <aside className="editor-right-panel">
            <div className="fab-icon-button" onClick={deleteActObject}>
                <span>DELETE</span>
            </div>
            <div className="texting-event-container">
                <span>{testingText}</span>
            </div>
        </aside>
    );
}

export default FabEditorRight;