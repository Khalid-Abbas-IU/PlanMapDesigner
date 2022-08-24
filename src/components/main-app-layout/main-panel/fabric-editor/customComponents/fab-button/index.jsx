import React from 'react';
import './index.css'

const EditorButton =({onClicked,buttText,customClass})=>{
    return (
        <div className={`fab-button center-content ${customClass}`} onClick={onClicked}>
            <span className="fab-btn-text">{buttText}</span>
        </div>
    );
}

export default EditorButton;