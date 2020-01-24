class Rectangle implements IRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;

    constructor(x: number, y: number, width: number, height: number, fillColor: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
    }
}

interface IRectangle {
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string
}

export default Rectangle;

