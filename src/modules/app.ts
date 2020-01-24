import {constants} from './constants';
import utils from "./utils";
import Rectangle from "./rectangle";


export const app: (context: CanvasRenderingContext2D, width: number, height: number) => void = (context, width, height) => {
    return init(context, width, height);
};

const init: (context: CanvasRenderingContext2D, width: number, height: number) => void = (context, width, height) => {
    const activeElements: object[] = [];
    const offset: { x: number, y: number } = {x: 0, y: 0};

    type rectangle = {
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: string
    }

    let isCollisionDetected: boolean = false,
        attachedDragHandle: rectangle,
        movingElement: rectangle,
        dragHandle: rectangle,
        mountedElement: rectangle;

    const draw: () => void = () => {
        const staticElements: object[] = [
            new Rectangle(20, 20, 100, 100, 'wheat'),
            new Rectangle(20, 20, 80, 100, 'wheat'),
            new Rectangle(20, 20, 70, 100, 'wheat'),
            new Rectangle(20, 20, 90, 100, 'wheat'),
        ];
        let elements: object[] = [...staticElements, ...activeElements];
        elements = elements.filter(Boolean);
        context.clearRect(0, 0, width, height);
        elements.map(el => drawElements(el));
    };

    const drawElements: (rectangle) => void = (el) => {
        context.fillStyle = el.fillColor;
        context.beginPath();
        context.fillRect(el.x, el.y, el.width, el.height);
        context.fill();
    };

    const initUpdate: (join: boolean, event: any) => void = (join, event) => {
        let side = utils.getCollisionSide(dragHandle, mountedElement);
        isCollisionDetected = join;
        join ? attachDragHandle(side) : detach(event);
    };

    const attachDragHandle: (side: string) => void = (side) => {
        switch (side) {
            case constants.SIDES.TOP:
                attachedDragHandle = {
                    x: mountedElement.x,
                    y: mountedElement.y - dragHandle.height,
                    width: dragHandle.width,
                    height: dragHandle.height,
                    fillColor: dragHandle.fillColor
                };
                dragHandle.fillColor = 'transparent';
                break;

            case constants.SIDES.LEFT:
                attachedDragHandle = {
                    x: mountedElement.x - dragHandle.width,
                    y: mountedElement.y,
                    width: dragHandle.width,
                    height: dragHandle.height,
                    fillColor: dragHandle.fillColor
                };
                dragHandle.fillColor = 'transparent';
                break;

            case constants.SIDES.RIGHT:
                attachedDragHandle = {
                    x: mountedElement.x + dragHandle.width,
                    y: mountedElement.y,
                    width: dragHandle.width,
                    height: dragHandle.height,
                    fillColor: dragHandle.fillColor
                };
                dragHandle.fillColor = 'transparent';
                break;

            case constants.SIDES.BOTTOM:
                attachedDragHandle = {
                    x: mountedElement.x,
                    y: mountedElement.y + dragHandle.height,
                    width: dragHandle.width,
                    height: dragHandle.height,
                    fillColor: dragHandle.fillColor
                };
                dragHandle.fillColor = 'transparent';
                break;

            default:
                return;
        }
    };

    const detach: (event: any) => void = (event) => {
        dragHandle = {
            x: event.clientX - offset.x,
            y: event.clientY - offset.y,
            width: attachedDragHandle.width,
            height: attachedDragHandle.height,
            fillColor: attachedDragHandle.fillColor
        };

        attachedDragHandle = null;
    };

    const updateMountedElement: () => void = () => {
        console.log(1);
    };

    document.body.addEventListener("mousedown", (event) => {
        const onMouseMove: (event: any) => void = (event) => {
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

        const onMouseUp: () => void = () => {
            document.body.removeEventListener("mousemove", onMouseMove);
            document.body.removeEventListener("mouseup", onMouseUp);
            if (!mountedElement) {
                mountedElement = dragHandle;
                activeElements.push(mountedElement);
            }
            if (utils.rectIntersect(dragHandle, mountedElement) && isCollisionDetected && attachedDragHandle) {
                updateMountedElement();
            }
            dragHandle = null;
        };

        if (dragHandle) {
            document.body.addEventListener("mousemove", onMouseMove);
            document.body.addEventListener("mouseup", onMouseUp);
            dragHandle = movingElement;
            activeElements.push(dragHandle);
            offset.x = event.clientX - movingElement.x;
            offset.y = event.clientY - movingElement.y;
        }
    });

    draw();

};




