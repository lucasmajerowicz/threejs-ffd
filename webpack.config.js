const webpack = require('webpack');
const path = require('path');
const appPath = path.join(__dirname, 'app');
const distPath = path.join(__dirname, 'dist');
const exclude = [/node_modules/];
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    context: appPath,
    entry: {
        app: './main.js'
    },
    output: {
        path: distPath,
        publicPath: '/',
        filename: 'bundle.[hash].js'
    },
    plugins: [

        // Generate index.html with included script tags
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './template.html'
        }),

        // Remove all files in dist before creating a production package
        new CleanPlugin(['dist'])
    ],
    module: {
        noParse: [/app\/bin/],
        loaders: [
            { test: require.resolve('three'),
                loader: 'expose?THREE'
            },
            {
                test: /.jsx?$/,
                exclude: exclude,
                loader: 'babel'
            }
        ]
    },
    devServer: {
        contentBase: './app'
    },
    resolve: {
        root: [
            path.resolve('./app')
        ]
    },
    node: {
        fs: 'empty'
    }
};

module.exports = config;
