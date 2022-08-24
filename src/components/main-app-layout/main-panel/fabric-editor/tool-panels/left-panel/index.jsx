import React from 'react';
import './index.css'
import LeftTabMenu from "./left-tab-menu";

const LeftPanel = ({onToggleMarker,addBluePrint})=>{
    return (
        <aside className="editor-left-side">
            <LeftTabMenu addBluePrint={addBluePrint} onToggleMarker={onToggleMarker}/>
        </aside>
    );
}

export default LeftPanel;