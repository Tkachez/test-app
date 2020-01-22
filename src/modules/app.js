import {constants} from './constants';
import {shapes} from './shapes';
import utils from "./utils";

export const app = (context, width, height) => init(context, width, height);

const init = (context, width, height) => {
    const offset = {},
        rectangles = shapes();

    let isCollisionDetected = false,
        attachmentSide,
        dragHandle,
        attachedDragHandle,
        mountedElement;

    document.body.addEventListener("mousedown", (event) => {
        const onMouseMove = (event) => {
            if (dragHandle) {
                dragHandle.x = event.clientX - offset.x;
                dragHandle.y = event.clientY - offset.y;
            }
            if (mountedElement) {
                if (utils.getDistance(dragHandle, mountedElement) > mountedElement.width + constants.COLLISION_DISTANCE && isCollisionDetected) {
                    initUpdate(false, event);
                }
                if (utils.getDistance(dragHandle, mountedElement) < mountedElement.width + constants.COLLISION_DISTANCE && !isCollisionDetected) {
                    initUpdate(true, event);
                }
            }
        };

        const onMouseUp = () => {
            document.body.removeEventListener("mousemove", onMouseMove);
            document.body.removeEventListener("mouseup", onMouseUp);
            if (!mountedElement) {
                mountedElement = dragHandle;
                shapes.push(mountedElement);
            }
            if (utils.rectIntersect(dragHandle, mountedElement) && isCollisionDetected && attachedDragHandle) {
                updateMountedElement(attachedDragHandle);
            }
            dragHandle = null;
        };

        if (isInRect(event)) {
            console.log(111);
            document.body.addEventListener("mousemove", onMouseMove);
            document.body.addEventListener("mouseup", onMouseUp);
            dragHandle = movingElement;
            shapes.push(dragHandle);
            offset.x = event.clientX - movingElement.x;
            offset.y = event.clientY - movingElement.y;
        }
    });

    const isInRect = (event) => {
        for (let i = 0; i < rectangles.length; i++) {
            if (utils.pointInRect(event.clientX, event.clientY, rectangles[i])) {
                return true;
            }
        }
        return false;
    };

    const animate = () => {
        draw();
        requestAnimationFrame(animate);
    };

    const draw = () => {
        const elements = shapes();
        const filteredElements = elements.filter(Boolean);
        context.clearRect(0, 0, width, height);
        filteredElements.map(el => drawElements(el));
    };

    const drawElements = (el) => {
        context.fillStyle = el.fillColor;
        context.beginPath();
        context.fillRect(el.x, el.y, el.width, el.height);
        context.fill();
    };

    const initUpdate = (join, event) => {
        let side = utils.getCollisionSide(dragHandle, mountedElement);
        attachmentSide = side;
        isCollisionDetected = join;
        join ? attachDragHandle(side, event) : detach(event);
    };

    const attachDragHandle = (side, event) => {
        // switch (side) {
        //     case constants.SIDES.TOP:
        //         attachedDragHandle = {
        //             x: mountedElement.x,
        //             y: mountedElement.y - dragHandle.height,
        //             width: dragHandle.width,
        //             height: dragHandle.height,
        //             fillColor: dragHandle.fillColor
        //         };
        //         dragHandle.fillColor = 'transparent';
        //         break;
        //
        //     case constants.SIDES.LEFT:
        //         attachedDragHandle = {
        //             x: mountedElement.x - dragHandle.width,
        //             y: mountedElement.y,
        //             width: dragHandle.width,
        //             height: dragHandle.height,
        //             fillColor: dragHandle.fillColor
        //         };
        //         dragHandle.fillColor = 'transparent';
        //         break;
        //
        //     case constants.SIDES.RIGHT:
        //         attachedDragHandle = {
        //             x: mountedElement.x + dragHandle.width,
        //             y: mountedElement.y,
        //             width: dragHandle.width,
        //             height: dragHandle.height,
        //             fillColor: dragHandle.fillColor
        //         };
        //         dragHandle.fillColor = 'transparent';
        //         break;
        //
        //     case constants.SIDES.BOTTOM:
        //         attachedDragHandle = {
        //             x: mountedElement.x,
        //             y: mountedElement.y + dragHandle.height,
        //             width: dragHandle.width,
        //             height: dragHandle.height,
        //             fillColor: dragHandle.fillColor
        //         };
        //         dragHandle.fillColor = 'transparent';
        //         break;
        //
        //     default:
        //         return;
        // }
    };

    const detach = (event) => {
        dragHandle = {
            x: event.clientX - offset.x,
            y: event.clientY - offset.y,
            width: attachedDragHandle.width,
            height: attachedDragHandle.height,
            fillColor: attachedDragHandle.fillColor
        };

        attachedDragHandle = null;
    };

    const updateMountedElement = () => {
        if (mountedElement.x === attachedDragHandle.x) {
            if (mountedElement.y > attachedDragHandle.y) {
                mountedElement.y = attachedDragHandle.y;
                mountedElement.height += attachedDragHandle.height;
            } else {
                mountedElement.height += attachedDragHandle.height;
            }
        }
        if (mountedElement.y === attachedDragHandle.y) {
            console.log('left or right');
        }
    };

    animate();
};







