const db = require("../../database/db_connection")
const User = require("../Models/User")
const randomstring = require("randomstring")
const nodemailer = require("nodemailer");
const user = new User()

module.exports = {
    signup: async (req, res) => {
        const userData = req.body
        msg = user.validateSignUp(userData)
        if (msg)
            return res.json({Status: "Failed", msg})
        try {
            let [result] = await user.findEmail(userData.email)
            let count = Object.keys(result).length
            let i = 0 
            if (count != 0)
            i = 2
            let [result1] = await user.findUsername(userData.username)
            count = Object.keys(result1).length
            if (count != 0)
                i++
            if (i != 0) {
                if (i == 1)
                    res.status(400).json("Username was exist")
                else if (i == 2)
                    res.status(400).json("Email was exist")
                else if (i == 3)
                    res.status(400).json("Email and username were exist")
            }
            else {
                const token = randomstring.generate()
                userData.token = token
                let [result2] = await user.addUser(userData)
                if (result2.affectedRows) {
                    const url = "http://localhost:3000/" + token
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
                        to: userData.email,
                        subject: "Matcha email verification",
                        html: "<p>Click to verify your account <a href=" + url + ">Verify</a></p>"
                    }
                                
                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.json("Email verification has been send to your email")
                        }
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    },

    complete:  (req, res) => {
        const user = new User()
        const userData = req.body
        let imgs = userData.gallery
        let tags = userData.listOfInterests
        delete userData.gallery
        delete userData.listOfInterests

        const set = user.updateUser(req.params.id)

        db.query(user.checkUser(req.params.id), (err, result) => {
            if (err)
                return res.status(500).send(err)
            else
                if (result.length == 1) {
                    userData["complete"] = 1
                    if (result[0].complete == 0)
                        db.query(set, userData, (err, result) => {
                            if (err)
                                return res.status(500).send(err)
                            else {
                                user.putImgToFolder(imgs)
                                for (let i = 0; i < imgs.length; i++) {
                                    db.query(user.addImage(req.params.id), imgs[i], (err, result) => {
                                        if (err)
                                            return res.status(500).send(err)
                                    })
                                }
                                
                                for (let i = 0; i < tags.length; i++) {
                                    db.query(user.addTags(req.params.id), tags[i], (err, result) => {
                                        if (err)
                                            return res.status(500).send(err)
                                    })
                                }

                                return res.json({Status: "Success", Msg: "User profile has been completed."})
                            }
                        })
                    else
                        return res.json({Status: "Failed", Msg:"Profile already completed"})
                }
                else
                    return res.json({Status: "Failed", Msg:"User doesn't exist."})
        })
    },

    update: (req, res) => {
        const user = new User()
        const userData = req.body
        let imgs = userData.gallery
        let tags = userData.listOfInterests
        delete userData.gallery
        delete userData.listOfInterests

        const set = user.updateUser(req.params.id)

        db.query(user.checkUser(req.params.id), (err, result) => {
            if (err)
                return res.status(500).send(err)
            else
                if (result.length == 1) {

                    db.query(set, userData, (err, result) => {
                        if (err)
                            return res.status(500).send(err)
                    })
                    if (imgs.length > 0)
                        user.putImgToFolder(imgs)
                    for (let i = 0; i < imgs.length; i++) {
                        db.query(user.addImage(req.params.id), imgs[i], (err, result) => {
                            if (err)
                                return res.status(500).send(err)
                        })
                    }
                                
                    for (let i = 0; i < tags.length; i++) {
                        db.query(user.addTags(req.params.id), tags[i], (err, result) => {
                            if (err)
                                return res.status(500).send(err)
                        })
                    }

                    return res.json({Status: "Success", Msg: "User profile has been updated."})
                }
                else
                    return res.json({Status: "Failed", Msg:"User doesn't exist."})
        })
    },


    UserSelect: (req, res) => {
       id = req.params.id
        sql = "SELECT * From users WHERE id = ?"
        db.query(sql, id, (err, result) => {
            if (err)
                return res.send(err)
            let data = []
            data.push(result[0])
            sql = "SELECT name From images WHERE user_id = ?"
            db.query(sql, id, (err, result) => {
                if (err)
                    return res.send(err)
                let gallery = []
                for(let i = 0; i < result.length; i++) {
                    gallery.push("/images/" + result[i].name) 
                }
                data[0].gallery = gallery
                sql = "SELECT name From tags WHERE user_id = ?"
                db.query(sql, id, (err, result) => {
                    if (err)
                        return res.send(err)
                    let tags = []
                    for(let i = 0; i < result.length; i++) {
                        tags.push(result[i].name) 
                    }
                    data[0].tags = tags
                    return res.json(data)
                })
            })
        })
    },

    getTags: (req, res) => {
        search = req.params.search + "%"
        sql = "SELECT DISTINCT name FROM tags WHERE name LIKE ?"
        db.query(sql, search, (err, result) => {
            if (err)
                return res.send(err)
            return res.json(result)
        })
    },
}
