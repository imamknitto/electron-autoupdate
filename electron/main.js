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
  path.join(app.getPath("userData"), "logs", "main.log");

// Log path log file untuk debugging
const logPath = log.transports.file.getFile().path;
log.info("Log file path:", logPath);

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
  log.info("BTN Checking for updates - triggered from renderer");
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
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
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Check for updates every 30 minutes
  setInterval(() => {
    log.info("Checking for update every 30 minutes");
    autoUpdater.checkForUpdatesAndNotify();
  }, 30 * 60 * 1000);

  // Initial check
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  log.info("Update available:", info);
});

autoUpdater.on("download-progress", (progress) => {
  log.info("Download progress:", progress);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info);
  autoUpdater.quitAndInstall();
});

autoUpdater.on("error", (error) => {
  log.error("Update error:", error);
});

autoUpdater.on("update-not-available", (info) => {
  log.info("Update not available:", info);
});
