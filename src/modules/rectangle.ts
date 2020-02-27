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

    public get cx() { return this.x + this.width * 0.5; }
    public get cy() { return this.y + this.height * 0.5; }


}

export default Rectangle;

