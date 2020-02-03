import {constants} from './constants'

class Rectangle {
    constructor(x: number, y: number, width: number, height: number, fillColor: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
    }

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public fillColor: string;

    private vector: number;

    private getCenterX: () => number = () => this.x + this.width * 0.5;
    private getCenterY: () => number = () => this.y + this.height * 0.5;
    private getLeft: () => number = () => this.x;
    private getRight: () => number = () => this.x + this.width;
    private getTop: () => number = () => this.y;
    private getBottom: () => number = () => this.y + this.height;

    private align: (side: string , attribute: string ,rectangle: Rectangle) => void = (side, attribute, rectangle) => {
        if (this[side] + this[attribute] >= rectangle[side] && this[side] >= rectangle[side] - constants.COLLISION_DISTANCE && this[side] + this[attribute] <= rectangle[side] + rectangle[attribute]) {
            this[side] = rectangle[side];
        } else if (this[side] + this[attribute] <= rectangle[side] + rectangle[attribute] + constants.COLLISION_DISTANCE && this[side] >= rectangle[side] + constants.COLLISION_DISTANCE) {
            this[side] = rectangle[side] + rectangle[attribute] - this[attribute];
        }
    };

    public testCollision: (rectangle: Rectangle) => boolean = (rectangle) => {
        let result: boolean;
        (this.getTop() > rectangle.getBottom() + constants.COLLISION_DISTANCE ||
            this.getRight() < rectangle.getLeft() - constants.COLLISION_DISTANCE ||
            this.getBottom() < rectangle.getTop() - constants.COLLISION_DISTANCE ||
            this.getLeft() > rectangle.getRight() + constants.COLLISION_DISTANCE) ?
            result = false : result = true;
        return result;
    };

    public resolveCollision: (rectangle: Rectangle) => void = (rectangle) => {
        let vectorX, vectorY;

        vectorX = this.getCenterX() - rectangle.getCenterX();
        vectorY = this.getCenterY() - rectangle.getCenterY();

        if (vectorY * vectorY > vectorX * vectorX) {
            if (vectorY > 0) {
                this.y = rectangle.y + rectangle.height;
            } else {
                this.y = rectangle.y - this.height;
            }
            this.align('x','width', rectangle);
        } else {
            if (vectorX > 0) {
                this.x = rectangle.x + rectangle.width;
            } else {
                this.x = rectangle.x - this.width;
            }
            this.align('y', 'height', rectangle);
        }

    }
}

export default Rectangle;

