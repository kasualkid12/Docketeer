<<<<<<< HEAD
const electron = require('electron');
const path = require('path');
=======

const electron = require ('electron');
const path = require ('path');
>>>>>>> 68822a4 (Get the html to show up on the electron app. Still need to get the react to mount the html id)
const url = require('url');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const verifyCode = require('./twilio/verifyCode');
const verifyMobileNumber = require('./twilio/verifyMobile');
const postEvent = require('./twilio/postEvent');
const emailEvent = require('./email/emailEvent');

// global reference to mainWindow (necessary to prevent mainWindow from being garbage collected)
let mainWindow;

function createMainWindow() {
<<<<<<< HEAD
  mainWindow = new Electron.BrowserWindow({
=======
   mainWindow = new electron.BrowserWindow({
>>>>>>> 68822a4 (Get the html to show up on the electron app. Still need to get the react to mount the html id)
    width: 1300,
    height: 800,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      // enableRemoteModule: true,
      // Do we want to be able to run this without background throttling?
      // backgroundThrottling: false
    },
  });

<<<<<<< HEAD
  // const isDevelopment = process.env.NODE_ENV !== 'production';
  if (process.env.NODE_ENV === 'development') {
    //* TODO This URL can change, maybe needs to change
    mainWindow.loadURL(`http://localhost:4000`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '/src/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  })

  // //? comment out lines 30-38 if dev tools is slowing app
  //   app.whenReady().then(() => {
  //     const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  //     const extensionsPlural = extensions.length > 0 ? 's' : '';
  //     Promise.all(extensions.map(extension => installExtension(extension)))
  //       .then(names =>
  //         console.log(`[electron-extensions] Added DevTools Extension${extensionsPlural}: ${names.join(', ')}`))
  //       .catch(err =>
  //         console.log('[electron-extensions] An error occurred: ', err));
  //   });
=======
// const isDevelopment = process.env.NODE_ENV !== 'production';
if (process.env.NODE_ENV === 'development') {
  //* TODO This URL can change, maybe needs to change
  mainWindow.loadURL(`http://localhost:4000`);
} else {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/src/renderer/index.tsx'),
      protocol: 'file:',
      slashes: true,
    })
  );
}
>>>>>>> 68822a4 (Get the html to show up on the electron app. Still need to get the react to mount the html id)

  // mainWindow.webContents.on('did-frame-finish-load', () => {
  //   if (isDevelopment) {
  //     mainWindow.webContents.openDevTools();
  //     mainWindow.webContents.on('devtools-opened', () => {
  //       mainWindow.focus();
  //       setImmediate(() => {
  //         mainWindow.focus();
  //       });
  //   });
  // }});

  //   mainWindow.on('closed', () => {
  //     mainWindow = null;
  //   });

  //   return mainWindow;
  // }

  // app.whenReady().then(() => {
  //   // creates main browser mainWindow when electron is ready
  //   mainWindow = createMainWindow();

  //   app.on('activate', () => {
  //     // on macOS it is common to re-create a mainWindow even after all windows have been closed
  //     if (mainWindow === null) {
  //       mainWindow = createMainWindow();
  //     }
  //   });
  // });

  // quit application when all windows are closed
  // app.on('mainWindow-all-closed', () => {
  //   // on macOS it is common for applications to stay open until the user explicitly quits
  //   if (process.platform !== 'darwin') {
  //     app.quit();
  //   }

};

<<<<<<< HEAD
electron.app.on('ready', createMainWindow)

electron.ipcMain.handle('verify-number', async (_: any, args: any) => {
  return await verifyMobileNumber(args);
});

electron.ipcMain.handle('verify-code', async (_: any, args: any) => {
  return await verifyCode(args);
});

electron.ipcMain.handle('post-event', async (_: any, args: any) => {
=======
// Boilerplate for electron devtools
// electron.app.whenReady().then(() => {
//   installExtension(REACT_DEVELOPER_TOOLS)
//       .then((name:string) => console.log(`Added Extension:  ${name}`))
//       .catch((err:string) => console.log('An error occurred: ', err));
// });

electron.app.on('ready', createMainWindow)


electron.ipcMain.handle('verify-number', async (_, args) => {
  return await verifyMobileNumber(args);
});

electron.ipcMain.handle('verify-code', async (_, args) => {
  return await verifyCode(args);
});

electron.ipcMain.handle('post-event', async (_, args) => {
>>>>>>> 68822a4 (Get the html to show up on the electron app. Still need to get the react to mount the html id)
  const { mobileNumber, triggeringEvent } = args;
  return await postEvent(mobileNumber, triggeringEvent);
});

<<<<<<< HEAD
electron.ipcMain.handle('email-event', async (_: any, args: any) => {
=======
electron.ipcMain.handle('email-event', async (_, args) => {
>>>>>>> 68822a4 (Get the html to show up on the electron app. Still need to get the react to mount the html id)
  return await emailEvent(args);
});
