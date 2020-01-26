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
    public side: string;

    private getCenterX: () => number = () => this.x + this.width * 0.5;
    private getCenterY: () => number = () => this.y + this.height * 0.5;
    private getLeft: () => number = () => this.x;
    private getRight: () => number = () => this.x + this.width;
    private getTop: () => number = () => this.y;
    private getBottom: () => number = () => this.y + this.height;


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
        let vector_x, vector_y;
        // get the distance between center points
        vector_x = this.getCenterX() - rectangle.getCenterX();
        vector_y = this.getCenterY() - rectangle.getCenterY();
        // is the y vector longer than the x vector?
        if (vector_y * vector_y > vector_x * vector_x) {// square to remove negatives
            // is the y vector pointing down?
            if (vector_y > 0) {
                this.side = constants.SIDES.BOTTOM;
                this.y = rectangle.getBottom();
            } else { // the y vector is pointing up
                this.side = constants.SIDES.TOP;
                this.y = rectangle.y - this.height;
            }
        } else { // the x vector is longer than the y vector
            // is the x vector pointing right?
            if (vector_x > 0) {
                this.side = constants.SIDES.RIGHT;
                this.x = rectangle.getRight();
            } else { // the x vector is pointing left
                this.side = constants.SIDES.LEFT;
                this.x = rectangle.x - this.width;

            }
        }

    }
}

export default Rectangle;

