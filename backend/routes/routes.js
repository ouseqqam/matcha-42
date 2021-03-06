const express = require('express')
const router = express.Router()
const verifyToken = require('../app/middlewares/verifyToken')
const userController = require('../app/Controllers/userController')
const authController = require('../app/Controllers/authController')
const likesController = require('../app/Controllers/likesController')
const browseController = require('../app/Controllers/browseController')
const messageController = require('../app/Controllers/messageController')
const friendController = require('../app/Controllers/friendController')



/* -------------------- Sign up and sign in ----------------------------*/

router.post('/signup', userController.signup)
router.post('/login', authController.login)
router.post('/user/verifyEmail', authController.verifyEmail)
router.post('/forgotpassword', authController.forgotPassword)
router.post('/resetpassword', authController.resetPassword)

/* ----------------------------- End  -----------------------------------*/

router.post('/user/complete', verifyToken.verifyToken, userController.complete)
router.post('/user/update', userController.update)
router.get('/user/tags/:search', verifyToken.verifyToken, userController.getTags)
router.get('/user/profile', verifyToken.verifyToken, userController.profile)
router.post('/user/like', verifyToken.verifyToken, likesController.store)
router.post('/user/msg/store', verifyToken.verifyToken, messageController.store)

router.get('/user/like/get1/:id', verifyToken.verifyToken, likesController.get1)
router.get('/user/like/get2/:id', verifyToken.verifyToken, likesController.get2)
router.get('/user/like/delete/:user_id1/:user_id2', likesController.delete)
router.get('/user/browse', verifyToken.verifyToken, browseController.get)
router.get('/user/msg/get', verifyToken.verifyToken, messageController.get)

router.get('/user/friend/get/:id', verifyToken.verifyToken, friendController.get)


module.exports = router