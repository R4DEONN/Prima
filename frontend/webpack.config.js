const path = require('path');

module.exports = {
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader', // Использование ts-loader для обработки TypeScript файлов
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Поддерживаемые расширения
    },
    output: {
        filename: 'bundle.js', // Имя выходного файла
        path: path.resolve(__dirname, 'build'), // Путь для выходного файла
    },
    devtool: 'source-map',
};