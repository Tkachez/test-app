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

    private get cx() { return this.x + this.width * 0.5; }
    private get cy() { return this.y + this.height * 0.5; }


    public resolveCollision: (rectangle: Rectangle) => boolean = (rectangle) => {
        let dx = rectangle.cx - this.cx;// x difference between centers
        let dy = rectangle.cy - this.cy;// y difference between centers
        let aw = (rectangle.width + this.width + constants.COLLISION_DISTANCE) * 0.5;
        let ah = (rectangle.height + this.height + constants.COLLISION_DISTANCE) * 0.5;

        /* If either distance is greater than the average dimension there is no collision. */
        if (Math.abs(dx) > aw || Math.abs(dy) > ah) return false;

        /* To determine which region of this rectangle the rect's center
        point is in, we have to account for the scale of the this rectangle.
        To do that, we divide dx and dy by it's width and height respectively. */
        if (Math.abs(dx / this.width) > Math.abs(dy / this.height)) {
            if (dx < 0) rectangle.x = this.x - rectangle.width;
            else rectangle.x = this.x + this.width;
        } else {
            if (dy < 0) rectangle.y = this.y - rectangle.height;
            else rectangle.y = this.y + this.height;
        }
        return true;
    }
}

export default Rectangle;

