import React from 'react';
import './index.css'
import MainPanel from "./main-panel/MainPanel";

const MainAppLayout =()=>{
    return (
        <div className={`main-app-layout`}>
            <MainPanel/>
        </div>
    );
}

export default MainAppLayout;