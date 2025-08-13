import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import log from "electron-log";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

log.transports.file.resolvePathFn = () =>
  path.join(__dirname, "..", "logs", "main.log");

ipcMain.handle("get-app-version", () => {
  try {
    const pkgPath = path.resolve(__dirname, "..", "package.json");
    const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (pkgJson?.version && typeof pkgJson.version === "string") {
      return pkgJson.version;
    }
  } catch {}
  return app.getVersion();
});

ipcMain.handle("check-for-updates", () => {
  console.log("BTN Checking for updates");

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    log.info("App started in development mode", {
      time: new Date().toISOString(),
    });
    setTimeout(() => {
      mainWindow.loadURL("http://localhost:5173");
    }, 1000);
  } else {
    log.info("App started in production mode", {
      time: new Date().toISOString(),
    });
    console.log("App started in production mode");
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Check for updates every 30 minutes
  setInterval(() => {
    console.log("Checking for update every 30 minutes");
    autoUpdater.checkForUpdatesAndNotify();
  }, 30 * 60 * 1000);

  // Initial check
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
  console.log("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  log.info("Update available:", info);
  console.log("Update available:", info);
});

autoUpdater.on("download-progress", (progress) => {
  log.info("Download progress:", progress);
  console.log("Download progress:", progress);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info);
  console.log("Update downloaded:", info);

  autoUpdater.quitAndInstall();
});

autoUpdater.on("error", (error) => {
  log.error("Update error:", error);
  console.log("Update error:", error);
});

autoUpdater.on("update-not-available", (info) => {
  log.info("Update not available:", info);
  console.log("Update not available:", info);
});
