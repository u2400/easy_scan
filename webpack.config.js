const path = require('path');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {loader: 'babel-loader'},
                    {loader: 'ts-loader'},
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'easyscan.js',
        path: path.resolve(__dirname, 'dist')
    }
};