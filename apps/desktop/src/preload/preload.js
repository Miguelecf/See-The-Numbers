const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  app: 'SeeTheNumbers',
  version: '1.0.0',
});
