const { merge } = require('webpack-merge');
const common = require('./common.js');
const path = require('path');


module.exports = merge(common, {
    mode: 'development' , 
    devtool: 'source-map',
    devServer: {
        hot: true, //热更新
        // open: true, //编译完自动打开浏览器
        compress: true,//开启gzip压缩
        host: 'localhost',
        port: 3001, //开启端口号
        historyApiFallback: true,
        static: { //托管静态资源文件
          directory: path.join(__dirname, "../public"),
        },
        client: { 
            logging: "none",
            progress: true, //在浏览器端打印编译进度
        },
    },
});