import Shape from './rectangle';

let createShapes = () => {
    let arr = [];

    for (let i = 1; i < 100; i++) {
        let start = {
            x: 20,
            y: 20
        };
        arr.push(new Shape(start.x,start.y));
    }
    return arr;
};

const shapes = () => createShapes();

export default shapes;