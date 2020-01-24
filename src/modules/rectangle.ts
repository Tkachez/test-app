export default class Rectangle {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private fillColor: string;

    constructor(x:number, y:number, width:number, height:number, fillColor: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
    }
}

