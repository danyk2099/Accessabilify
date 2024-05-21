const path = require('path');
const WebpackCopyPlugin = require('webpack-copy-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/js/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new WebpackCopyPlugin({
            dirs: [{
                from: path.resolve(__dirname, 'src/index.html'),
                to: 'index.html',
            }
            ]
        }),
        new WebpackCopyPlugin({
            dirs: [
                {
                    from: path.resolve(__dirname, 'src/css/styles.css'),
                    to: 'styles.css'
                }
            ]
        })
    ]
};
