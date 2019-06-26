/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
/* eslint-disable indent */
// 引用path模組
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

function resolve(dir) {
    // console.log(path.join(__dirname, dir));
    // return path.join(__dirname, '..', dir);
    return path.join(__dirname, dir)
}

// const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
    mode: 'production',
    // 這個webpack打包的對象，這裡面加上剛剛建立的index.js
    entry: {
        index: './src/main.js'
    },
    output: {
        // 這裡是打包後的檔案名稱
        filename: '[name].[hash:8].js',
        // publicPath: '/',
        // 打包後的路徑，這裡使用path模組的resolve()取得絕對位置，也就是目前專案的根目錄
        path: path.join(__dirname, './dist')
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(vue|js|jsx)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                enforce: 'pre'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {// 如果有这个设置则不用再添加.babelrc文件进行配置
                    'babelrc': false, // 不采用.babelrc的配置
                    'plugins': [
                        'dynamic-import-webpack'
                    ]
                }
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: 'resources/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    !isProduction ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    }]
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    !isProduction ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
            // 指定輸出位置
            // [name] 為上方進入點設定的 "名稱"
            filename: './css/[name].css',
            chunkFilename: './css/[name].[hash].css'
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    }
};
