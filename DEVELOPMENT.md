# Development Guide

## 🔧 **Technical Implementation Details**

### **Architecture Overview**

```
┌─────────────────┐    IPC    ┌─────────────────┐
│   Main Process │ ◄────────► │ Renderer Process│
│   (Electron)   │            │    (React)      │
└─────────────────┘            └─────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│ Auto-updater    │            │   UI Components │
│ (electron-      │            │   (Status,      │
│  updater)      │            │    Progress)    │
└─────────────────┘            └─────────────────┘
```

### **Process Communication**

#### **Main → Renderer (IPC)**
```javascript
// Main process
mainWindow.webContents.send("update-status", {
  checking: true,
  available: false,
  downloading: false,
  progress: 0
});

// Renderer process
window.electronAPI.onUpdateStatus((event, status) => {
  setUpdateStatus(status);
});
```

#### **Renderer → Main (IPC)**
```javascript
// Renderer process
window.electronAPI.checkForUpdates();

// Main process
ipcMain.handle("check-for-updates", () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## 📝 **Code Structure**

### **Main Process (`electron/main.js`)**

#### **Auto-updater Configuration**
```javascript
// Set GitHub as update provider
autoUpdater.setFeedURL({
  provider: "github",
  owner: "imamknitto",
  repo: "electron-autoupdate",
  private: false
});
```

#### **Event Handlers**
```javascript
// Update checking
autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
  mainWindow?.webContents.send("update-status", { checking: true });
});

// Update available
autoUpdater.on("update-available", (info) => {
  log.info("Update available:", info);
  mainWindow?.webContents.send("update-status", { 
    checking: false, 
    available: true, 
    info: info 
  });
});

// Download progress
autoUpdater.on("download-progress", (progress) => {
  log.info("Download progress:", progress);
  mainWindow?.webContents.send("update-status", { 
    downloading: true, 
    progress: progress.percent 
  });
});

// Update downloaded
autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info);
  mainWindow?.webContents.send("update-status", { 
    downloaded: true, 
    info: info 
  });
  
  // Auto restart after 3 seconds
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 3000);
});
```

### **Preload Script (`electron/preload.js`)**

#### **API Exposure**
```javascript
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  onUpdateStatus: (callback) => ipcRenderer.on("update-status", callback),
  removeUpdateStatusListener: () => ipcRenderer.removeAllListeners("update-status")
});
```

### **Renderer Process (`src/App.tsx`)**

#### **State Management**
```typescript
interface UpdateStatus {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  downloaded: boolean;
  error: string | null;
  progress: number;
  info: string | null;
}

const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
  checking: false,
  available: false,
  downloading: false,
  downloaded: false,
  error: null,
  progress: 0,
  info: null
});
```

#### **Event Listeners**
```typescript
useEffect(() => {
  const handleUpdateStatus = (_event: unknown, status: UpdateStatus) => {
    setUpdateStatus(prev => ({ ...prev, ...status }));
  };

  window.electronAPI?.onUpdateStatus(handleUpdateStatus);

  return () => {
    window.electronAPI?.removeUpdateStatusListener();
  };
}, []);
```

## 🚀 **Build Process**

### **Build Commands**

#### **1. Development Build**
```bash
npm run dev
# Concurrently runs:
# - Vite dev server (localhost:5173)
# - Electron in development mode
```

#### **2. Production Build**
```bash
npm run build
# - TypeScript compilation
# - Vite build (React app)
# - Output: dist/ folder
```

#### **3. Electron Build**
```bash
npm run build:electron
# - Uses electron-builder
# - Creates setup installer
# - Output: dist-electron/ folder
```

#### **4. Publish Build**
```bash
npm run build:electron:publish
# - Build + Publish to GitHub
# - Requires GitHub token
```

### **Build Configuration (`package.json`)**

```json
{
  "build": {
    "appId": "com.imamcorp.electron-autoupdate",
    "productName": "Electron Autoupdate",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "asar": false,
    "publish": {
      "provider": "github",
      "owner": "imamknitto",
      "repo": "electron-autoupdate"
    }
  }
}
```

## 🔍 **Debugging & Logging**

### **Log File Locations**

#### **Windows**
```
%APPDATA%\[AppName]\logs\main.log
C:\Users\[Username]\AppData\Roaming\[AppName]\logs\main.log
```

#### **macOS**
```
~/Library/Application Support/[AppName]/logs/main.log
```

#### **Linux**
```
~/.config/[AppName]/logs/main.log
```

### **Log Configuration**

```javascript
import log from "electron-log";

