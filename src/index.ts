import { App }  from "./modules/app";

window.onload = () => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const app = new App(context,width,height);
    app.init();
};
