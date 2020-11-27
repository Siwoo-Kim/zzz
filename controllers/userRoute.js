var express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
//const authenticated = require("../middleware/adminAuth");
const authenticated = require("../middleware/userAuth");
const userService = require("../service/UserService")

router.get("/registration",(req,res)=>{
    res.render("registration");
});

router.post("/registration", (req, res) => {
    const {fname,lname, email, password2, pwdMatch} = req.body;
    userService.add(
        {   
            fname: fname, 
            lname: lname, 
            email: email, 
            password2: password2
        }, pwdMatch)
        .then(errors => {
            if (errors && errors.length > 0) 
                res.render("registration", {messages: errors})
            else
                res.render('login', {username: req.body.fname})
        }).catch(e => res.render("registration", {messages: ["Unknown server error"]}))
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login", (req,res)=>{
    const errors = [];
    const email = req.body.email;
    const password2 = req.body.password2;

    if (email === "" || password2 === "" ) {
        errors.push( "Both are required");
    }
  
    //There is an error
    if (errors.length > 0) {
        res.render("login", {
            messages: errors,
        })
    }
    // there is no error
    else {
        userModel.findOne({ email: req.body.email })
        .exec()    
        .then((user) => {
                //there was no matching username
                //Cannot find user
                console.log("user:", user)
                if (user === null) {
                    errors.push("You enter wrong email");
                    res.render("login", {
                        messages: errors
                    })

                }
                //Email matching
                else {
                    bcrypt.compare(req.body.password2, user.password2)
                        .then((isCorrect) => {
                            if (isCorrect == true) {
                                // req.session.userInfo = {
                                //     isAdmin:user.isAdmin,
                                //     fname:user.fname,
                                //     lname:user.lname,
                                //     email: user.email ,
                                //     password2: user.password2
                                // };
                                req.session.user = user;
                                console.log("session:", req.session.user);

                                
                                if(!user.isAdmin)
                                {
                                    res.redirect('/userDashboard');
                                //   res.render('userDashboard', { fname: user.fname, lname: user.lname, isAdmin: user.isAdmin });
                                }
                                else 
                                {
                                    res.redirect('/adminDashboard');
                                //   res.render('adminDashboard', { fname: user.fname, lname: user.lname, isAdmin: user.isAdmin });
                                }
                            }
                            //password doesn't match
                            else {
                                errors.push( "Your password does not match" );
                                res.render("login", {
                                    messages: errors
                                })
                            }
                        })
                        .catch(err => console.log(`Error happened while verifying password ${err}`));
                }
            })
            .catch(err => console.log(`Error happened while verifying email ${err}`));
    }
});


router.get("/logout", authenticated, (req,res)=>{
    req.session.destroy();
    req.session.reset();
    res.redirect('/');
})


router.get("/userDashboard", authenticated, function (req, res) {
    res.render('userDashboard', { fname: req.session.user.fname, lname: req.session.user.lname, isAdmin: req.session.user.isAdmin });
});

router.get("/adminDashboard", authenticated, function (req, res) {
    res.render('adminDashboard', { fname: req.session.user.fname, lname: req.session.user.lname, isAdmin: req.session.user.isAdmin });
});

  
module.exports=router;






