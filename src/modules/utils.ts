import {constants} from "./constants";

let utils = {
    pointInRect: (x, y, rect) => {
        return utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height);
    },
    inRange: (value, min, max) => {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    getDistance: (r0, r1) => {
        let xDistance = r1.x - r0.x;
        let yDistance = r1.y - r0.y;

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    },
    rangeIntersect: (min0, max0, min1, max1) => {

        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    },
    rectIntersect: (r0, r1) => {
        return utils.rangeIntersect(r0.x, r0.x + r0.width + constants.COLLISION_DISTANCE, r1.x, r1.x + r1.width + constants.COLLISION_DISTANCE) &&
            utils.rangeIntersect(r0.y, r0.y + r0.height + constants.COLLISION_DISTANCE, r1.y, r1.y + r1.height + constants.COLLISION_DISTANCE);
    },
    getCollisionSide: (r0, r1) => {
        let position = '';
        if (r0.y + r0.height <= r1.y) {
            position = constants.SIDES.TOP;
        }
        if (r0.y >= r1.y + r1.height) {
            position = constants.SIDES.BOTTOM;
        }
        if (r0.x >= r1.x + r1.width) {
            position = constants.SIDES.RIGHT;
        }
        if (r0.x + r0.width <= r1.x) {
            position = constants.SIDES.LEFT;
        }
        return position;
    },
};

export default utils;