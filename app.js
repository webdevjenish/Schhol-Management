const express = require('express')
const port = 15000
const app = express()

const db = require('./config/db')
const passport = require('passport')
const jwtStrategy = require('./config/passport_jwt_strategy')
const session = require('express-session')

app.use(express.urlencoded());

app.use(session({
    name:'jenish',
    secret:'jbkey',
    resave:false,
    saveUnintianlized:false,
    cookie:{
        maxAge:(1000*60*60)
    }
}))

app.use('/api',require('./routes/api/v1/AdminRoute'))

app.use(passport.initialize())
app.use(passport.session())

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log("Server is Started in port : " + port);

})