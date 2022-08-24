import React from 'react';
import './index.css'
import EditorButton from "../fab-button";
import LabeledTextInput from "../lblTextInput";

const EditPopup =({selectedmark,onCloseModal})=>{
    return (
        <div className={`edit-popup-wrapper center-content`}>
            <div className={"popup-header"}>
                {/*<img src={'./'} alt={"X"}/>*/}
                <div className={"edit-popup-text"}>Edit Popup</div>
                <div className="close-popup" onClick={onCloseModal}>x</div>

            </div>
            <div className={"popup-body"}>
                <LabeledTextInput label={"Link here"} customClass={"popup-input"} inputValue={selectedmark}/>
            </div>
            <div className={"popup-bottom"}>
                <EditorButton buttText={'Cancel'} customClass={"popup-button"} onClicked={onCloseModal}/>
                <EditorButton buttText={'Downlaod'} customClass={"popup-button"}/>
            </div>
        </div>
    );
}

export default EditPopup;