const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openFileDialog: async () => {
        const result = await ipcRenderer.invoke('open-file-dialog');
        return result;
    },
    saveFileDialog: async (defaultPath) => {
        const result = await ipcRenderer.invoke('save-file-dialog', defaultPath);
        return result;
    },
    encrypt: (filePath, outputImageFileName, outputKeyFileName) => ipcRenderer.invoke('encrypt', filePath, outputImageFileName, outputKeyFileName),
    decrypt: (filePath, keyPath, outputImageFileName) => ipcRenderer.invoke('decrypt', filePath, keyPath, outputImageFileName)
});
