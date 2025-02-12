const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const extrajwt = require('passport-jwt').ExtractJwt

const opts = {
    jwtFromRequest : extrajwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'school'
}

const Admin = require('../model/adminModel')
passport.use(new jwtStrategy(opts,async (payload,done)=>{
    let CheckEmailAdmin = await Admin.findOne({email:payload.AdminData.email})
    if(CheckEmailAdmin){
        return done(null,CheckEmailAdmin)
    }
    else{
        return done(null,false)
    }
}))

passport.serializeUser(function(User,done){
    return done(null,User.id)
})

passport.deserializeUser(async(id,done)=>{
    let AuthAdmin = await Admin.findById(id)
    if(AuthAdmin){
        return done(null,AuthAdmin)
    }
    else{
        return done(null,false)
    }
})

module.exports = passport