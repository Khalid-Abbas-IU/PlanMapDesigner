import {fabric} from "fabric";

// Override Functions

fabric.Object.prototype.set({
    transparentCorners: false,
    hasBorders:false,
    hasControls:false,
    cornerColor: '#333333',
    cornerSize: 12,
    borderScaleFactor:5,
    cornerStyle: 'circle',
});