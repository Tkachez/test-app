import { app }  from "./modules/app";

window.onload = () => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    app(context, width, height);
};
