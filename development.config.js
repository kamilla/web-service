const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    //context: "./src",
    entry: "./src/es6",
    output: {
        path: "./public_html/js/",
        filename: "index.js"
    },
    module: {
        rules:  [
            {
                test: require.resolve('backbone'),   ///backbone\.js$/,
                loader: 'imports-loader?define=>false'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', { "modules": false }]
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("../css/style.css"),
        // new webpack.IgnorePlugin(/^jquery$/)
    ]
};