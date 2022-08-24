import React from 'react';
import './index.css'

const LabeledTextInput =({inputValue,handleTextChanged,customClass,label = 'TEXT'})=>{
    return (
        <div className={"form " + customClass }>
            <input type="text" id="text" value={inputValue} onChange={handleTextChanged} className="form__input" autoComplete="off" placeholder=" "/>
            <label htmlFor="text" className="form__label">{label}</label>
        </div>
    );
}

export default LabeledTextInput;