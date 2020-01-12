const { electronApp, BrowserWindow } = require('electron');
let service = module.exports = {};
let app = {}

service.init = function(caller){
    // Set up access to main app
    Object.assign(app, caller);

    console.log("UI Service initialized.")
}

