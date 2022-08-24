import React from "react";
import clsx from "clsx";
import './index.css'
const SwitchTab =({text,styledClass,onClicked})=>{
    return <div className={clsx("app-switch-tab", styledClass)} onClick={onClicked}>{text}</div>
}
export default SwitchTab;