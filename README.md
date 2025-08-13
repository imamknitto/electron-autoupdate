# Electron Auto-Update Application

A modern Electron application with automatic update functionality using GitHub releases.

## 🎯 **Konsep & Arsitektur**

### **Overview**
Aplikasi ini adalah contoh implementasi auto-update pada Electron app menggunakan `electron-updater` dan GitHub releases. Ketika ada versi baru di GitHub, aplikasi akan otomatis mendeteksi dan menginstall update.

### **Komponen Utama**
- **Main Process** (`electron/main.js`): Handle auto-update logic dan window management
- **Renderer Process** (`src/App.tsx`): UI untuk menampilkan status update
- **Preload Script** (`electron/preload.js`): Bridge antara main dan renderer process
- **Auto-updater**: Menggunakan `electron-updater` untuk check dan download updates

## 🔄 **Flow Auto-Update**

### **1. Aplikasi Start**
```
App Start → Check for Updates → GitHub API → Compare Versions
```

### **2. Update Detection**
```
GitHub Release v2.0.0 → Aplikasi v1.0.5 → Update Available
```

### **3. Download Process**
```
Update Available → Download Progress → Progress Bar → Download Complete
```

### **4. Installation**
```
Download Complete → Auto Restart → New Version Running
```

## 🚀 **Setup & Development**

### **Prerequisites**
- Node.js 18+
- npm atau yarn
- GitHub repository (public)

### **Install Dependencies**
```bash
npm install
```

### **Development Mode**
```bash
npm run dev
```
- Vite dev server + Electron
- Hot reload untuk development

### **Build Production**
```bash
npm run build          # Build React app
npm run build:electron # Build Electron app
npm run build:electron:publish # Build + Publish to GitHub
```

## 📁 **Project Structure**

```
electron-autoupdate/
├── electron/                 # Main process files
│   ├── main.js             # Main process + auto-update logic
│   └── preload.js          # Preload script (main ↔ renderer bridge)
├── src/                     # Renderer process (React)
│   ├── App.tsx             # Main UI component
│   └── App.css             # Styling
├── dist/                    # Built React app
├── dist-electron/           # Built Electron app
└── package.json             # Dependencies & build config
```

## ⚙️ **Configuration**

### **Package.json Build Config**
```json
{
  "build": {
    "appId": "com.imamcorp.electron-autoupdate",
    "publish": {
      "provider": "github",
      "owner": "imamknitto",
      "repo": "electron-autoupdate"
    }
  }
}
```

### **Auto-updater Setup**
```javascript
autoUpdater.setFeedURL({
  provider: "github",
  owner: "imamknitto",
  repo: "electron-autoupdate",
  private: false
});
```

## 🔧 **Auto-Update Implementation**

### **Main Process Events**
```javascript
autoUpdater.on("checking-for-update", () => { /* UI: Checking... */ });
autoUpdater.on("update-available", (info) => { /* UI: Update available */ });
autoUpdater.on("download-progress", (progress) => { /* UI: Progress bar */ });
autoUpdater.on("update-downloaded", (info) => { /* Auto restart */ });
autoUpdater.on("error", (error) => { /* UI: Show error */ });
autoUpdater.on("update-not-available", () => { /* UI: Up to date */ });
```

### **Renderer Communication**
```javascript
// Main → Renderer
mainWindow.webContents.send("update-status", status);

// Renderer → Main
window.electronAPI.checkForUpdates();
```

## 📋 **Release Process**

### **1. Update Version**
```bash
# Edit package.json
"version": "2.0.0"
```

### **2. Build & Test**
```bash
npm run build:electron
# Test setup file
```

### **3. Commit & Push**
```bash
git add .
git commit -m "feat: new version 2.0.0"
git push origin main
```

### **4. Create GitHub Release**
- Tag: `v2.0.0`
- Title: `v2.0.0 - New Features`
- Upload: `Electron Autoupdate Setup 2.0.0.exe`

### **5. Auto-Update Flow**
- User dengan versi lama buka aplikasi
- Aplikasi check update otomatis
- Deteksi versi 2.0.0 tersedia
- Download dan install otomatis
- Restart dengan versi baru

## 🎨 **UI Features**

### **Status Display**
- **Checking**: 🔄 "Checking for updates..."
- **Available**: ⬇️ "Update available"
- **Downloading**: 📥 "Downloading... X%"
- **Ready**: ✅ "Update ready! Restarting..."
- **Error**: ⚠️ "Error message"

### **Progress Tracking**
- Real-time progress bar
- Percentage display
- Smooth animations

### **Modern Design**
- Card-based layout
- Gradient backgrounds
- Responsive design
- Hover effects

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Update Tidak Terdeteksi**
- ✅ Pastikan GitHub repository public
- ✅ Pastikan release sudah dipublish (bukan draft)
- ✅ Pastikan tag version sama dengan package.json

#### **2. Download Gagal**
- ✅ Check internet connection
- ✅ Pastikan file di release bisa di-download
- ✅ Check log file untuk error details

#### **3. Preload Script Error**
- ✅ Pastikan preload.js menggunakan CommonJS syntax
- ✅ Check path preload di main.js

### **Log Files**
```
Windows: %APPDATA%\[AppName]\logs\main.log
Mac: ~/Library/Application Support/[AppName]/logs/main.log
Linux: ~/.config/[AppName]/logs/main.log
```

## 📚 **Key Dependencies**

- **electron-updater**: Auto-update functionality
- **electron-log**: Logging system
- **electron-builder**: Build dan packaging
- **React**: UI framework
- **Vite**: Build tool

## 🔄 **Update Frequency**

- **Automatic**: Check setiap 30 menit
- **Manual**: User bisa klik "Check for Updates"
- **On Start**: Check saat aplikasi dibuka

## 🎯 **Best Practices**

1. **Version Management**: Selalu update version di package.json
2. **Release Notes**: Tulis changelog yang jelas
3. **Testing**: Test setup file sebelum release
4. **Backup**: Backup versi lama sebelum update
5. **Logging**: Monitor log files untuk debugging

## 🚀 **Next Steps**

- [ ] Add custom app icon
- [ ] Implement update notifications
- [ ] Add rollback functionality
- [ ] Custom update UI themes
- [ ] Multi-language support

---

**Note**: Dokumentasi ini menjelaskan konsep dasar dan flow yang diperlukan. Untuk implementasi detail, lihat source code dan komentar di dalamnya.
