import React from 'react';
import './index.css'
import EditorButton from "../fab-button";

const ConfirmPopup =({onProceed,onCloseModal})=>{
    return (
        <div className={`edit-popup-wrapper center-content`}>
            <div className={"popup-header"}>
                {/*<img src={'./'} alt={"X"}/>*/}
                <div className={"edit-popup-text"}>Confirmation Message</div>
                <div className="close-popup" onClick={onCloseModal}>x</div>

            </div>
            <div className={"popup-body"}>
                <span>Do you want to add location mark?</span>
            </div>
            <div className={"popup-bottom"}>
                <EditorButton buttText={'No'} customClass={"popup-button"} onClicked={onCloseModal}/>
                <EditorButton buttText={'Yes'} customClass={"popup-button"} onClicked={onProceed}/>
            </div>
        </div>
    );
}

export default ConfirmPopup;