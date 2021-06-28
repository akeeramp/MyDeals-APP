const path = require('path');
const webpack = require('webpack');

module.exports = env => {
    const mode = env.mode ;
    return {
        mode: mode,
        entry: "./src/main.ts",
        watch: false,
        output: {
            path:path.resolve(__dirname,"src/dist"),
            filename: "bundle.js"
        },
        resolve: {
            // Add '.ts' and '.tsx' as a resolvable extension.
            extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },
        module: {
            rules :[{
                    test: /\.tsx?$/,
                    loader:"ts-loader"
                }]
        }
    }
};