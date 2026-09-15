// Desktop wrapper for Advant Flow AI.
// It loads the live published site, so clients always get the latest version.
const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

// >>> CHANGE THIS IF YOUR DOMAIN EVER CHANGES <<<
const APP_URL = "https://advantflowai.com";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 380,
    backgroundColor: "#0A0F1C",
    title: "Advant Flow AI",
    icon: path.join(__dirname, "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(APP_URL);

  // Open external links (Stripe, social, mail) in the default browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(APP_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
