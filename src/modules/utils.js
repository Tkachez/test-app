let utils = {
    pointInRect: (x, y, rect) => {
        return utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height);
    },

    inRange: (value, min, max) => {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    getDistance: (x1, x2, y1, y2) => {
        let xDistance = x2 - x1,
            yDistance = y2 - y1;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }
};

export default utils;