var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'app', 'app.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/build'),
        publicPath: path.resolve(__dirname, 'public/build')
    },

    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                test: /\.js$/,
            },
        ]
    }
};