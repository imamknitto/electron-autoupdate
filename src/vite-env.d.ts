/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    electronAPI?: {
      getAppVersion: () => Promise<string>;
      checkForUpdates: () => Promise<void>;
    };
  }
}
