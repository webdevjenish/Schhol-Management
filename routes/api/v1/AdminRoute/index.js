const express = require('express')
const Route = express.Router()
const AdminCtl = require('../../../../controller/AdminController/AdminCtl')

Route.post('/AdminRegister',AdminCtl.AdminRegister)
Route.post('/signin',AdminCtl.signIn)


module.exports = Route