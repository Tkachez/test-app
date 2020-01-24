import {constants} from './constants';
import utils from "./utils";
import Rectangle from "./rectangle";

type rectangle = {
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string
}

export class App {
    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

    private rectangles: rectangle[];
    private activeElements: rectangle[];
    private staticElements: rectangle[];
    private context: CanvasRenderingContext2D;
    private isCollisionDetected: boolean = false;
    private dragHandle: rectangle;
    private mountedElement: rectangle;
    private attachedDragHandle: rectangle;
    private width: number;
    private height: number;
    private offset: {
        x: number,
        y: number
    };

    private drawElements: (el: rectangle) => void = (el) => {
        this.context.fillStyle = 'wheat';
        this.context.beginPath();
        this.context.fillRect(el.x, el.y, el.width, el.height);
        this.context.fill();
    };

    private draw: () => void = () => {
        this.rectangles = this.activeElements ? [...this.staticElements, ...this.activeElements]
            : [...this.staticElements];

        return this.rectangles.map(el => this.drawElements(el));
    };

    private initUpdate: (join: boolean, event: any) => void = (join, event) => {
        let side = utils.getCollisionSide(this.dragHandle, this.mountedElement);
        this.isCollisionDetected = join;
        join ? this.attachDragHandle(side) : this.detach(event);
    };

    private attachDragHandle: (side: string) => void = (side) => {
        switch (side) {
            case constants.SIDES.TOP:
                this.attachedDragHandle = new Rectangle(
                    this.mountedElement.x,
                    this.mountedElement.y - this.dragHandle.height,
                    this.dragHandle.width,
                    this.dragHandle.height,
                    this.dragHandle.fillColor);
                this.activeElements.pop();
                this.activeElements.push(this.attachedDragHandle);
                break;

            case constants.SIDES.LEFT:
                this.attachedDragHandle = new Rectangle(this.mountedElement.x - this.dragHandle.width,
                    this.mountedElement.y,
                    this.dragHandle.width,
                    this.dragHandle.height,
                    this.dragHandle.fillColor
                );
                this.activeElements.pop();
                this.activeElements.push(this.attachedDragHandle);
                break;

            case constants.SIDES.RIGHT:
                this.attachedDragHandle = new Rectangle(
                    this.mountedElement.x + this.dragHandle.width,
                    this.mountedElement.y,
                    this.dragHandle.width,
                    this.dragHandle.height,
                    this.dragHandle.fillColor
                );
                this.activeElements.pop();
                this.activeElements.push(this.attachedDragHandle);
                break;

            case constants.SIDES.BOTTOM:
                this.attachedDragHandle = new Rectangle(
                    this.mountedElement.x,
                    this.mountedElement.y + this.dragHandle.height,
                    this.dragHandle.width,
                    this.dragHandle.height,
                    this.dragHandle.fillColor
                );
                this.activeElements.pop();
                this.activeElements.push(this.attachedDragHandle);
                break;

            default:
                return;
        }
    };

    private detach: (event: any) => void =(event) => {
        console.log(event);
    };

    private updateMountedElement: () => void = () => {
      console.log(111);
    };

    private onMouseDown: (event: any) => void = (event) => {
        if (this.dragHandle) {
            document.body.addEventListener("mousemove", this.onMouseMove);
            document.body.addEventListener("mouseup", this.onMouseUp);
            this.activeElements.push(this.dragHandle);
            this.offset.x = event.clientX - this.dragHandle.x;
            this.offset.y = event.clientY - this.dragHandle.y;
        }
    };

    private onMouseMove = (event) => {
        if (this.dragHandle) {
            this.dragHandle.x = event.clientX - this.offset.x;
            this.dragHandle.y = event.clientY - this.offset.y;
        }
        if (this.mountedElement) {
            if (utils.getDistance(this.dragHandle, this.mountedElement) > this.mountedElement.width + constants.COLLISION_DISTANCE && this.isCollisionDetected) {
                this.initUpdate(false, event);
            }
            if (utils.getDistance(this.dragHandle, this.mountedElement) < this.mountedElement.width + constants.COLLISION_DISTANCE && !this.isCollisionDetected) {
                this.initUpdate(true, event);
            }
        }
    };

    private onMouseUp: () => void = () => {
        document.body.removeEventListener("mousemove", this.onMouseMove);
        document.body.removeEventListener("mouseup", this.onMouseUp);
        if (!this.mountedElement) {
            this.mountedElement = this.dragHandle;
            this.activeElements.push(this.mountedElement);
        }
        if (utils.rectIntersect(this.dragHandle, this.mountedElement) && this.isCollisionDetected && this.attachedDragHandle) {
            this.updateMountedElement();
        }
        this.dragHandle = null;
    };

    private dispatchEvents = () => {
        document.body.addEventListener('mousedown', this.onMouseDown);

    };

    private animate = () => {
        this.draw();
        requestAnimationFrame(this.animate)
    };

    public init = () => {
        this.staticElements = [
            new Rectangle(20, 20, 100, 100, 'wheat'),
            new Rectangle(20, 140, 90, 100, 'wheat'),
            new Rectangle(20, 260, 80, 100, 'wheat'),
            new Rectangle(20, 380, 70, 100, 'wheat'),
            new Rectangle(20, 500, 60, 100, 'wheat'),
        ];
        this.dispatchEvents();
        this.animate()
    };
}

// const initUpdate: (join: boolean, event: any) => void = (join, event) => {
//     let side = utils.getCollisionSide(dragHandle, mountedElement);
//     isCollisionDetected = join;
//     join ? attachDragHandle(side) : detach(event);
// };
//
// const attachDragHandle: (side: string) => void = (side) => {
//
// };
//
// const detach: (event: any) => void = (event) => {
//     dragHandle = {
//         x: event.clientX - offset.x,
//         y: event.clientY - offset.y,
//         width: attachedDragHandle.width,
//         height: attachedDragHandle.height,
//         fillColor: attachedDragHandle.fillColor
//     };
//
//     attachedDragHandle = null;
// };
//
// const updateMountedElement: () => void = () => {
//     console.log(1);
// };




