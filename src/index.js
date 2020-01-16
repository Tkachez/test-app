import utils from "./modules/utils";
import Rectangle from './modules/rectangle'

window.onload = () => {
    let canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        initialElement,
        baseRect = {
            y: 20,
            x: 20,
            width: 100,
            height: 100
        },
        offset = {},
        activeElements = [],
        dragHandle;

    /**
     *
     */
    let drawInitialRectangle = () => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "wheat";
        context.beginPath();
        context.fillRect(20, 20, 100, 100);
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeRect(20, 20, 100, 100);
        if(initialElement){
            context.fillStyle = "wheat";
            context.beginPath();
            context.fillRect(initialElement.x, initialElement.y, initialElement.width, initialElement.height);
            context.fill();
            context.strokeStyle = "black";
            context.lineWidth = 2;
            context.strokeRect(initialElement.x, initialElement.y, initialElement.width, initialElement.height);
        }
    };

    let drawNewUnit = (movingElement) => {
        context.fillStyle = movingElement.fillColor;
        context.beginPath();
        context.fillRect(movingElement.x, movingElement.y, movingElement.width, movingElement.height);
        context.fill();
        context.strokeStyle = movingElement.borderColor;
        context.lineWidth = 2;
        context.strokeRect(movingElement.x, movingElement.y, movingElement.width, movingElement.height);
    };

    let init = () => {
        document.body.addEventListener("mousedown", (event) => {
            let onMouseMove = (event) => {
                dragHandle.x = event.clientX - offset.x;
                dragHandle.y = event.clientY - offset.y;
                drawInitialRectangle();
                drawNewUnit(dragHandle);
            };

            let onMouseUp = () => {
                document.body.removeEventListener("mousemove", onMouseMove);
                document.body.removeEventListener("mouseup", onMouseUp);
                drawInitialRectangle();
                activeElements.push(dragHandle);
                drawNewUnit(dragHandle);
            };

            if (utils.pointInRect(event.clientX, event.clientY, baseRect)) {
                let movingElement = new Rectangle(20, 20, "wheat", "black");
                document.body.addEventListener("mousemove", onMouseMove);
                document.body.addEventListener("mouseup", onMouseUp);
                dragHandle = movingElement;
                offset.x = event.clientX - movingElement.x;
                offset.y = event.clientY - movingElement.y;
                drawInitialRectangle();
                drawNewUnit(movingElement);
            }

        });
        drawInitialRectangle();
    };
    init();
};