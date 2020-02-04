let path = require('path');

let conf = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname,'./dist/main.js'),
        filename: 'main.js',
        publicPath: 'dist/',
    },
    devServer: {
        overlay: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
};

module.exports = (env,options) => {
    let production = options.mode === 'production';
    conf.devtool = production ? false : 'eval-sourcemap';

    return conf;
};