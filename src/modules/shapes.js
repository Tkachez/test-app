import Rectangle from "./rectangle";

export const shapes = () => {
    return [
        new Rectangle(20,20, 100, 50, 'wheat'),
        new Rectangle(20,90, 100, 80, 'wheat'),
        new Rectangle(20,190, 100, 70, 'wheat'),
        new Rectangle(20,280, 100, 60, 'wheat'),
        new Rectangle(20,360, 100, 100, 'wheat'),
    ];
};