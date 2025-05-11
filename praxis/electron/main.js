import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // IPC обработчик
    ipcMain.handle('execute-code', async (_, { language, code, mode }) => {
        console.log('Starting code execution...');
        try {
            const primaPath = path.join(__dirname, '../../frontend/master.js');
            const child = spawn('node', [primaPath, mode, code]);

            let output = '';
            child.stdout.on('data', (data) => output += data.toString());
            child.stderr.on('data', (data) => output += data.toString());

            return new Promise((resolve) => {
                child.on('close', (code) => {
                    console.log('Execution finished with code:', code);
                    resolve({
                        success: code === 0,
                        output: output || 'No output'
                    });
                });
            });
        } catch (e) {
            console.error('Execution error:', e);
            return {
                success: false,
                output: e instanceof Error ? e.message : String(e)
            };
        }
    });

    // Загрузка приложения
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});