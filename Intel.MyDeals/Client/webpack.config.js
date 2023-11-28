/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
// For analyzing build, should remain commented unless needed
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {
    const mode = env.mode;
    if (mode == 'development') {
        return {
            mode: mode,
            entry: {
                contract: "./src/appModules/contract/main-contract.ts",
                dashboard: "./src/appModules/dashboard/main-dashboard.ts",
                admin: "./src/appModules/admin/main-admin.ts",
                advance: "./src/appModules/advancesearch/main-advance.ts",
                report: "./src/appModules/reporting/main-report.ts",
                codingPractices: "./src/appModules/codingPractices/main-codingPractices.ts",
                globalStyle: './src/app/style/style.css',
            },
            cache: {
                type: 'filesystem',
                compression: 'gzip',
            },
            watch: false,
            output: {
                path: path.resolve(__dirname, "src/dist"),
                filename: "[name].js",
                clean: true
            },
            resolve: {
                // Add '.ts' and '.tsx' as a resolvable extension.
                mainFields: ['es2015', 'browser', 'module', 'main'],
                extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },
            plugins: [
                new MiniCssExtractPlugin(),
            ],
            optimization: {
                minimize: true,
                minimizer: [
                    new CssMinimizerPlugin(),
                ],
                // splitChunks: {
                //     chunks: 'all',
                //     maxAsyncRequests: 30,
                //     maxInitialRequests: 30,
                //     cacheGroups: {
                //         defaultVendors: {
                //             name: 'vendor',
                //             test: /[\\/]node_modules[\\/]/,
                //             priority: -10,
                //             reuseExistingChunk: true,
                //         },
                //     },
                // },
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: "ts-loader",
                        exclude: /node_modules/
                    },
                    {
                        test: /\.css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader']
                    }
                ]
            },
            //this will help to avoid sourcemap issue for chrome devtool to load
            devtool: "eval-cheap-source-map"
        };
    } else {
        return {
            mode: 'production',
            entry: {
                contract: "./src/appModules/contract/main-contract-prod.ts",
                dashboard: "./src/appModules/dashboard/main-dashboard-prod.ts",
                admin: "./src/appModules/admin/main-admin-prod.ts",
                advance: "./src/appModules/advancesearch/main-advance-prod.ts",
                report: "./src/appModules/reporting/main-report-prod.ts",
                codingPractices: "./src/appModules/codingPractices/main-codingPractices.ts",
                globalStyle: './src/app/style/style.css',
            },
            watch: false,
            output: {
                path: path.resolve(__dirname, "src/dist"),
                filename: "[name].js",
                clean: true
            },
            optimization: {
                minimize: true,
                mangleWasmImports: false,
                mangleExports: false,
                minimizer: [
                    new CssMinimizerPlugin(),
                    new TerserPlugin({
                        terserOptions: {
                            toplevel: true,
                            sourceMap: false,
                            compress: true,
                            module: true,
                            mangle: true,
                            format: {
                                comments: false,
                            },
                        },
                        extractComments: false,
                        // enable parallel running
                        parallel: true,
                    }),
                ],
                // splitChunks: {
                //     chunks: 'all',
                //     maxAsyncRequests: 30,
                //     maxInitialRequests: 30,
                //     cacheGroups: {
                //         defaultVendors: {
                //             name: 'vendor',
                //             test: /[\\/]node_modules[\\/]/,
                //             priority: -10,
                //             reuseExistingChunk: true,
                //         },
                //     },
                // },
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
            plugins: [
                new MiniCssExtractPlugin(),
                new MinifyHtmlWebpackPlugin({
                    src: './src/app/',
                    dest: './src/app/',
                    ignoreFileNameRegex: /\.[tj]sx?$/,
                    rules: {
                        caseSensitive: true,
                        collapseWhitespace: true,
                        removeComments: true,
                        continueOnParseError: true,
                        minifyCSS: true
                    }
                })
            ],
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: "ts-loader",
                        exclude: /node_modules/
                    }, {
                        test: /\.css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader']
                    }
                ]
            }
        };
    }
};