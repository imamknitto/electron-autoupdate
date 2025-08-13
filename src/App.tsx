import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const App = () => {
  const [version, setVersion] = useState<string>("...");

  useEffect(() => {
    window.electronAPI
      ?.getAppVersion()
      .then((v: string) => setVersion(v))
      .catch(() => setVersion("unknown"));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>VRE</h1>
      <p>Version: {version}</p>
      <button onClick={() => window.electronAPI?.checkForUpdates()}>
        Check for Updates
      </button>
    </>
  );
};

export default App;
