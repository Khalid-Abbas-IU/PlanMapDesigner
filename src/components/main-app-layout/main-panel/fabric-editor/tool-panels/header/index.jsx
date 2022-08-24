import React from 'react';
import FabButton from "../../customComponents/fab-button";
import './index.css'

const EditorHeader =()=>{
    return (
        <div className="fab-editor-header">
            <div className="project-name-container">
                <span>HOME</span>
            </div>
            <div className="project-name-container">
                <span>Building Plans</span>
            </div>
            <div className="proceed-btn-container">
                <FabButton buttText={"DOWNLOAD"} customClass="proceed_btn"/>
            </div>

        </div>
    );
}

export default EditorHeader;