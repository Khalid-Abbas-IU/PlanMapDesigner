import React from 'react';
import './index.css'
import FabEditor from "./fabric-editor/tool-panels/fab-editor";
const MainPanel =()=> {
    return (
        <div className={`main-app-panel`}>
            <FabEditor/>
        </div>
    );
}
export default MainPanel;