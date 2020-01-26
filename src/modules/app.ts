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
    private activeElements: Rectangle[] = [];
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
        this.rectangles = this.activeElements ? [...this.staticElements, ...this.mountedElements, ...this.activeElements]
            : [...this.staticElements];
        this.context.clearRect(0, 0, this.width, this.height);
        return this.rectangles.map(el => this.drawElements(el));
    };

    private align: (mount: Rectangle, target: Rectangle) => void = (mount,target) => {
        switch (target.side) {
            case constants.SIDES.LEFT:
                target.y = mount.y;
                break;
            case constants.SIDES.RIGHT:
                target.y = mount.y;
                break;
            case constants.SIDES.TOP:
                target.x = mount.x;
                break;
            case  constants.SIDES.BOTTOM:
                target.x = mount.x;
                break;
            default: return
        }
    };

    private returnToBase: () => void = () => {
        this.activeElements.pop();
    };

    private getPointedRect: (event: MouseEvent) => Rectangle = (event) => {
        let elements = this.staticElements,
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
        if (this.mountedElements.length) {
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
        if (!this.mountedElements.length) {
            this.mountedElements.push(this.dragHandle);
        } else {
            this.mountedElements.map(el => {
                if(this.dragHandle.testCollision(el)){
                    this.mountedElements.push(this.dragHandle);
                    this.align(el,this.dragHandle);
                    el.fillColor = constants.RECTANGLE.FILL_COLOR;
                    this.dragHandle.fillColor = constants.RECTANGLE.FILL_COLOR;
                } else {
                    this.returnToBase();
                }
            });
        }

        this.mountedElements = [...new Set(this.mountedElements)];
        this.dragHandle = null;
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