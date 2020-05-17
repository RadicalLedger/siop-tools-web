const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin  = require('copy-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
    entry: {
     app: './src/client/scripts/index.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
        },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,}],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },    
    // node: {
    //     fs:"empty",
    //     net: "empty",
    //     tls:"empty"
    // },    
    plugins: [
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ['build']}),
        new CopyPlugin({
            patterns: [
                { from: 'src/client/html/index.html', to: './' },
                { from: 'src/client/html/generate_did.html', to: './' }
            ]
        }),
        new NodemonPlugin()            
    ]
}
