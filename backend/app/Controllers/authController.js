const connection = require("../../database/db_connection")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const randomstring = require("randomstring")
const nodemailer = require("nodemailer");
const db = require("../../database/db_connection")

module.exports = {
    Login: ( req, res ) => {
        const { username, password } = req.body

        connection.query(`SELECT * FROM users WHERE username = '${username}'`, (err,result) => {
            if(err)
                res.json(err)
            else
            {
                if (result.length == 0)
                    res.status(400).json({ErrorMessage: "Wrong Email !!!"})
                else
                {
                userPassword = result[0].password

                bcrypt.compare(password, userPassword, (err, result1) => {
                    if(err)
                        res.status(401).send("Wrong password")
                    else
                    {
                        dataUser = [
                            {
                                "Id" : result[0].id,
                                "Email" : result[0].email
                            }
                        ]
                        jwt.sign({ dataUser }, 'hello', (err, token) => {
                            res.json({token})
                        })
                    }
                })
                
                }
            }
        })
    },

    verifyEmail: (req, res) => {
        const token = req.body.token
        sql = `SELECT verified FROM users WHERE token = '${token}'`
        db.query(sql, (err, result) => {
            if (err)
                return res.send(err)
            if(result.length == 0)
                return res.json("Invalid token")
            if (result[0].verified == 1)
                return res.json("The email has already verified")
            let token = null
            sql = `UPDATE users SET verified = 1 , token = ${token}`
            db.query(sql, (err, result) => {
                if(err)
                    return res.send(err)
                res.json("your profil had been verified")
            })
        })
    },

    forgotPassword: (req, res) => {
        email = req.body.email
        sql = `SELECT email from users WHERE email = '${email}'`
        db.query(sql, (err, result) => {
            if (err)
                return res.send(err)
            if (result.length == 0)
                return res.json("Email doesn't exist")
            
            const token = randomstring.generate()
            const url = "http://localhost:3000/resetpassword/" + token
            const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
                auth: {
                    user: "ouseqqam.test@gmail.com",
                    pass: "Outest@2022"
                }
            });

            message = {
                from: "Matcha Team <ouseqqam.test@gmail.com>",
                to: email,
                subject: "Matcha reset password",
                html: "<p>Click here to reset your account password <a href=" + url + ">Verify</a></p>"
            }
                
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    const sql = `INSERT INTO password_resets SET email = '${email}', token = '${token}'` 
                    db.query(sql, (err, result) => {
                        if (err)
                            return res.send(err)
                        return res.json("Email verification has been send to your email")
                    })
                }
            })
        })
    }
}