// Set log file path
log.transports.file.resolvePathFn = () =>
  path.join(app.getPath("userData"), "logs", "main.log");

// Log levels
log.info("Info message");
log.warn("Warning message");
log.error("Error message");
log.debug("Debug message");
```

### **Common Log Messages**

```
[timestamp] [info] Log file path: /path/to/logs/main.log
[timestamp] [info] App started in production mode
[timestamp] [info] Checking for update every 30 minutes
[timestamp] [info] BTN Checking for updates - triggered from renderer
[timestamp] [info] Checking for update...
[timestamp] [info] Update available: { version: '2.0.0', ... }
[timestamp] [info] Download progress: { percent: 45, ... }
[timestamp] [info] Update downloaded: { version: '2.0.0', ... }
```

## 🐛 **Troubleshooting Guide**

### **1. Preload Script Errors**

#### **Problem**: `Cannot use import statement outside a module`
#### **Solution**: Use CommonJS syntax in preload.js
```javascript
// ❌ Wrong
import { contextBridge, ipcRenderer } from "electron";

// ✅ Correct
const { contextBridge, ipcRenderer } = require("electron");
```

### **2. Auto-update Not Working**

#### **Checklist**:
- [ ] GitHub repository is public
- [ ] Release is published (not draft)
- [ ] Version in package.json matches release tag
- [ ] Setup file is uploaded to release
- [ ] Internet connection available

#### **Debug Steps**:
1. Check log files for errors
2. Verify GitHub release configuration
3. Test with manual update check
4. Check network connectivity

### **3. Build Failures**

#### **Common Issues**:
- **Missing dependencies**: Run `npm install`
- **TypeScript errors**: Fix type issues in code
- **Path issues**: Check file paths in configuration
- **Permission errors**: Run as administrator (Windows)

## 📚 **Dependencies Explanation**

### **Core Dependencies**

#### **electron-updater**
- **Purpose**: Handle automatic updates
- **Key Features**: GitHub integration, progress tracking, auto-install
- **Version**: ^6.6.2

#### **electron-log**
- **Purpose**: Logging system for Electron
- **Key Features**: File logging, console logging, log levels
- **Version**: ^5.4.2

#### **electron-builder**
- **Purpose**: Build and package Electron apps
- **Key Features**: Cross-platform builds, installers, auto-update
- **Version**: ^26.0.12

### **Development Dependencies**

#### **TypeScript**
- **Purpose**: Type safety and better development experience
- **Configuration**: `tsconfig.json`, `tsconfig.app.json`

#### **Vite**
- **Purpose**: Fast build tool for React
- **Features**: HMR, fast refresh, optimized builds

## 🔄 **Update Flow Details**

### **Complete Update Sequence**

```
1. App Start
   ↓
2. Auto-updater initialized
   ↓
3. Check for updates (GitHub API)
   ↓
4. Compare versions
   ↓
5. If update available:
   ↓
6. Download update
   ↓
7. Track progress
   ↓
8. Download complete
   ↓
9. Auto restart
   ↓
10. New version running
```

### **User Experience Flow**

```
User opens app → Sees current version
                ↓
User clicks "Check for Updates" → Button shows "Checking..."
                ↓
Update detected → Status shows "Update available"
                ↓
Download starts → Progress bar appears
                ↓
Download complete → Status shows "Update ready! Restarting..."
                ↓
App restarts → New version loads
```

## 🎯 **Performance Considerations**

### **Memory Management**
- Cleanup event listeners on component unmount
- Use proper cleanup in useEffect
- Avoid memory leaks in IPC communication

### **Update Frequency**
- Automatic check: Every 30 minutes
- Manual check: On user request
- Balance between user experience and server load

### **File Size**
- Monitor setup file sizes
- Consider delta updates for large files
- Optimize assets and dependencies

---

**Note**: This guide covers the technical implementation details. For user-facing documentation, see `README.md`.
