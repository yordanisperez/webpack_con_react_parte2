/** @type {import('webpack').Configuration} */
const path=require("path")

const htmlWebpackPlugin =require('html-webpack-plugin');
const miniCssExtractPlugin=require('mini-css-extract-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');


module.exports ={
  

    devServer:{
        port:3000
    },
    entry: 
        {

            main: 
            {
                import: './src/index.js',
             
            }
        },
    output:{
        path:path.resolve(__dirname,'../build'),
        filename: '[name].[contenthash].js',
        publicPath:""
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: [miniCssExtractPlugin.loader, "css-loader"],
          },
          {
              test:/.scss$/,
              use:
              [
                     {
                      loader:miniCssExtractPlugin.loader
                     }, 
                    {
                     loader:"css-loader" ,
                    
                    },
                    {
                      loader:"sass-loader",
                     
                    }
                ]
          },
          {
              test:/\.(js|jsx)$/,
              use:'babel-loader',
             // include: path.resolve(__dirname, '../src'),
              exclude:/node_modules/, //path.resolve(__dirname, '../node_modules'),
              
          },
          {
              type:"asset",
              test:/\.(png|svg|jpg|jpeg|gif)$/i,
             // include: path.resolve(__dirname, '../src'),
              exclude:/node_modules/, //path.resolve(__dirname, '../node_modules'),
          }
        ], 

      },
    plugins:[new htmlWebpackPlugin({
        template:'./src/index.html'
    }),
    new miniCssExtractPlugin({
        filename:'bundle.css',
    }),
    new CleanWebpackPlugin()

    ],
    resolve:{
        extensions:['.js','.jsx','.json'],
    },
}