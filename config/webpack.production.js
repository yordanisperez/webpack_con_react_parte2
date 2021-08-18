/** @type {import('webpack').Configuration} */

const {  merge } = require('webpack-merge')
const common = require('./webpack.common')


const prod_config={
    devtool: 'source-map',//eval or eval-source-map or source-map recomendado para production
    mode: 'production', //production or development
    optimization:{
        splitChunks:{
            chunks:"all",
        },
    },
}
module.exports =merge(common,prod_config);
