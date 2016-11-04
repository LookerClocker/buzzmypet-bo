var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'App.js'),
    output: {
        filename: 'App.js',
        path: path.resolve(__dirname, 'public/build'),
        publicPath: path.resolve(__dirname, 'public/build')
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        loaders: [
            // {
            //     exclude: /node_modules/,
            //     loader: 'babel',
            //     test: /\.js$/,
            // },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ["es2015", "stage-0", "react"]
                }

            },

            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000'
            }, {
                test: /\.(eot|ttf|wav|mp3)$/,
                loader: 'file-loader'
            }
        ]
    }
};