import {app} from './modules/app';

window.onload = () => {
    const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        context.width = window.innerWidth;
        context.height = window.innerHeight;
    });

    app(context, width, height);
};
