import utils from "./modules/utils";
import Rectangle from './modules/rectangle'

window.onload = () => {
    let canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        mountedElement,
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
    let draw = () => {
        context.clearRect(0, 0, width, height);
        drawInitialElement();
        if (dragHandle) {
            drawNewElement(dragHandle);
        }
        if(mountedElement){
            drawNewElement(mountedElement);
        }
    };

    let drawNewElement = (el) => {
        context.fillStyle = el.fillColor;
        context.beginPath();
        context.fillRect(el.x, el.y, el.width, el.height);
        context.fill();
        context.strokeStyle = el.borderColor;
        context.lineWidth = 2;
        context.strokeRect(el.x, el.y, el.width, el.height);
    };

    let drawInitialElement = () => {
        context.fillStyle = "wheat";
        context.beginPath();
        context.fillRect(20, 20, 100, 100);
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeRect(20, 20, 100, 100);
    };

    let joinMount = (side) => {
        switch(side) {
            case 'top':
                mountedElement.y = mountedElement.y - dragHandle.height;
                mountedElement.height = mountedElement.height + dragHandle.height;
                dragHandle = null;
                break;

            case 'left':
                mountedElement.x = mountedElement.x - dragHandle.width;
                mountedElement.width = mountedElement.width + dragHandle.width;
                dragHandle = null;
                break;

            case 'right':
                mountedElement.width = mountedElement.width + dragHandle.width;
                dragHandle = null;
                break;

            case 'bottom':
                mountedElement.height = mountedElement.height + dragHandle.height;
                dragHandle = null;
                break;

            default:
                return;
        }
    };

    document.body.addEventListener("mousedown", (event) => {
        let onMouseMove = (event) => {
            dragHandle.x = event.clientX - offset.x;
            dragHandle.y = event.clientY - offset.y;
            if (mountedElement) {
                if (utils.rectIntersect(dragHandle, mountedElement)) {
                    dragHandle.fillColor ='red';
                    mountedElement.fillColor = 'red';
                } else {
                    dragHandle.fillColor = 'wheat';
                    mountedElement.fillColor = 'wheat';
                }
            }

            draw();
        };

        let onMouseUp = () => {
            document.body.removeEventListener("mousemove", onMouseMove);
            document.body.removeEventListener("mouseup", onMouseUp);
            if (!mountedElement) {
                mountedElement = dragHandle;

            }
            let side = utils.getCollisionSide(dragHandle, mountedElement);
            joinMount(side);
            draw();
        };

        if (utils.pointInInitialRect(event.clientX, event.clientY, baseRect)) {
            let movingElement = new Rectangle(20, 20, "wheat", "black");
            document.body.addEventListener("mousemove", onMouseMove);
            document.body.addEventListener("mouseup", onMouseUp);
            dragHandle = movingElement;
            offset.x = event.clientX - movingElement.x;
            offset.y = event.clientY - movingElement.y;
            draw();
        }

    });


    let animate = () => {
        draw();
        requestAnimationFrame(animate);
    };
    animate();
};