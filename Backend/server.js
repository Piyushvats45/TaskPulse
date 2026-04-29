require("dotenv").config() // to use MONGO_URI in connetDB fun

const app = require('./src/app')
const connectDB = require('./src/config/db')
connectDB();


app.listen(8080, ()=>{
    console.log("server is running on http://localhost:8080/...");
})