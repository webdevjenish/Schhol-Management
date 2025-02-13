const express = require('express')
const Route = express.Router()
const AdminCtl = require('../../../../controller/AdminController/AdminCtl')
const passport = require('passport')

Route.post('/AdminRegister', AdminCtl.AdminRegister)
Route.post('/signin', AdminCtl.signIn)
Route.get('/showadminprofile', passport.authenticate('jwt', { failureRedirect: '/api/unAuthAdmin' }), AdminCtl.showadminprofile)

Route.get('/unAuthAdmin', async (req, res) => {
    res.status(200).json({ msg: 'Admin in Unauthrized...' })
})
Route.put('/editadminprofile', passport.authenticate('jwt', { failureRedirect: '/api/unAuthAdmin' }), AdminCtl.editadminprofile)
Route.post('/changepassoword', passport.authenticate('jwt', { failureRedirect: '/api/unAuthAdmin' }), AdminCtl.changepassword)

Route.post('/sendmail', AdminCtl.ForgotSendMail)
Route.post('/updateforgotpassword', AdminCtl.updateforgotpassword)

Route.post('/facultyregistration', passport.authenticate('jwt', { failureRedirect: '/api/unAuthAdmin' }), AdminCtl.facultyregistration)
module.exports = Route