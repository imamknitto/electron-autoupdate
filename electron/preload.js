const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  onUpdateStatus: (callback) => ipcRenderer.on("update-status", callback),
  removeUpdateStatusListener: () => ipcRenderer.removeAllListeners("update-status")
});
