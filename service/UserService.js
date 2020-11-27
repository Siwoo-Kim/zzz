const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const authenticated = require("../middleware/userAuth");
const nodemailer = require("nodemailer");

class User {
    constructor(fname, lname, email, password2) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.username = email;
        //todo change the property name to password
        this.password2  = password2;
    }
}

class UserService {
    EMAIL_PROVIDER = 'gmail'
    EMAIL_SENDER = 'tamhome0704@gmail.com'
    EMAIL_PW = 'seneca20!'
    /**
     * is it okay to save the user?
     * 
     * @param user
     * @param pwdMatch
     * @returns {Promise<[]>}
     */
    async checkProps(user, pwdMatch) {
        const errors = [];
        const mapProps = {
            fname: "name",
            lname: "name",
            password2: "password",
            email: "email"
        }
        for (let key in user)
            if (user.hasOwnProperty(key) && !user[key])
                errors.push(`Enter your ${mapProps[key]}.`)
        if (user.password2) {
            const pwRegex = /(?=.*[A-Z])/;
            if (user.password2.length < 6 || user.password2.length > 12)
                errors.push("Please enter between 6 - 12 characters");
            if (!pwRegex.test(`${user.password2}`))
                errors.push("Please contain at least one uppercase");
            if (`${pwdMatch}` !== `${user.password2}`)
                errors.push("Password is not matching");
        }
        let exists = await this.getByEmail(user.email)
        if (exists)
            errors.push("This email is already in use");
        return errors
    }

    /**
     * save the user into database and notify the user by email.
     * 
     * @param user
     * @param pwdMatch
     * @returns {Promise<*[]>}
     */
    async add(user, pwdMatch) {
        let errors = await this.checkProps(user, pwdMatch)
        if (errors && errors.length > 0) return errors
        try {
            let res = await new userModel(user).save()
            const greeting = '<p>Hello ' + user.fname + '</p><p>Thank you for signing up at Tamhome. </p>'
            const subject = 'Tamhome'
            await this.notify(user.email, subject, greeting)
        } catch (e) {
            //server errors
            throw new Error(e)
        }
    }

    /**
     * send email to the user
     * 
     * @param user
     * @param subject
     * @param msg
     * @returns {Promise<void>}
     */
    async notify(email, subject, msg) {
        const transporter = nodemailer.createTransport({
            service: this.EMAIL_PROVIDER,
            auth: {
                user: this.EMAIL_SENDER,
                pass: this.EMAIL_PW
            }
        });
        const opts = {
            from: this.EMAIL_SENDER,
            to: user.email,
            subject: subject,
            html: msg
        }
        let res = await transporter.sendMail(opts, (e, info) => {
            if (e) console.error("Error: " + e);
            else console.log("Success: " + info.response);
        })
    }

    /**
     * get a user by email 
     * 
     * @param email
     * @returns {Promise<Promise|*>}
     */
    async getByEmail(email) {
        return userModel.findOne({ email: email }).then(user => user)
    }
}

module.exports=new UserService()