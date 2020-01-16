export default class Rectangle {
    constructor(x, y, fillColor, borderColor) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        // this.isMoving = false;
        // this.isTarget = false;
        // this.draw = this.draw.bind(this);
        // this.init = this.init.bind(this);
        // this.move = this.move.bind(this);
        // this.stopMoving = this.stopMoving.bind(this);
    }

    // draw() {
    //     if (this.isMoving && this.isTarget) {
    //         context.shadowColor = "gray";
    //         context.shadowOffsetX = 4;
    //         context.shadowOffsetY = 4;
    //         context.shadowBlur = 8;
    //     } else {
    //         context.shadowOffsetX = 4;
    //         context.shadowOffsetY = 4;
    //         context.shadowBlur = 8;
    //     }
    //
    //     context.fillStyle = this.color;
    //     context.beginPath();
    //     context.fillRect(this.x, this.y, this.width, this.height);
    //     context.fill();
    //     context.strokeStyle = "black";
    //     context.lineWidth = 2;
    //     context.strokeRect(this.x, this.y, this.width, this.height);
    // };
    //
    // stopMoving() {
    //     this.isTarget = false;
    //     this.isMoving = false;
    //     this.draw();
    // }

    // move() {
    //     this.isTarget = true;
    //     this.isMoving = true;
        // this.draw();
    // };

}