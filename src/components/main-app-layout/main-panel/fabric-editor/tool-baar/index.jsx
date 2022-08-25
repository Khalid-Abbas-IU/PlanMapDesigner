import React from 'react';
import './index.css'

const ToolBaar =({markerMode = false,onToggleMarker,zoomIn,zoomOut,zoomReset})=>{
    return (
        <div className={`toolbaar-container`}>
            <div className="editor-tool-btn center-content" onClick={onToggleMarker}>
                {/*<img src={'My_Portfolio/images/black/undo.png'} height={13} width={13}/>*/}
                <span style={{color:markerMode?'blue':'black'}}>{`MARKER : ${markerMode?"ON" : "OFF"}`}</span>
            </div>
            <div className={"zoom-container"}>
                <div className={"zoom-div zoom-in"} onClick={zoomOut}>-</div>
                <div className={"zoom-div zoom-out"}onClick={zoomIn}>+</div>
                <div className={"zoom-div zoom-reset"}onClick={zoomReset}>Reset</div>
            </div>
        </div>
    );
}

export default ToolBaar;