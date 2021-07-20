const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
    const mode = env.mode ;
    if(mode =='development'){
        return {
            mode: mode,
            entry:{
                bundle: "./src/main.ts"
            },
            watch: false,
            output: {
                path:path.resolve(__dirname,"src/dist"),
                filename: "[name].js"
            },
            resolve: {
                // Add '.ts' and '.tsx' as a resolvable extension.
                mainFields: ['es2015', 'browser', 'module', 'main'],
                extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },
            module: {
                rules :[{
                        test: /\.tsx?$/,
                        loader:"ts-loader"
                    }]
                }
            }
    }
    else{
        return {
            mode: 'production',
            entry:{
                bundle: "./src/main.ts"
            },
            watch: false,
            output: {
                path:path.resolve(__dirname,"src/dist"),
                filename: "[name].js"
            },
            optimization:{
                minimize:true,
                mangleWasmImports: false,
                mangleExports: false,
                minimizer: [
                    new TerserPlugin({
                      terserOptions: {
                        toplevel:true,
                        sourceMap:false,
                        compress: true,
                        module: true,
                        mangle:false,
                      },
                    }),
                  ],
            },
            performance: {
                hints: false,
                maxEntrypointSize: 512000,
                maxAssetSize: 512000
            },
            resolve: {
                // Add '.ts' and '.tsx' as a resolvable extension.
                mainFields: ['es2015', 'browser', 'module', 'main'],
                extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },
            module: {
                rules :[{
                        test: /\.tsx?$/,
                        loader:"ts-loader"
                        },
                    ]
                },
            }
    }
    
};