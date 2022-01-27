const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin= require('terser-webpack-plugin');
const path = require('path');


module.exports = {
    entry: { 
        index: path.resolve(__dirname, '../src/index') 
    },
    output: {
        filename: 'js/[name]_[chunkhash:8].js',
        path: path.resolve(__dirname, '../build'),
        publicPath: "/",
        clean: true,
    },
    target: 'web', 
    stats: "errors-warnings",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(le|c)ss$/,
                use: [ 
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            }
                        }
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|svg|gif|webp)$/,
                type: 'asset',
                generator: {
                    filename: 'images/[hash][ext][query]' // 局部指定输出位置
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 限制于 8kb
                    }
                }
            }
        ],
    },
    plugins: [
        new ProgressBarPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html', // 指定入口模板文件（相对于项目根目录）
            filename: 'index.html', // 指定输出文件名和位置（相对于输出目录）
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[chunkhash:8].css',
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false, //不提取注释到单独文件
            })
        ]
    },
    // externals: [
    //   {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM',
    //     'react-router-dom': 'ReactRouterDOM',
    //     'lodash': 'LODASH',
    //     '@eigen/microAppSDK': 'AMASDK',
    //     'axios': 'AXIOS',
    //     'antd': 'antd',
    //   }
    // ]
};