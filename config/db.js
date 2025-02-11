const mongoose = require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/API')
mongoose.connect('mongodb+srv://bogharajenish94:7tfvdj5q4cybVxNc@cluster0.jc6ct.mongodb.net/SchoolMgmt')

const db = mongoose.connection

db.once('open',(err)=>{
    if(err) return console.error(err)
    console.log('Connected to MongoDB')
})
module.exports = db