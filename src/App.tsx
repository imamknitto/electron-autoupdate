import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Listen for update status from main process
    const handleUpdateStatus = (_event: unknown, status: UpdateStatus) => {
      setUpdateStatus(prev => ({ ...prev, ...status }));
    };

    window.electronAPI?.onUpdateStatus(handleUpdateStatus);

    // Cleanup
    return () => {
      window.electronAPI?.removeUpdateStatusListener();
    };
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
    if (updateStatus.error) return updateStatus.error;
    if (updateStatus.checking) return "Checking for updates...";
    if (updateStatus.available && !updateStatus.downloading) return "Update available";
    if (updateStatus.downloading) return `Downloading... ${updateStatus.progress}%`;
    if (updateStatus.downloaded) return "Update ready! Restarting...";
    return "Up to date";
  };

  const getStatusIcon = () => {
    if (updateStatus.error) return "⚠️";
    if (updateStatus.checking) return "🔄";
    if (updateStatus.available) return "⬇️";
    if (updateStatus.downloading) return "📥";
    if (updateStatus.downloaded) return "✅";
    return "✓";
  };

  const getStatusColor = () => {
    if (updateStatus.error) return "#ef4444";
    if (updateStatus.checking) return "#f59e0b";
    if (updateStatus.available) return "#10b981";
    if (updateStatus.downloading) return "#3b82f6";
    if (updateStatus.downloaded) return "#10b981";
    return "#6b7280";
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="app-title">
            <h1>Electron App</h1>
            <span className="version">v{version}</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          {/* Update Status Card */}
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon()}</span>
              <h2>Update Status</h2>
            </div>
            
            <div className="status-content">
              <p className="status-text" style={{ color: getStatusColor() }}>
                {getStatusText()}
              </p>
              
              {updateStatus.downloading && (
                <div className="progress-wrapper">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${updateStatus.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{updateStatus.progress}%</span>
                </div>
              )}
            </div>

            <button 
              className="update-btn"
              onClick={handleCheckUpdate}
              disabled={updateStatus.checking || updateStatus.downloading}
            >
              {updateStatus.checking ? "Checking..." : "Check for Updates"}
            </button>
          </div>

          {/* Info Section */}
          <div className="info-card">
            <h3>Features</h3>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">🔄</span>
                <span>Auto-update</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <span>Cross-platform</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Fast & lightweight</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
