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
    private intersectedElement: Rectangle;
    private dragHandle: Rectangle;
    private offset: { x?: number, y?: number } = {};

    private drawElements: (el: Rectangle) => void = (el) => {
        this.context.fillStyle = el.fillColor;
        this.context.beginPath();
        this.context.fillRect(el.x, el.y, el.width, el.height);
        this.context.fill();
        this.context.beginPath();
        this.context.rect(el.x, el.y, el.width, el.height);
        this.context.stroke();
    };

    private draw: () => void = () => {
        this.rectangles = [...this.staticElements, ...this.mountedElements];
        if (this.dragHandle) {
            this.rectangles.push(this.dragHandle);
        }
        this.context.clearRect(0, 0, this.width, this.height);
        return this.rectangles.map(el => this.drawElements(el));
    };

    private getPointedRect: (event: MouseEvent) => Rectangle = (event) => {
        let activeElement: Rectangle;
        for (let element of this.staticElements) {
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
            this.mountedElements.map(rect => {
                if (this.testCollision(rect)) {
                    this.resolveCollision(rect);
                    rect.fillColor = constants.RECTANGLE.COLLISION_FILL_COLOR;
                    this.dragHandle.fillColor = constants.RECTANGLE.COLLISION_FILL_COLOR;
                } else {
                    rect.fillColor = constants.RECTANGLE.FILL_COLOR;
                    this.dragHandle.fillColor = constants.RECTANGLE.FILL_COLOR;
                }
                if (this.testIntersection()) {
                    this.resolveIntersection(event);
                }
            });
        }
    };

    private testCollision: (rectangle: Rectangle) => boolean = (rectangle) => {
        let dx = rectangle.cx - this.dragHandle.cx;// x difference between centers
        let dy = rectangle.cy - this.dragHandle.cy;// y difference between centers
        let aw = (rectangle.width + this.dragHandle.width + constants.COLLISION_DISTANCE) * 0.5;
        let ah = (rectangle.height + this.dragHandle.height + constants.COLLISION_DISTANCE) * 0.5;

        return !(Math.abs(dx) > aw || Math.abs(dy) > ah);
    };

    private testIntersection: () => boolean = () => {
        let intersected = false;
        this.mountedElements.map(rect => {
            if ((this.dragHandle.x > rect.x && this.dragHandle.x + this.dragHandle.width <= rect.x + rect.width)
                && this.dragHandle.y + this.dragHandle.height > rect.y && this.dragHandle.y < rect.y + rect.height) {
                this.intersectedElement = rect;
                intersected = true;
            }
        });
        return intersected;
    };

    private resolveIntersection: (event: MouseEvent) => void = (event) => {
        let xPoints = this.mountedElements.map(rect => rect.x),
            leftEdge = Math.min(...xPoints),
            rightEdge;

        this.mountedElements.map(rect => {
            if (rect.x === Math.max(...xPoints)) {
                rightEdge = rect.x + rect.width;
            }
        });

       if (leftEdge * 2 + constants.COLLISION_DISTANCE < event.clientX) {
           this.dragHandle.x = rightEdge + this.dragHandle.width;
       } else {
           this.dragHandle.x = leftEdge - this.dragHandle.width;
       }

    };

    private resolveCollision: (rectangle: Rectangle) => void = (rectangle) => {

        let dx = rectangle.cx - this.dragHandle.cx;// x difference between centers
        let dy = rectangle.cy - this.dragHandle.cy;// y difference between centers

        if (Math.abs(dx / this.dragHandle.width) > Math.abs(dy / this.dragHandle.height)) {
            if (dx < 0) {
                this.dragHandle.x = rectangle.x + rectangle.width;

            } else {
                this.dragHandle.x = rectangle.x - this.dragHandle.width;
            }
        } else {
            if (dy < 0) {
                this.dragHandle.y = rectangle.y + rectangle.height;
            } else {
                this.dragHandle.y = rectangle.y - this.dragHandle.height;
            }
        }
    };

    private onMouseUp: () => void = () => {
        if (!this.mountedElements.length) {
            this.mountedElements.push(this.dragHandle);
        } else if (this.mountedElements.length && this.dragHandle) {
            this.mountedElements.map(el => {
                if (this.testCollision(el)) {
                    el.fillColor = constants.RECTANGLE.FILL_COLOR;
                    this.dragHandle.fillColor = constants.RECTANGLE.FILL_COLOR;
                    this.mountedElements.push(this.dragHandle);
                }
            });
        }
        this.dragHandle = null;
        this.mountedElements = [...new Set(this.mountedElements)];
        this.mountedElements.map(rect => rect.fillColor = constants.RECTANGLE.FILL_COLOR);
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