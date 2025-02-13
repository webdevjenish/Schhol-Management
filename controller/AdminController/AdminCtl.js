const AdminModel = require('../../model/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../../model/adminModel')
const Faculty = require('../../model/FacultyModel')
const nodemailer = require('nodemailer')
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
                            return res.status(200).json({ msg: 'password is Updated', data: updetdpassdata })
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
module.exports.ForgotSendMail = async (req, res) => {
    try {
        let checkEmail = await AdminModel.findOne({ email: req.body.email })
        console.log(checkEmail)
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "bogharajenish94@gmail.com",
                    pass: "iankshbmbrbbufyc",
                },
                tls: {
                    rejectUnauthorized: true
                }
            });
            const OTP = Math.round(Math.random() * 10000);

            const info = await transporter.sendMail({
                from: 'bogharajenish94@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "OTP Verification", // Subject line
                text: "Your OTP", // plain text body
                html: `<b>${OTP}</b>`, // html body
            });

            const Data = {
                email: req.body.email, OTP
            }
            if (info) {
                return res.status(200).json({ msg: "Go to mail", data: Data })
            }
            else {
                return res.status(400).json({ msg: "Email not sent on yout email..", data: info })

            }

        }
        else {
            return res.status(400).json("Email not found")
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Somthing Wrong..", data: err })
    }
}
module.exports.updateforgotpassword = async (req, res) => {
    try {

        console.log(req.body)
        const CheckEmail = await AdminModel.findOne({ email: req.query.email })
        if (CheckEmail) {
            console.log(CheckEmail)
            if (req.body.newpassword == req.body.confirmpassword) {
                req.body.password = await bcrypt.hash(req.body.newpassword, 10)
                let UpdatedForgotPassword = await AdminModel.findByIdAndUpdate(CheckEmail._id, req.body)
                if (UpdatedForgotPassword) {
                    let UpdateData = await AdminModel.findById(CheckEmail._id)
                    if (UpdateData) {
                        return res.status(200).json({ msg: "Password Forgot Successfully Go to login page", data: UpdateData })
                    }
                    else {
                        return res.status(400).json({ msg: 'Data not Updataed' })
                    }
                }
                else {
                    return res.status(200).json({ msg: "NewPassword and Conform Password is not match" })
                }
            }
            else {
                return res.status(200).json({ msg: "Email not Found" })
            }
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Somthing Wrong..", data: err })
    }
}

module.exports.facultyregistration = async (req, res) => {
    try {
        console.log(req.body);
        let CheckAdmin = await AdminModel.findOne({ email: req.user.email })
        console.log(req.user);
        
        if (CheckAdmin) {
            let GenaratePassword = generatePassword()
            let FacultyData = {
                username: req.body.username,
                email: req.body.email,
                password: GenaratePassword
            }

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "bogharajenish94@gmail.com",
                    pass: "iankshbmbrbbufyc",
                },
                tls: {
                    rejectUnauthorized: true
                }
            });
            const link = 'http://localhost:15000/api'
            const info = await transporter.sendMail({
                from: 'bogharajenish94@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "OTP Verification", // Subject line
                text: "Your OTP", // plain text body
                html: `<b>${FacultyData}${link}</b>`, // html body
            });

            let FacultyUserCreate = await Faculty.create(FacultyData)
            if (FacultyUserCreate) {
                return res.status(200).json({ msg: "Faculty USer Created" })
            }
            else {
                return res.status(400).json({ msg: "Admin Data not Found" })
            }
        }
        else {
            return res.status(400).json({ msg: "Admin Data not Found" })
        }

    }
    catch (err) {
        return res.status(400).json({ msg: "Somthing Wrong..", data: err })
    }
}
function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}