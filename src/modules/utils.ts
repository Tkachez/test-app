type rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
}

type utils = {
    pointInRect: (x: number, y: number, rect: rectangle) => boolean,
    inRange: (value: number, x: number, y: number) => boolean,
}

let utils: utils = {
    pointInRect: (x, y, rect) => {
        return utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height);
    },

    inRange: (value, min, max) => {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },
};

export default utils;