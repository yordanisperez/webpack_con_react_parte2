const htmlWebpackPlugin =require('html-webpack-plugin')
const miniCssExtractPlugin=require('mini-css-extract-plugin');
const { TRUE } = require('node-sass');
module.exports ={
    mode: 'production', //production or development
    devtool: 'source-map',//eval or eval-source-map or source-map recomendado para production
    devServer:{
        port:3000
    },
    entry: 
        {
            comp1:
            {
                import: './component-1.js',
                dependOn: 'obj',
            },
            comp2: 
            {
                import: './component-2.js',
                dependOn: 'obj',
            },
            obj: 
            {
                import: './obj.js',
             
            }
        },
    output:{
        path:__dirname+'/build',
        filename: '[name].bundle.js'
    }/*,
    optimization: {
        runtimeChunk: 'single',
    }*/,
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
                     options:{sourseMap:true}
                    },
                    {
                      loader:"sass-loader",
                      options:{sourseMap:true}
                    }
                ]
          },
          {
              test:/\.js$/,
              use:'babel-loader',
              exclude:'/node_modules/'
          }
        ], 
      },
    plugins:[new htmlWebpackPlugin({
        template:'./index.html'
    }),
    new miniCssExtractPlugin({
        filename:'bundle.css',
    })

    ]
}