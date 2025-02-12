const AdminModel = require('../../model/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../../model/adminModel')
module.exports.AdminRegister = async (req, res) => {
    try {
        console.log(req.body)
        let CheckAdmin = await AdminModel.findOne({ email: req.body.email })
        if (!CheckAdmin) {
            if (req.body.password == req.body.confirmpassword) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
                let AdminData = await AdminModel.create(req.body)
                if (AdminData) {
                    return res.status(200).json({ msg: 'Admin DAta Added Succesfully....', data: AdminData })
                }
                else {
                    return res.status(200).json({ msg: 'Admin DATa not Added' })
                }
            }
            else {
                return res.status(200).json({ msg: 'password and confirmpassword are not match....', })
            }
        }
        else {
            return res.status(200).json({ msg: 'Email is allready Existes....' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthind Wrong...', Error: err })
    }
}
module.exports.signIn = async (req, res) => {
    try {
        // console.log(req.body)
        let CheckUser = await AdminModel.findOne({ email: req.body.email })
        if (CheckUser) {
            let CheckPassword = await bcrypt.compare(req.body.password, CheckUser.password)
            if (CheckPassword) {
                // CheckUser.toObject(CheckUser.password)
                // console.log(typeof(CheckUser.password));
                // delete CheckUser.password;
                let AdminToken = await jwt.sign({ AdminData: CheckUser }, "school")
                if (AdminToken) {
                    return res.status(200).json({ msg: 'Admin Login and token Genarate successfully...', Admin: AdminToken })
                }
                else {
                    return res.status(200).json({ msg: 'Admin Login and token Genarate not  successfully...' })
                }
            }
            else {
                return res.status(200).json({ msg: 'Password is not match....' })
            }
        }
        else {
            return res.status(200).json({ msg: 'Email not Found' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthind Wrong...', Error: err })

    }
}

module.exports.showadminprofile = async (req, res) => {
    try {
        let ProfileData = await AdminModel.findById(req.user._id)
        console.log(ProfileData);
        if (ProfileData) {
            return res.status(200).json({ msg: 'Admin Profile', data: ProfileData })
        }
        else {
            return res.status(401).json({ msg: 'DATa not Found' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthing Worng....' })

    }
}

module.exports.editadminprofile = async (req, res) => {
    try {
        console.log(req.user._id);
        let Editprofiledata = await AdminModel.findById(req.user._id)

        if (Editprofiledata) {
            let UpdateData = await AdminModel.findByIdAndUpdate(req.user._id, req.body)
            if (UpdateData) {
                let updateddata = await AdminModel.findById(req.user._id)
                return res.status(200).json({ msg: 'Admin Profile Updated', data: updateddata })
            }
            else {
                return res.status(200).json({ msg: 'Admin Profile not Updated' })
            }
        }
        else {
            return res.status(401).json({ msg: 'Data not Found' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthing Worng....' })
    }
}
module.exports.changepassword = async (req, res) => {
    try {
        let AdminData = await AdminModel.findById(req.user._id)
        if (AdminData) {
            let CheckPassword = await bcrypt.compare(req.body.currentpassword, AdminData.password)
            if (CheckPassword) {
                if (req.body.currentpassword != req.body.newpassword) {
                    if (req.body.newpassword == req.body.confirmpassword) {
                        req.body.password = await bcrypt.hash(req.body.newpassword, 10)
                        let changepassoword = await AdminModel.findByIdAndUpdate(req.user._id, req.body)
                        if (changepassoword) {
                            let updetdpassdata = await AdminModel.findById(req.user._id)
                            return res.status(200).json({ msg: 'password is Updated',data:updetdpassdata})
                        }
                        else {
                            return res.status(200).json({ msg: 'password is not updated' })
                        }
                    }
                    else {
                        return res.status(200).json({ msg: 'current password and new password   are not match' })

                    }
                }
                else {
                    return res.status(200).json({ msg: 'current password and new password   are not match' })
                }
            }
            else {
                return res.status(200).json({ msg: 'your current passowrd is wrong' })
            }

        }
        else {
            return res.status(401).json({ msg: 'Data not Found' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'Somthing Worng....' })

    }
}