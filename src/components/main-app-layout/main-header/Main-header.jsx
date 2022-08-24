import React from 'react';
import './index.css'
import SwitchTab from "./switch-tab";

const MainHeader =({enabledDrawHub})=>{
    return (
        <div className={`main-app-header center-content`}>
            <div className="main-header-left">
                <div>K.ABBAS</div>
            </div>
            <div className="main-header-right">
                <SwitchTab text={"Home"}/>
                <SwitchTab text={"Projects"}/>
                <SwitchTab text={"Expertise"}/>
                <SwitchTab text={"Frameworks"}/>
                <SwitchTab text={"Draw Hub"} onClicked ={enabledDrawHub}/>
            </div>
        </div>
    );
}

export default MainHeader;