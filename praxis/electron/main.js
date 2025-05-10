import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow()
{
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    // Обработчик выполнения кода
    ipcMain.handle('execute-code', async (event, {language, code, mode}) =>
    {
        return new Promise((resolve) =>
        {
            const primaPath = path.join(__dirname, '../../frontend/master.js');
            const child = spawn('node', [primaPath, mode, code]);

            let output = '';

            child.stdout.on('data', (data) =>
            {
                output += data.toString();
            });

            child.stderr.on('data', (data) =>
            {
                output += data.toString();
            });

            child.on('close', (code) =>
            {
                resolve({
                    success: code === 0,
                    output
                });
            });
        });
    });

    if (process.env.NODE_ENV === 'development')
    {
        await win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else
    {
        await win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() =>
{
    createWindow();

    app.on('activate', () =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
        {
            createWindow();
        }
    });
});

app.on('window-all-closed', () =>
{
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});