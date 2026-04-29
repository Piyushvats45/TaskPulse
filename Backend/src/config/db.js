const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to DB");       
    })
    .catch(err=>{
        console.log("Error connecting DB")
        process.exit(1)
    })
}

module.exports = connectDB