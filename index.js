const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const encrypt = require('./encrypt'); // Assuming encrypt.js is your encryption script
const decrypt = require('./decrypt'); // Assuming decrypt.js is your decryption script

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'bmp', 'gif'] }]
    });
    return result.filePaths[0];
});

ipcMain.handle('save-file-dialog', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog({
        defaultPath: defaultPath,
        filters: [{ name: 'Images', extensions: ['png'] }, { name: 'Text Files', extensions: ['txt'] }]
    });
    return result.filePath;
});

ipcMain.handle('encrypt', async (event, filePath, outputImageFileName, outputKeyFileName) => {
    try {
        await encrypt({ e: filePath, o: outputImageFileName, p: outputKeyFileName });
        return 'Encryption Complete';
    } catch (error) {
        console.error('Error encrypting image:', error);
        throw error;
    }
});

ipcMain.handle('decrypt', async (event, filePath, keyPath, outputImageFileName) => {
    try {
        await decrypt({ d: filePath, k: keyPath, o: outputImageFileName });
        return 'Decryption Complete';
    } catch (error) {
        console.error('Error decrypting image:', error);
        throw error;
    }
});
