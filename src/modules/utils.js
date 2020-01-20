let utils = {
    pointInInitialRect: (x, y, rect) => {
        return utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height);
    },

    inRange: (value, min, max) => {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },
    rangeIntersect: (min0, max0, min1, max1) => {

        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    },
    rectIntersect: (r0, r1) => {
        return utils.rangeIntersect(r0.x, r0.x + r0.width + 10, r1.x, r1.x + r1.width + 10) &&
            utils.rangeIntersect(r0.y, r0.y + r0.height + 10, r1.y, r1.y + r1.height + 10);
    },
    getCollisionSide: (r0, r1) => {
        let position = '';
        if (r0.y + r0.height < r1.y) {
            position = 'top';
        }
        if (r0.y >= r1.y + r1.height) {
            position ='bottom';
        }
        if (r0.x >= r1.x + r1.width) {
            position = 'right';
        }
        if (r0.x + r0.width <= r1.x) {
            position = 'left';
        }
        return position;
    }

};

export default utils;