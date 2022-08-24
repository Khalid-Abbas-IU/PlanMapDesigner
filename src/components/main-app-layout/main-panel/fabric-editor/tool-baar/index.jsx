import React from 'react';
import './index.css'

const ToolBaar =({markerMode = false,onToggleMarker})=>{
    return (
        <div className={`toolbaar-container`}>
            <div className="editor-tool-btn center-content" onClick={onToggleMarker}>
                {/*<img src={'My_Portfolio/images/black/undo.png'} height={13} width={13}/>*/}
                <span style={{color:markerMode?'blue':'black'}}>{`MARKER : ${markerMode?"ON" : "OFF"}`}</span>
            </div>
        </div>
    );
}

export default ToolBaar;