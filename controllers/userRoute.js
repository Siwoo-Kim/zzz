var express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const hasAccess = require("../middleware/adminAuth");
const hasAccessAd = require("../middleware/userAuth");

router.get("/registration",(req,res)=>{
    res.render("registration");
});

router.post("/registration", (req, res) => {
    const errors = [];
    const {fname, lname, username, email, password2, pwdMatch} = req.body;
    if (fname === "" || lname === "") {
        errors.push("Enter your name");
    }
  
    if (password2 === "") {
        errors.push("Enter your password" );
    }
    else {
        const passwd = /(?=.*[A-Z])/;   
        if(password2.length < 6 || password2.length > 12)
        {
        errors.push("Please enter between 6 - 12 characters");
        }
       if (!passwd.test(`${password2}`)) 
       {
        errors.push( "Please contain at least one uppercase");
       }
    }
    if (`${pwdMatch}` !== `${password2}`) {
        errors.push("Password is not matching");
    }

    if (email === "") {
        errors.push( "Enter your email");
    }

    //There is an error
    if (errors.length > 0) {
        res.render("registration", {
            messages: errors,
        })
    }
    // there is no error
    else {
        userModel.findOne({ email: req.body.email })
            .then((user) => {
                //there was matching email
                if (user) {
                    errors.push("This email is already in use");
                    res.render("registration", {
                        messages: errors,
                    })

                } else {

                   const newUser = {
                        fname: fname,
                        lname: lname,
                        email: email,
                        password2: password2
                    }

                    const register = new userModel(newUser);
                    register.save()
                        .then(() => {
                            console.log('Your information was successfully inserted into database')
                        })
                        .catch(err => {
                            console.log(`Error occurs while inserting data into database ${err}`);
                    });
                        

                    //Sending email when registered successfully
                    var transporter = nodemailer.createTransport({
                        service:'gmail',
                        auth: {
                            user:'tamhome0704@gmail.com', 
                            pass:'seneca20!'
                        }
                    });
      
                    var emailOptions = {
                        from:'tamhome0704@gmail.com',
                        to: req.body.email,
                        subject:'Tamhome',
                        html: '<p>Hello '+req.body.fname + '</p><p>Thank you for signing up at Tamhome. </p>'
                    }
    
                    transporter.sendMail(emailOptions, (error, info)=> {
                        if (error) { 
                        console.log("Error: " + error); 
                        }
                        console.log("Success: " + info.response);
                });
            
            
                res.render('Login', {username: req.body.fname});
            }
        
        });
    }           
});

router.get("/Login",(req,res)=>{
    res.render("Login");
});

router.post("/Login", (req,res)=>{
    const errors = [];
    const email = req.body.email;
    const password2 = req.body.password2;

    if (email === "" || password2 === "" ) {
        errors.push( "Both are required");
    }
  
    //There is an error
    if (errors.length > 0) {
        res.render("Login", {
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
                if (user === null) {
                    errors.push("You enter wrong email");
                    res.render("Login", {
                        messages: errors
                    })

                }
                //Email matching
                else {
                    bcrypt.compare(req.body.password2, user.password2)
                        .then((isCorrect) => {
                            if (isCorrect == true) {
                                req.session.userInfo = {
                                    isAdmin:user.isAdmin,
                                    fname:user.fname,
                                    lname:user.lname,
                                    email: user.email ,
                                    password2: user.password2
                                };
                                console.log(user.type);

                                if(!user.isAdmin)
                                {
                                  res.render('userDashboard', {lastName: user.lname, firstName: user.fname, userSession:req.session.userInfo, isAdmin: user.isAdmin});
                                }
                                
                                else
                                {
                                  res.render('adminDashboard', {firstName: user.fname,lastName: user.lname,userSession:req.session.userInfo, isAdmin: user.isAdmin});
                                }
                            }
                            //password doesn't match
                            else {
                                errors.push( "Your password does not match" );
                                res.render("Login", {
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


router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect('/');
})


router.get("/userDashboard", function (req, res) {
    res.render('userDashboard',{userSession: req.session.userInfo, 
        isAdmin:req.session.userInfo.isAdmin, 
        lastName: req.session.userInfo.lname, 
        firstName:req.session.userInfo.fname});
});

router.get("/adminDashboard", function (req, res) {
res.render('adminDashboard');
});

  
module.exports=router;






