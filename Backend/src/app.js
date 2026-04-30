const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));

/**
 * - Routes required
 */
const authRouter = require('./routes/authRoutes')

/**
 * - Use Routes
 */
app.get('/', (req,res)=>{
    res.send("TaskPulse is working....")
})
app.use('/api/auth', authRouter)

module.exports = app;