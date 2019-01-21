import * as express from "express";
import * as path from "path";
import * as zomatoController from "./controllers/zomatoController";

const basedir : string = __dirname;

require('dotenv').config();

const app = express();
const port = 8080; // default port to listen

//app.set( "views", path.join( __dirname, "../views/" ) );
app.set( "view engine", "pug" );

app.get("/",function(req,res) {
//    res.sendFile("/index.html");
res.sendFile( '/Wunch/' + 'index.html', {'root': '../'});
});

app.get("/getRestaurants",zomatoController.getRestaurants);


// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );