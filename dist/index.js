"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const zomatoController = require("./controllers/zomatoController");
const basedir = __dirname;
require('dotenv').config();
const app = express();
const port = 8080; // default port to listen
//app.set( "views", path.join( __dirname, "../views/" ) );
app.set("view engine", "pug");
app.get("/", function (req, res) {
    //    res.sendFile("/index.html");
    res.sendFile('/Wunch/' + 'index.html', { 'root': '../' });
});
app.get("/getRestaurants", zomatoController.getRestaurants);
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map