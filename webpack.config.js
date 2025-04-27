import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/main.ts', // Точка входа
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
        path: path.resolve(__dirname, 'dist'), // Путь для выходного файла
    },
};