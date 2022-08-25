import {useEffect, useState} from "react";
import {fabric} from 'fabric';
import '../../../../../fabric-overrids/index'
import './index.css'
import EditorPanels from '../../index'
import ToolBaar from "../../tool-baar";
import EditPopup from "../../customComponents/edit-popup";
import ConfirmPopup from "../../customComponents/confirm-popup";
const {EditorHeader,FabEditorLeft,FabEditorRight}=EditorPanels;
let canvas , markerMode = false,lastSelectedObjProps={};

const FabEditor = () =>{
    const [isMarkerState, setIsMarkerState] = useState(false);
    const [editPopUp, setEditPopUp] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [selectedMark, setSelectedMark] = useState("");
    const [testingText, setTestingText] = useState("Here you can show the data");

    useEffect(() => {
        document.addEventListener('wheel', function(e) { e.ctrlKey && e.preventDefault(); }, {passive: false,});
        window.addEventListener('resize', function(e) { adjustCanvasDimensions(); }, true);
        inItCanvas();
    },[]);

    useEffect(() => {
        enableMarkerMode(isMarkerState);
        markerMode = isMarkerState;
    },[isMarkerState]);
    
    useEffect(() => {
        if (confirmed){
            if (lastSelectedObjProps && lastSelectedObjProps.hasOwnProperty('pointers')){
                const {pointers,actObj}=lastSelectedObjProps;
                addMakerPoint(pointers, actObj);
            }
        }
    },[confirmed]);
    
    const inItCanvas =()=>{
        canvas = new fabric.Canvas('canvas',{
            width:700,
            height:500,
            allowTouchScrolling: true,
            backgroundColor:'white',
            hoverCursor: 'grab',
            moveCursor:'grabbing',
            selection: false,
        })
        canvas.defaultCursor = `grab`;
        canvas.hoverCursor = `grab`;
        canvas.moveCursor = `grab`;
        onCanvasEvents(canvas)
        window.canvas = canvas;
        adjustCanvasDimensions();
        canvas.renderAll();
    }

    function onCanvasEvents(canvas){
        canvas.on({
            'object:added': objectAdded,
            'selection:created': selectionCreated,
            'selection:updated': selectionUpdated,
            'object:moving': objectMoving,
            'object:modified' : modifiedObject,
            'object:scaling':objectScaling,
            'object:scaled':objectScaled,
            'object:rotating':objectRotating,
            'mouse:up':mouseUp,
            // 'mouse:over':mouseOver,
            'mouse:move':mouseOver,
            'mouse:down':mouseDown,
            'after:render':afterRender,
            'key:down':onKeyDown,
            'mouse:wheel':mouseWheel,
        })
    }
    // function offCanvasEvents(canvas){
    //     canvas.off({
    //         'object:added': objectAdded,
    //         'selection:created': selectionCreated,
    //         'selection:updated': selectionUpdated,
    //         'object:moving': objectMoving,
    //         'object:modified' : modifiedObject,
    //         'object:scaling':objectScaling,
    //         'object:scaled':objectScaled,
    //         'object:rotating':objectRotating,
    //         'mouse:up':mouseUp,
    //         // 'mouse:over':mouseOver,
    //         'mouse:move':mouseOver,
    //         'mouse:down':mouseDown,
    //         'after:render':afterRender,
    //         'key:down':onKeyDown,
    //         'mouse:wheel':mouseWheel
    //     });
    // }

    const enableMarkerMode =(isMarkerState)=>{
        const cursor = isMarkerState ? 'crosshair' : 'grab';
        if (isMarkerState) {
            if (canvas.getActiveObject()){
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        }
        canvas.set({
            defaultCursor : cursor,
            hoverCursor : cursor,
            moveCursor : cursor,
        });
        canvas.renderAll();
        fabric.Object.prototype.set({
            selection:!isMarkerState,
            selectable:!isMarkerState
        })
    }

    const afterRender=()=>{
        draw_grid(25);
    }

    function draw_grid(grid_size) {
        grid_size || (grid_size = 25);
        if(!canvas) return;
        var grid_context = canvas.getContext("2d")

        var currentCanvasWidth = canvas.getWidth();
        var currentCanvasHeight = canvas.getHeight();
        grid_context.strokeWidth  = 1;
        grid_context.strokeStyle = "rgb(206, 206, 217)";

        // Drawing vertical lines
        var x;
        for (x = 0; x <= currentCanvasWidth; x += grid_size) {
            grid_context.moveTo(x + 0.5, 0);
            grid_context.lineTo(x + 0.5, currentCanvasHeight);
        }

        // Drawing horizontal lines
        var y;
        for (y = 0; y <= currentCanvasHeight; y += grid_size) {
            grid_context.moveTo(0, y + 0.5);
            grid_context.lineTo(currentCanvasWidth, y + 0.5);
        }
        grid_context.strokeStyle = "rgb(206, 206, 217)";
        grid_context.stroke();
    }
    const adjustCanvasDimensions =()=>{
        let elHeight = 0, elWidth = 0;
        document.querySelectorAll('div').forEach((el)=>{
        if (el.classList.contains('fabric-editor-pro')){
                elWidth = el.clientWidth;
                elHeight = el.clientHeight;
            }
        })
        let width = elWidth,
            height = elHeight;
        canvas.setWidth(width)
        canvas.setHeight(height)
        canvas.renderAll();
    }
    const mouseWheel =(opt)=> {
        var delta = opt.e.deltaY;
        var pointer = canvas.getPointer(opt);
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        setCanvasZoom(zoom,pointer)
        // canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    const setCanvasZoom =(zoom,pointer)=> {
        canvas.zoomToPoint(
            new fabric.Point(
                pointer.x,
                pointer.y
            ), zoom );
        canvas.renderAll();
    }

    const onToggleMarker=()=>{
        setIsMarkerState(!isMarkerState);
        markerMode = !markerMode
    }

    const onKeyDown = (e) => {}

    const getPositionOnMark =(x,y,obj)=>{
        if (!obj) return false;
        if (obj.type !== "group") return false;
        let marks = obj._objects.filter(o=>o.name === "pin_location");
        let result = {flag:false}
        for (const mark of marks) {
            const scaledW = mark.getScaledWidth(),
                    scaledH = mark.getScaledHeight(),
                    halfW = scaledW/2,
                    halfH = scaledH/2,
                    markLeft = mark.left + obj.left,
                    markTop = mark.top + obj.top
            const flag = x > markLeft - halfW && x < markLeft + halfW && y > markTop - halfH && y < markTop + halfH;
            if (flag){
                result = {flag,objRef:mark.ref_id}
            }
        }
        return result;
    }

    const mouseOver =(e)=>{
        let obj = e.target;
        if (!obj) return;
        if (obj.type === "group" && obj.name === "blue_print"){
            const {x,y} = canvas.getPointer(e)
            const {flag} = getPositionOnMark(x,y,obj);
            let cursor = (isMarkerState || markerMode) ? 'crosshair' : 'grab';
            if (flag) cursor = 'pointer'
            canvas.set({
                defaultCursor : cursor,
                hoverCursor : cursor,
                moveCursor : cursor,
            });
            canvas.renderAll();
        }
    }
    const mouseUp=(e)=>{
        let obj = e.target;
        if (!obj) return;
        if (obj.name === "blue_print") {
            const p = canvas.getPointer(e)
            if (isMarkerState || markerMode) {
                lastSelectedObjProps = {pointers:p,actObj:obj};
                setConfirmMessage(true)
            }else {
                const {flag, objRef} = getPositionOnMark(p.x, p.y, obj);
                if (flag){
                    setEditPopUp(true);
                    setSelectedMark(objRef)
                }

            }
        }
    }
    const addMakerPoint = (pointers,bluePrint)=> {
        const uuid = require("uuid");
        let id = uuid.v4();
        const {x, y} = pointers;
        if (canvas.getActiveObject() === bluePrint) canvas.discardActiveObject();
        let actObjs = [bluePrint];
        if (bluePrint.type === 'group'){
            actObjs =bluePrint._objects;
            bluePrint._restoreObjectsState();
            canvas.remove(bluePrint);
        }
        let left = x,
            top = y;

        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin : "Anonymous",
                ref_id: id,
                left,
                top,
                originX: 'center',
                originY: 'center',
                name: "pin_location",
                perPixelTargetFind:true
            });
            imgInstance.scaleToWidth(50);
            imgInstance.set('top',top - imgInstance.getScaledHeight()/2 + 1);
            canvas.remove(bluePrint)
            let id1 = uuid.v4();
            let numGroup = new fabric.Group([...actObjs,imgInstance], {
                ref_id: id1,
                name: "blue_print",
                originX: 'center',
                originY: 'center',
            });
            canvas.add(numGroup);
            canvas.renderAll();

            setIsMarkerState(!markerMode)
            setConfirmed(false)
            lastSelectedObjProps ={};
        };
        img.src = '/assets/images/map-location.png';
    }
    const mouseDown=(e)=>{}
    const objectAdded=(e)=>{}
    const selectionCreated=()=>{
        let obj = canvas.getActiveObject();
        if (!obj) return;
    }
    const selectionUpdated=(e)=>{}
    const modifiedObject=(e)=>{}
    const objectScaling=(e)=>{}
    const objectScaled=(e)=>{}
    const objectRotating=(e)=>{}
    const objectMoving=(e)=>{}

    const addImage = (src) => {
        if (!canvas) return;
        const uuid = require("uuid");
        let id = uuid.v4();
        let height = canvas.getHeight()/2,
            width = canvas.getWidth()/2;
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            let imgInstance = new fabric.Image(img, {
                crossOrigin : "Anonymous",
                ref_id: id,
                left: width,
                top: height,
                originX: 'center',
                originY: 'center',
                name: "blue_print",
                perPixelTargetFind:true,
                stroke:"black",
                strokeWidth:5
            });
            imgInstance.scaleToHeight(canvas.getWidth() * 0.4);
            canvas.renderAll();
            canvas.add(imgInstance);
            canvas.setActiveObject(imgInstance);
        };
        img.src = src;
    };

    const addBluePrint =()=>{
        if (isMarkerState && canvas.getObjects().length) return;
        addImage('/assets/images/blueprints/FLOOR-PLAN-BUILDINGS.jpg')
    }
    
    const deleteActObject =()=>{
        const actObj = canvas.getActiveObject();
        if (!actObj) return;
        canvas.remove(actObj)
        canvas.renderAll();
    }
    const onCloseModal =(type)=>{
        switch (type){
            case "edit":
                setEditPopUp(false)
                break;
            case "confirm":
                setConfirmMessage(false)
                lastSelectedObjProps = {}
                break;
            default:break;
        }
    }
    const onProceed =(type)=>{
        switch (type){
            case "edit":
                setEditPopUp(false)
                break;
            case "confirm":
                setConfirmMessage(false)
                setConfirmed(true)
                break;
            default:break;
        }
    }
    const handleTextChanged =(value)=>{
        console.log("value",value)
    }
    return (
        <div className="fabric-editor-container">
            <EditorHeader/>
            <div className="editor-main-wrapper">
                <FabEditorLeft onToggleMarker={onToggleMarker} addBluePrint={addBluePrint}/>
                <div className={"canvas-main-wrapper"}>
                    <ToolBaar onToggleMarker={onToggleMarker} markerMode={isMarkerState}/>
                    <div className={`fabric-editor-pro center-content-column`}>
                        <canvas id="canvas" width={1000} height={800}/>
                    </div>
                </div>
                <FabEditorRight deleteActObject={deleteActObject} testingText={testingText}/>
            </div>
            { editPopUp && <EditPopup selectedMark={selectedMark} onCloseModal={()=>onCloseModal("edit")} onProceed={onProceed} handleTextChanged={handleTextChanged}/>}
            { confirmMessage && <ConfirmPopup onCloseModal={()=>onCloseModal("confirm")} onProceed={()=>onProceed('confirm')}/> }
        </div>
    );
}
export default FabEditor;
