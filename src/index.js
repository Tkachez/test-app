import utils from "./modules/utils";
import shapes from "./modules/shapes";

window.onload = () => {
    let canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        rectangles = shapes(),
        offset = {},
        isDragging = false,
        dragHandle;

    let draw = () => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "gray";
        context.beginPath();

        rectangles.map(shape => {
            if (isDragging && shape === dragHandle) {
                context.shadowColor = "black";
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowBlur = 8;
            }
            context.beginPath();
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
            context.fill();

            context.shadowColor = null;
            context.shadowOffsetX = null;
            context.shadowOffsetY = null;
            context.shadowBlur = null;
        });
    };

    document.body.addEventListener("mousedown", function (event) {
        rectangles.map(shape => {

            let onMouseMove = (event) => {
                dragHandle.x = event.clientX - offset.x;
                dragHandle.y = event.clientY - offset.y;
                draw();
            };

            let onMouseUp = (e) => {
                document.body.removeEventListener("mousemove", onMouseMove);
                document.body.removeEventListener("mouseup", onMouseUp);
                isDragging = false;
                draw();
            };

            if (utils.pointInRect(event.clientX, event.clientY, shape)) {
                isDragging = true;
                document.body.addEventListener("mousemove", onMouseMove);
                document.body.addEventListener("mouseup", onMouseUp);
                dragHandle = shape;
                offset.x = event.clientX - shape.x;
                offset.y = event.clientY - shape.y;
                draw();
            }

        })
    });

    draw();
};