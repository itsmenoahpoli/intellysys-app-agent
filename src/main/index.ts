import { app, shell, BrowserWindow, ipcMain, screen } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import os from "os";
import { createHash } from "crypto";

let mainWindow: BrowserWindow | null = null;

function getPrimaryNetworkInfo(): { interfaceName: string; ipAddress: string } {
  const interfaces = os.networkInterfaces();
  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) continue;
    for (const address of addresses) {
      const isIpv4 = address.family === "IPv4" || address.family === 4;
      if (isIpv4 && !address.internal) {
        return { interfaceName: name, ipAddress: address.address };
      }
    }
  }
  return { interfaceName: "unknown", ipAddress: "unavailable" };
}

function createWindow(): void {
  // Create the browser window with custom options for a premium, frameless experience
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: false, // Fully borderless custom window
    transparent: true, // Allows smooth rounded corners and glow backgrounds
    backgroundColor: "#00000000", // Clear background for overlay rounded edges
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // Load the local URL in development or the local HTML file in production
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// IPC Window Controls
ipcMain.on("window-minimize", () => {
  mainWindow?.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on("window-close", () => {
  mainWindow?.close();
});

ipcMain.on("window-toggle-devtools", () => {
  if (mainWindow?.webContents.isDevToolsOpened()) {
    mainWindow.webContents.closeDevTools();
  } else {
    mainWindow?.webContents.openDevTools();
  }
});

// IPC System Metrics
ipcMain.handle("get-system-metrics", async () => {
  const cpus = os.cpus();
  const cpuModel = cpus.length > 0 ? cpus[0].model : "Unknown CPU";
  const cpuCores = cpus.length;

  // Memory usage
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  // App specific process memory
  const processMem = process.memoryUsage().heapUsed;
  const networkInfo = getPrimaryNetworkInfo();

  return {
    cpuModel,
    cpuCores,
    totalMem: Math.round(totalMem / (1024 * 1024 * 1024)), // GB
    usedMem: Math.round(usedMem / (1024 * 1024 * 1024)), // GB
    freeMem: Math.round(freeMem / (1024 * 1024 * 1024)), // GB
    processMem: Math.round(processMem / (1024 * 1024)), // MB
    appUptime: Math.floor(process.uptime()), // Seconds
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    chromeVersion: process.versions.chrome,
    electronVersion: process.versions.electron,
    hostname: os.hostname(),
    networkInterface: networkInfo.interfaceName,
    ipAddress: networkInfo.ipAddress,
  };
});

ipcMain.handle("get-agent-identity", async () => {
  const hostname = os.hostname();
  const platform = process.platform;
  const arch = process.arch;
  const userDataPath = app.getPath("userData");
  const raw = `${hostname}:${platform}:${arch}:${userDataPath}`;
  const fingerprint = createHash("sha256").update(raw).digest("hex").slice(0, 16);

  return {
    identifier: `agent-${fingerprint}`,
    hostname,
    platform,
    arch,
    appVersion: app.getVersion(),
  };
});

// App lifecycle
app.whenReady().then(() => {
  // Set app user model id for windows notifications
  electronApp.setAppUserModelId("com.intellysys.agentapp");

  // Default open or close DevTools in developer mode
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
