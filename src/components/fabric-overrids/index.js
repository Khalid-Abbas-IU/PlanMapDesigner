import {fabric} from "fabric";

// Override Functions

fabric.Object.prototype.set({
    transparentCorners: false,
    hasBorders:false,
    hasControls:false,
    // borderColor: '#9eba1b',
    cornerColor: '#333333',
    // selectionBackgroundColor: 'transparent',
    cornerSize: 12,
    borderScaleFactor:5,
    cornerStyle: 'circle',
});

// let controls = {
//     tl: true, //top-left
//     mt: true, // middle-top
//     tr: true, //top-right
//     ml: true, //middle-left
//     mr: true, //middle-right
//     bl: true, // bottom-left
//     mb: true, //middle-bottom
//     br: true, //bottom-right
//     mtr: false, // rotate icon
// }
// fabric.Object.prototype.setControlsVisibility(controls)