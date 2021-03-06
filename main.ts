import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

const args = process.argv.slice(1);
const isServe = args.some((value) => value === '--serve');

let browserWindow: BrowserWindow = null;

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  browserWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: isServe ? true : false,
      enableRemoteModule: true, // true if you want to use remote module in renderer context (ie. Angular)
    },
  });

  if (isServe) {
    browserWindow.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });

    browserWindow.loadURL('http://localhost:4200');
  } else {
    browserWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });

  browserWindow.webContents.on('did-fail-load', () => {
    browserWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  });

  return browserWindow;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window.
  // More details at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(() => createWindow(), 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
