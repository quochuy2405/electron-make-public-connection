// Import necessary modules only once
import { exec } from 'child_process'; // Ensure this is correctly imported for exec
import { BrowserWindow, screen } from 'electron';
import Store from 'electron-store';
import QRCode from 'qrcode';
const ipv4Regex = /IPv4 Address[. ]+[: ]+(\d+\.\d+\.\d+\.\d+)/;

// Function to open the terminal and run a command to get IP address
export function openTerminal() {
  const command = process.platform === "win32" ? "ipconfig" : "ifconfig";
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    const match = stdout.match(ipv4Regex);

    const ipv4Address = match[1];
    createTerminalWindow(ipv4Address);
  });
}

// Function to create a terminal-like window
function createTerminalWindow(ipv4Address) {
  const terminalWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Terminal Output',
    webPreferences: {
      nodeIntegration: true,  // Cho phép node integration để render HTML
    }
  });

  // Tạo mã QR từ địa chỉ IPv4
  QRCode.toDataURL(`http://${ipv4Address}:8888`, (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return;
    }

    // Tải URL mã QR vào cửa sổ
    terminalWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <html>
        <head><title>QR Code for IP</title></head>
        <body>
          <h2>Scan this QR code to access the IP:</h2>
          <img src="${url}" alt="QR Code" />
        </body>
      </html>
    `));
  });

  terminalWindow.on('closed', () => {
    terminalWindow = null;
  });
}

// Function to create a new window and manage its state
export const createWindow = (windowName, options) => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};

  // Restore window size and position from store
  const restore = () => store.get(key, defaultSize);

  // Get current window position and size
  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  // Check if the window is within bounds of any screen
  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  // Reset to default size and position if not visible
  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  // Ensure window is visible on some display
  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      return resetToDefaults(); // Reset to safe defaults
    }
    return windowState;
  };

  // Save window state before closing
  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  // Create BrowserWindow with the restored state or default size
  const win = new BrowserWindow({
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      ...options.webPreferences,
    },
  });

  win.on('close', saveState);

  return win;
};
