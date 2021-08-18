/** @type {import('webpack').Configuration} */
const {HotModuleReplacementPlugin} = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {  merge } = require('webpack-merge');
const common = require('./webpack.common');


const development_config={
    devtool: 'eval-source-map',//eval or eval-source-map or source-map recomendado para production
    devServer:{
        port:3000,
        contentBase: "../build",
        open:"firefox",
        hot:true,      
    },
    mode: 'development', //production or development
    target:"web",
    plugins:[new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
    ],
}
module.exports =merge(common,development_config);
