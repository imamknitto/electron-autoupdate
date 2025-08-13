# Quick Reference Guide

## 🚀 **Quick Start Commands**

```bash
# Development
npm run dev                    # Start dev server + Electron
npm run build                 # Build React app
npm run build:electron        # Build Electron app
npm run build:electron:publish # Build + Publish to GitHub
```

## 📋 **Release Checklist**

### **Before Release**
- [ ] Update version in `package.json`
- [ ] Test all functionality
- [ ] Build and test setup file
- [ ] Update changelog

### **Release Process**
- [ ] Commit and push code
- [ ] Create GitHub release with tag
- [ ] Upload setup file to release
- [ ] Test auto-update from old version

### **Post Release**
- [ ] Monitor log files
- [ ] Check auto-update functionality
- [ ] Update documentation if needed

## 🔧 **Common Configurations**

### **Package.json Version**
```json
{
  "version": "2.0.0"
}
```

### **GitHub Release Tag**
```
v2.0.0
```

### **Build Output**
```
dist-electron/Electron Autoupdate Setup 2.0.0.exe
```

## 📁 **File Structure Quick Reference**

```
electron-autoupdate/
├── electron/
│   ├── main.js             # Main process + auto-update
│   └── preload.js          # IPC bridge
├── src/
│   ├── App.tsx             # Main UI
│   └── App.css             # Styling
├── dist/                    # Built React app
├── dist-electron/           # Built Electron app
├── README.md                # User documentation
├── DEVELOPMENT.md           # Technical guide
└── QUICK_REFERENCE.md       # This file
```

## 🐛 **Quick Troubleshooting**

### **Preload Error**
```bash
# Problem: Cannot use import statement outside a module
# Solution: Use require() in preload.js
const { contextBridge, ipcRenderer } = require("electron");
```

### **Update Not Working**
```bash
# Check these:
1. GitHub repo is public
2. Release is published (not draft)
3. Version matches package.json
4. Setup file uploaded
5. Internet connection OK
```

### **Build Failed**
```bash
# Common fixes:
npm install                  # Install dependencies
npm run build               # Check for errors
npm run build:electron      # Build Electron app
```

## 📝 **Log File Locations**

### **Windows**
```
%APPDATA%\[AppName]\logs\main.log
```

### **macOS**
```
~/Library/Application Support/[AppName]/logs/main.log
```

### **Linux**
```
~/.config/[AppName]/logs/main.log
```

## 🔄 **Update Flow Summary**

```
App Start → Check Updates → GitHub API → Compare Versions
    ↓
Update Available → Download → Progress Bar → Complete
    ↓
Auto Restart → New Version Running
```

## ⚡ **Performance Tips**

- **Update Frequency**: Every 30 minutes (automatic)
- **Manual Check**: User can trigger anytime
- **Memory**: Cleanup listeners on unmount
- **File Size**: Monitor setup file sizes

## 🎯 **Key Features Status**

- [x] **Auto-update detection**
- [x] **Progress tracking**
- [x] **Error handling**
- [x] **Modern UI**
- [x] **GitHub integration**
- [x] **Cross-platform support**
- [x] **Logging system**
- [x] **Real-time status**

## 📚 **Dependencies Quick Reference**

### **Core**
- `electron-updater` - Auto-update functionality
- `electron-log` - Logging system
- `electron-builder` - Build and packaging

### **Dev**
- `typescript` - Type safety
- `vite` - Build tool
- `react` - UI framework

## 🔍 **Debug Commands**

```bash
# Check app version
node -p "require('./package.json').version"

# Check build output
ls dist-electron/

# Check log files
# Windows: %APPDATA%\[AppName]\logs\main.log
# Mac: ~/Library/Application Support/[AppName]/logs/main.log
# Linux: ~/.config/[AppName]/logs/main.log
```

## 🚨 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Preload import error | Use `require()` instead of `import` |
| Update not detected | Check GitHub repo settings and release |
| Build fails | Run `npm install` and check TypeScript errors |
| Log file not found | Check user data path and permissions |
| Auto-restart not working | Verify `quitAndInstall()` call |

## 📱 **Platform Support**

- [x] **Windows** - NSIS installer
- [x] **macOS** - DMG installer
- [x] **Linux** - AppImage/DEB/RPM

## 🔐 **Security Notes**

- **Context Isolation**: Enabled
- **Node Integration**: Disabled
- **Preload Script**: Secure IPC bridge
- **GitHub Integration**: Public repo only

## 📊 **Monitoring & Metrics**

### **What to Monitor**
- Update success rate
- Download completion rate
- Error frequency
- User adoption of new versions

### **Log Analysis**
```bash
# Check for errors
grep "error" main.log

# Check update success
grep "Update downloaded" main.log

# Check user activity
grep "Check for updates" main.log
```

## 🎨 **UI Customization**

### **Colors**
- **Primary**: Blue gradient (#667eea → #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### **Components**
- Status cards with shadows
- Progress bars with animations
- Gradient buttons
- Responsive layout

## 🔄 **Update Frequency Settings**

```javascript
// In main.js
setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify();
}, 30 * 60 * 1000); // 30 minutes
```

## 📋 **Testing Checklist**

- [ ] **Development mode** - Hot reload works
- [ ] **Production build** - App runs without errors
- [ ] **Auto-update** - Detects new versions
- [ ] **Progress tracking** - Shows download progress
- [ ] **Auto-restart** - Installs and restarts
- [ ] **Error handling** - Shows error messages
- [ ] **Logging** - Writes to log files
- [ ] **Cross-platform** - Works on target platforms

---

**Quick Commands Summary**:
- `npm run dev` - Development
- `npm run build:electron` - Build app
- `npm run build:electron:publish` - Build + Publish
- Check logs in `%APPDATA%\[AppName]\logs\main.log`
