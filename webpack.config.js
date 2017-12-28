/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 15:18:44 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-20 17:12:22
 */
import webpack from 'webpack';
import path from 'path';

const BASE_PATH = './src/app/js/';

module.exports = {
    entry:{
        index:BASE_PATH+'index'
    },
    output:{
        // //浏览器异步动态加载chunk的路径
        publicPath: '/js/',
        filename:'[name].js',
        // //未被列在entry中，却又需要被打包出来的文件命名配置，如
        // //const a= require.ensure([],function(require){},'a');
        // //第一个是依赖，第二个是回调，第三个参数就是name
        //一般用于动态加载不立即需要又较大的js文件
        chunkFilename:'[name].chunk.js'
        
    },
    resolve: {
        // 给路径添加别名，可有效避免模块中require的路径过长
        alias: {
            widget: path.resolve(__dirname, './src/widget')
        }
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader: "babel-loader"
                },
                //忽略文件夹
                exclude: /node_modules/
            }
        ]
    }
}