const express = require('express');
const app = express();


app.get('/', (req,res)=>{
    res.send("TaskPulse is working....")
})

module.exports = app;