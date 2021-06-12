const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/main.ts",
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
};