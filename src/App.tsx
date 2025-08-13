import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface UpdateStatus {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  downloaded: boolean;
  error: string | null;
  progress: number;
  info: string | null;
}

const App = () => {
  const [version, setVersion] = useState<string>("...");
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    checking: false,
    available: false,
    downloading: false,
    downloaded: false,
    error: null,
    progress: 0,
    info: null
  });

  useEffect(() => {
    window.electronAPI
      ?.getAppVersion()
      .then((v: string) => setVersion(v))
      .catch(() => setVersion("unknown"));
  }, []);

  const handleCheckUpdate = () => {
    setUpdateStatus(prev => ({ ...prev, checking: true, error: null }));
    
    window.electronAPI?.checkForUpdates()
      .then(() => {
        console.log("Update check initiated");
      })
      .catch((error) => {
        setUpdateStatus(prev => ({ 
          ...prev, 
          checking: false, 
          error: error.message || "Failed to check for updates" 
        }));
      });
  };

  const getStatusText = () => {
    if (updateStatus.error) return `Error: ${updateStatus.error}`;
    if (updateStatus.checking) return "Checking for updates...";
    if (updateStatus.available && !updateStatus.downloading) return "Update available!";
    if (updateStatus.downloading) return `Downloading... ${updateStatus.progress}%`;
    if (updateStatus.downloaded) return "Update downloaded! Restarting...";
    return "No updates available";
  };

  const getStatusColor = () => {
    if (updateStatus.error) return "#ff4444";
    if (updateStatus.checking) return "#ffaa00";
    if (updateStatus.available) return "#44ff44";
    if (updateStatus.downloading) return "#4444ff";
    if (updateStatus.downloaded) return "#44ff44";
    return "#888888";
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logos">
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <h1>Electron Auto-Update Demo</h1>
        <div className="version-info">
          <span className="version-label">Current Version:</span>
          <span className="version-number">{version}</span>
        </div>
      </div>

      <div className="update-section">
        <h2>Update Status</h2>
        <div className="status-display" style={{ color: getStatusColor() }}>
          {getStatusText()}
        </div>
        
        {updateStatus.downloading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${updateStatus.progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{updateStatus.progress}%</span>
          </div>
        )}

        <button 
          className="update-button"
          onClick={handleCheckUpdate}
          disabled={updateStatus.checking || updateStatus.downloading}
        >
          {updateStatus.checking ? "Checking..." : "Check for Updates"}
        </button>
      </div>

      <div className="info-section">
        <h3>Features:</h3>
        <ul>
          <li>✅ Automatic update checking</li>
          <li>✅ Manual update checking</li>
          <li>✅ Progress tracking</li>
          <li>✅ Error handling</li>
          <li>✅ Version display</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
