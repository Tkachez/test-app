import utils from "./utils";
import Rectangle from "./rectangle";
import {constants} from "./constants";

export class App {
    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

    readonly width: number;
    readonly height: number;
    readonly context: CanvasRenderingContext2D;

    private rectangles: Rectangle[];
    private staticElements: Rectangle[] = [];
    private mountedElements: Rectangle[] = [];
    private dragHandle: Rectangle;
    private offset: { x?: number, y?: number } = {};

    private drawElements: (el: Rectangle) => void = (el) => {
        this.context.fillStyle = el.fillColor;
        this.context.beginPath();
        this.context.fillRect(el.x, el.y, el.width, el.height);
        this.context.fill();
    };

    private draw: () => void = () => {
        this.rectangles = [...this.staticElements, ...this.mountedElements];
        if(this.dragHandle){
            this.rectangles.push(this.dragHandle);
        }
        this.context.clearRect(0, 0, this.width, this.height);
        return this.rectangles.map(el => this.drawElements(el));
    };

    private saveToMounted: () => void = () => {
       this.mountedElements.push(this.dragHandle);
    };

    private returnToBase: () => void = () => {
        this.dragHandle = null;
    };

    private getPointedRect: (event: MouseEvent) => Rectangle = (event) => {
        let activeElement: Rectangle;
        for (let element of this.staticElements){
            if (utils.pointInRect(event.x, event.y, element)) {
                activeElement = (new Rectangle(
                    element.x,
                    element.y,
                    element.width,
                    element.height,
                    element.fillColor
                ));
                return activeElement;
            }
        }
        return null;
    };

    private onMouseDown: (event: MouseEvent) => void = (event) => {
        this.dragHandle = this.getPointedRect(event);

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
        if (this.mountedElements.length && this.dragHandle) {
            this.mountedElements.map(el => {
                if (this.dragHandle.testCollision(el)) {
                    this.dragHandle.resolveCollision(el);
                    this.dragHandle.fillColor = constants.RECTANGLE.COLLISION_FILL_COLOR;
                    el.fillColor = constants.RECTANGLE.COLLISION_FILL_COLOR;
                } else {
                    this.dragHandle.fillColor = constants.RECTANGLE.FILL_COLOR;
                    el.fillColor = constants.RECTANGLE.FILL_COLOR;
                }
            });
        }
    };

    private onMouseUp: () => void = () => {
        let mountsNeedUpdate = false;
        if (!this.mountedElements.length) {
            this.mountedElements.push(this.dragHandle);
        } else if (this.mountedElements.length && this.dragHandle) {
            this.mountedElements.map(el => {
                if(this.dragHandle.testCollision(el)) {
                    el.fillColor = constants.RECTANGLE.FILL_COLOR;
                    this.dragHandle.fillColor = constants.RECTANGLE.FILL_COLOR;
                    mountsNeedUpdate = true
                }
            });
        }

        mountsNeedUpdate ? this.saveToMounted() : this.returnToBase();
        this.mountedElements = [...new Set(this.mountedElements)];
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
            new Rectangle(20, 20, 100, 100, constants.RECTANGLE.FILL_COLOR),
            new Rectangle(20, 140, 90, 100, constants.RECTANGLE.FILL_COLOR),
            new Rectangle(20, 260, 80, 100, constants.RECTANGLE.FILL_COLOR),
            new Rectangle(20, 380, 70, 100, constants.RECTANGLE.FILL_COLOR),
            new Rectangle(20, 500, 60, 100, constants.RECTANGLE.FILL_COLOR),
        ];
        this.dispatchEvents();
        this.animate()
    };
}