const path = require('path');
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const net = require('net');

let mainWindow;
let apiProcess = null;
let webProcess = null;

const API_PORT = 4000;
const WEB_PORT = 3000;

function checkPort(port) {
  return new Promise((resolve) => {
    const client = new net.Socket();
    
    client.once('connect', () => {
      client.destroy();
      resolve(true); // Port is in use
    });
    
    client.once('error', () => {
      resolve(false); // Port is free
    });
    
    client.connect(port, '127.0.0.1');
  });
}

async function startBackend() {
  const apiReady = await checkPort(API_PORT);
  const webReady = await checkPort(WEB_PORT);

  if (apiReady && webReady) {
    console.log('✅ API and Web already running on ports', API_PORT, 'and', WEB_PORT);
    return true;
  }

  if (!apiReady) {
    console.log('🚀 Starting API server on port', API_PORT, '...');
    apiProcess = spawn('npm', ['run', 'dev:api'], {
      cwd: path.join(__dirname, '../../..'),
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    apiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[API]', output.replace(/\n/g, ''));
    });

    let attempts = 0;
    while ((await checkPort(API_PORT)) === false && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    console.log('✅ API ready');
  }

  if (!webReady) {
    console.log('🚀 Starting Web server on port', WEB_PORT, '...');
    webProcess = spawn('npm', ['run', 'dev:web'], {
      cwd: path.join(__dirname, '../../..'),
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    webProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[WEB]', output.replace(/\n/g, ''));
    });

    let attempts = 0;
    while ((await checkPort(WEB_PORT)) === false && attempts < 60) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    console.log('✅ Web ready');
  }

  console.log('✅ All services ready');
  return true;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    title: 'SeeTheNumbers - POS',
  });

  const { Menu } = require('electron');
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nueva Venta (POS)',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/pos`)
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Navegación',
      submenu: [
        {
          label: '🏠 Dashboard',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/dashboard`)
        },
        {
          label: '📦 Productos',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/products`)
        },
        {
          label: '✂️ Servicios',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/services`)
        },
        {
          label: '🛒 POS - Nueva Venta',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/pos`)
        },
        {
          label: '📊 Inventario',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/inventory`)
        },
        {
          label: '🧾 Ventas',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/sales`)
        },
        {
          label: '💡 Insights',
          click: () => mainWindow.loadURL(`http://localhost:${WEB_PORT}/insights`)
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'toggleDevTools', label: 'Herramientas de desarrollo' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de SeeTheNumbers',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Acerca de SeeTheNumbers',
              message: 'SeeTheNumbers v1.0.0',
              detail: 'Sistema de Punto de Venta para pequeños negocios\n\n© 2026 SeeTheNumbers'
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  const startUrl = `http://localhost:${WEB_PORT}`;
  console.log('📱 Loading:', startUrl);
  
  await mainWindow.loadURL(startUrl);
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  console.log('🎯 SeeTheNumbers Desktop Starting...');
  
  await startBackend();
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (apiProcess) apiProcess.kill();
  if (webProcess) webProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  console.log('👋 Shutting down...');
  if (apiProcess) apiProcess.kill();
  if (webProcess) webProcess.kill();
});
