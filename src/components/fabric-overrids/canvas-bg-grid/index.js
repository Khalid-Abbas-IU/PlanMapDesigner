import {fabric} from "fabric";

export const drawCanvasGrid = (canvas) => {
    var ctx = canvas.getSelectionContext(),
        canvasWidth = canvas.getWidth(),
        canvasHeight = canvas.getHeight(),
        zoom = 1;

    function draw_grid(grid_size) {
        grid_size || (grid_size = 25);
        
        ctx.strokeWidth  = 1;
        ctx.strokeStyle = "rgb(206, 206, 217)";

        // Drawing vertical lines
        var x;
        for (x = 0; x <= canvasWidth; x += grid_size) {
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, canvasHeight);
        }

        // Drawing horizontal lines
        var y;
        for (y = 0; y <= canvasHeight; y += grid_size) {
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(canvasWidth, y + 0.5);
        }
        ctx.strokeStyle = "rgb(206, 206, 217)";
        ctx.stroke();
    }


    canvas.on('before:render', function() {
        canvas.clearContext(canvas.contextTop);
    });

    canvas.on('after:render', function() {
        draw_grid(25);
    });
}

