import {useEffect, useState} from "react";
import {fabric} from 'fabric';
import '../../../../../fabric-overrids/index'
import './index.css'
import EditorPanels from '../../index'
import ToolBaar from "../../tool-baar";
import EditPopup from "../../customComponents/edit-popup";
import ConfirmPopup from "../../customComponents/confirm-popup";
const {EditorHeader,FabEditorLeft,FabEditorRight}=EditorPanels;
let canvas , markerMode = false,lastSelectedObjProps={},isClickedOnCanvas=false;

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
                const {pointers}=lastSelectedObjProps;
                addMakerPoint(pointers);
            }
        }
    },[confirmed]);
    
    const inItCanvas =()=>{
        canvas = new fabric.Canvas('canvas',{
            width:700,
            height:500,
            allowTouchScrolling: true,
            backgroundColor:'white',
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
            'mouse:move':mouseMove,
            'mouse:down':mouseDown,
            'after:render':afterRender,
            'key:down':onKeyDown,
            'mouse:wheel':mouseWheel,
        })
    }
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
        canvas.set('originalWidth',width)
        canvas.set('originalHeight',height)
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
    const zoomIn =()=> {
        let zoom = canvas.getZoom();
        zoom  += 0.1;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        const bpInd = canvas._objects.findIndex(o=>o.name === "blue_print");
        let x = canvas.width/2,y=canvas.height/2;
        if (bpInd > -1){
            x = canvas._objects[bpInd].left;
            y = canvas._objects[bpInd].top;
            setCanvasZoom(zoom,{x,y})
        } else setCanvasZoom(zoom,{x,y})
    }
    const zoomOut =()=> {
        let zoom = canvas.getZoom();
        zoom  -= 0.1;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        const bpInd = canvas._objects.findIndex(o=>o.name === "blue_print");
        let x = canvas.width/2,y=canvas.height/2;
        if (bpInd > -1){
            x = canvas._objects[bpInd].left;
            y = canvas._objects[bpInd].top;
            setCanvasZoom(zoom,{x,y})
        } else setCanvasZoom(zoom,{x,y})

    }
    const zoomReset =()=> {
        let x = canvas.width/2,y=canvas.height/2;
        setCanvasZoom(1,{x,y})
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
    const mouseMove=(e)=>{
        if (!isClickedOnCanvas) return;
        var units = 10;
        var delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
    }

    const mouseOver =(e)=>{
        // let obj = e.target;
        // if (!obj) return;
        // if (obj.type === "group" && obj.name === "blue_print"){
        //     const {x,y} = canvas.getPointer(e)
        //     const {flag} = getPositionOnMark(x,y,obj);
        //     let cursor = (isMarkerState || markerMode) ? 'crosshair' : 'grab';
        //     if (flag) cursor = 'pointer'
        //     canvas.set({
        //         defaultCursor : cursor,
        //         hoverCursor : cursor,
        //         moveCursor : cursor,
        //     });
        //     canvas.renderAll();
        // }
    }
    const mouseUp=(e)=>{
        let obj = e.target;
        isClickedOnCanvas = false
        if (!obj) return;
        if (obj.name === "blue_print") {
            const p = canvas.getPointer(e)
            if (isMarkerState || markerMode) {
                lastSelectedObjProps = {pointers:p,actObj:obj};
                addMakerTemp(p)
                setConfirmMessage(true)
            }
        }
    }
    const addMakerPoint = (pointers)=> {
        const uuid = require("uuid");
        let id = uuid.v4();
        const tempMarkerInd = canvas._objects.findIndex(o=>o.name === "pin_location_temp");
        if (tempMarkerInd > -1) {
            canvas.remove(canvas._objects[tempMarkerInd])
            canvas.renderAll();
        }
        const {x, y} = pointers;
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
                lockMovementX:true,
                lockMovementY:true,
                perPixelTargetFind:true,
                hoverCursor:'pointer'
            });
            imgInstance.scaleToWidth(canvas.width * 0.05);
            imgInstance.set('top',top - imgInstance.getScaledHeight()/2 + 1);
            canvas.add(imgInstance);
            canvas.renderAll();
            setIsMarkerState(!markerMode)
            setConfirmed(false)
            lastSelectedObjProps ={};
        };
        img.src = './assets/images/pin-location.png';
    }
    const addMakerTemp = (pointers)=> {
        const uuid = require("uuid");
        let id = uuid.v4();
        const {x, y} = pointers;
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
                name: "pin_location_temp",
                lockMovementX:true,
                lockMovementY:true,
                perPixelTargetFind:true,
                hoverCursor:'pointer'
            });
            imgInstance.scaleToWidth(canvas.width * 0.05);
            imgInstance.set('top',top - imgInstance.getScaledHeight()/2 + 1);
            canvas.add(imgInstance);
            canvas.renderAll();
        };
        img.src = './assets/images/pin-location-temp.png';
    }
    const mouseDown=(e)=>{
        isClickedOnCanvas = true
    }
    const objectAdded=(e)=>{}
    const selectionCreated=()=>{
        let obj = canvas.getActiveObject();
        if (!obj) return;
        if (obj.name === "pin_location"){
            setEditPopUp(true);
            setSelectedMark(obj.ref_id)
        }
    }
    const selectionUpdated=(e)=>{
        setEditPopUp(false);
        let obj = canvas.getActiveObject();
        if (!obj) return;
        if (obj.name === "pin_location"){
            setEditPopUp(true);
            setSelectedMark(obj.ref_id)
        }
    }
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
                strokeWidth:5,
                selectable:false
            });
            imgInstance.scaleToHeight(canvas.getWidth() * 0.5);
            canvas.renderAll();
            canvas.add(imgInstance);
            canvas.setActiveObject(imgInstance);
        };
        img.src = src;
    };

    const addBluePrint =()=>{
        const bpInd = canvas.getObjects().findIndex(o=>o.name === "blue_print");
        if (bpInd > -1 || isMarkerState && canvas.getObjects().length) return;
        addImage('./assets/images/blueprints/FLOOR-PLAN-BUILDINGS.jpg')
    }
    
    const deleteActObject =()=>{
        for (let i = 0; i < canvas._objects.length; i++) {
            canvas.remove(canvas._objects[i])
        }
        canvas.renderAll();
    }
    const onCloseModal =(type)=>{
        const tempMarkerInd = canvas._objects.findIndex(o=>o.name === "pin_location_temp");
        if (tempMarkerInd > -1) {
            canvas.remove(canvas._objects[tempMarkerInd])
            canvas.renderAll();
        }
        switch (type){
            case "edit":
                if (canvas?.getActiveObject()) canvas.discardActiveObject();
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
    const handleTextChanged =(e)=>{
        setSelectedMark(e.target.value)
    }
    return (
        <div className="fabric-editor-container">
            <EditorHeader/>
            <div className="editor-main-wrapper">
                <FabEditorLeft onToggleMarker={onToggleMarker} addBluePrint={addBluePrint}/>
                <div className={"canvas-main-wrapper"}>
                    <ToolBaar onToggleMarker={onToggleMarker} markerMode={isMarkerState} zoomIn={zoomIn} zoomOut={zoomOut} zoomReset={zoomReset}/>
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
