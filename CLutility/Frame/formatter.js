// This file is required by the index.html file and will
// be executed in the parsing process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;

const resultDiv = document.querySelector('cli-result');

ipcRenderer.on('did-finish-load', () => {
    setApplicationMenu();
});

ipcRenderer.on('processing-did-succeed', (event, html) => {
    shell.openExternal(`file://${html}`);
});

ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

document.addEventListener('ready', ( event ) => {
    event.preventDefault();
    ipcRenderer.send('cli-result-request');
});