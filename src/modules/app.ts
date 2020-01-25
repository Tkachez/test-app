import {constants} from './constants';
import utils from "./utils";
import Rectangle from "./rectangle";

export class App {
    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

    readonly width: number;
    readonly height: number;

    private attachmentSide: string;
    private rectangles: Rectangle[];
    private activeElements: Rectangle[] = [];
    private staticElements: Rectangle[];
    private context: CanvasRenderingContext2D;
    private isCollisionDetected: boolean = false;
    private dragHandle: Rectangle;
    private mountedElement: Rectangle;
    private attachedDragHandle: Rectangle;
    private offset: { x?: number, y?: number } = {};

    private drawElements: (el: Rectangle) => void = (el) => {
        this.context.fillStyle = 'wheat';
        this.context.beginPath();
        this.context.fillRect(el.x, el.y, el.width, el.height);
        this.context.fill();
    };

    private draw: () => void = () => {
        this.rectangles = this.activeElements ? [...this.staticElements, ...this.activeElements]
            : [...this.staticElements];
        this.context.clearRect(0, 0, this.width, this.height);
        return this.rectangles.map(el => this.drawElements(el));
    };

    private initUpdate: (join: boolean, event: MouseEvent) => void = (join, event) => {
        this.attachmentSide = utils.getCollisionSide(this.dragHandle, this.mountedElement);
        this.isCollisionDetected = join;
        join ? this.attachDragHandle() : this.detach(event);
    };

    private attachDragHandle: () => void = () => {
        switch (this.attachmentSide) {
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

    private detach: (event: MouseEvent) => void = (event) => {
        let detachedElement = this.activeElements.pop();
        this.dragHandle = new Rectangle(
            event.x,
            event.y,
            detachedElement.width,
            detachedElement.height,
            detachedElement.fillColor);
        this.activeElements.push(this.dragHandle);
    };


    private updateMountedElement: () => void = () => {
        this.activeElements.push(this.attachedDragHandle);
        this.activeElements = [...new Set(this.activeElements)];
        this.dragHandle = null;
    };

    private returnToBase: (target: Rectangle) => void = () => {
       this.activeElements.pop();
    };

    private getPointedRect: (event: MouseEvent) => Rectangle = (event) => {
        let elements = this.rectangles,
            activeElement;

        elements.map(el => {
            if (utils.pointInRect(event.x, event.y, el)) {
                this.dragHandle = (new Rectangle(
                    el.x,
                    el.y,
                    el.width,
                    el.height,
                    el.fillColor
                ));
                this.activeElements.push(this.dragHandle);
                return activeElement;
            }
        });
        return null;
    };

    private onMouseDown: (event: MouseEvent) => void = (event) => {
        this.getPointedRect(event);
        if (this.dragHandle) {
            document.body.addEventListener("mousemove", this.onMouseMove);
            document.body.addEventListener("mouseup", this.onMouseUp);
            this.offset.x = event.clientX - this.dragHandle.x;
            this.offset.y = event.clientY - this.dragHandle.y;
        }
    };

    private onMouseMove: (event: MouseEvent) => void = (event) => {
        if (this.dragHandle) {
            this.dragHandle.x = event.clientX - this.offset.x;
            this.dragHandle.y = event.clientY - this.offset.y;
        }
        if (this.mountedElement) {
            console.log(this.dragHandle.testCollision(this.mountedElement));
            if(this.dragHandle.testCollision(this.mountedElement)){
                this.dragHandle.resolveCollision(this.mountedElement);
            }

            // if (utils.getDistance(this.dragHandle, this.mountedElement) > this.mountedElement.width + constants.COLLISION_DISTANCE && this.isCollisionDetected) {
            //     // this.initUpdate(false, event);
            // }
            // if (utils.getDistance(this.dragHandle, this.mountedElement) < this.mountedElement.width + constants.COLLISION_DISTANCE && !this.isCollisionDetected) {
            //     // this.initUpdate(true, event);
            // }
        }
    };

    private onMouseUp: () => void = () => {
        if (!this.mountedElement) {
            this.mountedElement = this.dragHandle;
            this.activeElements.push(this.mountedElement);
        }
        if (utils.rectIntersect(this.dragHandle, this.mountedElement) && this.isCollisionDetected && this.attachedDragHandle) {
            this.updateMountedElement();
        } else {
            this.attachedDragHandle = null;
            this.returnToBase(this.dragHandle);
        }

        this.activeElements = [...new Set(this.activeElements)];
        document.body.removeEventListener("mousemove", this.onMouseMove);
        document.body.removeEventListener("mouseup", this.onMouseUp);
    };

    private dispatchEvents: () => void = () => {
        document.body.addEventListener('mousedown', this.onMouseDown);
    };

    private animate: () => void = () => {
        this.draw();
        requestAnimationFrame(this.animate)
    };

    public init: () => void = () => {
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