
const express = require('express');
const router = express.Router();
const roomModel= require("../models/roomModel");
var multer = require("multer");

const storage = multer.diskStorage({
    destination: "./public/images",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.basename(file.originalname));
    }
});

const upload = multer({ storage: storage,
    fileFilter: (req, file, cb)=>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
        }}
});