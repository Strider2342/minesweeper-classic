const { app, BrowserWindow } = require('electron');

const url = require('url');
const path = require('path');
const { ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 514,
    height: 660,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/minesweeper-classic/browser/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();

  console.log(ipcMain);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
