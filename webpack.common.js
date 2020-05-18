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
        path: path.resolve(__dirname, 'build/client')
        },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{loader:'ts-loader',
                    options:{
                        transpileOnly: true,
                        configFile: 'src/client/tsconfig.json'
                    }
                }],
            exclude: /node_modules/,}],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },    
    plugins: [
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ['build']}),
        new CopyPlugin({
            patterns: [
                { from: 'src/client/html/index.html', to: './' }
            ]
        }),
        new NodemonPlugin()            
    ]
}
