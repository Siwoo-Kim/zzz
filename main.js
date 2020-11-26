var express = require("express");
var app = express();
var path = require("path");
const bodyParser = require('body-parser');
require('dotenv').config();
const hbs = require('express-handlebars');
const clientSessions= require("client-sessions");
var session = require('express-session');
const config = require("./js/config");
var mongoose = require("mongoose");
var HTTP_PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('.hbs', hbs({ extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');
app.use(express.static("public"));

//session 
app.use(clientSessions ({
  cookieName:"session",
  secret:"web322_Tamhome",
  duration: 2*60*1000,
  activeDuration: 1000*60
}));


app.use((req,res,next)=>{
  res.locals.user= req.session.userInfo;
  next();
})

const control = require("./controllers/userRoute");
app.use("/", control);



// mongo db connection
const connStr = config.dbconn;
mongoose.connect("mongodb://localhost/tamhome", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on("open", () => {
  console.log("Database connection open.");
});


// normal files
app.get("/", function (req, res) {
  res.render('home');
});

app.get("/search", function (req, res) {
   res.render('search');
});

app.get("/upload", function (req, res) {
  res.render('upload');
});
app.get("/detail", function (req, res) {
  res.render('detail');
});

app.get("/book", function (req, res) {
  res.render('book');
});

app.get('/script',function(req,res){
  res.sendFile(path.join(__dirname + './js/script.js')); 
});


function onHttpStartup() {
  console.log("Express Server running on port " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStartup);
