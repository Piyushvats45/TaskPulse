const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())

/**
 * - Routes required
 */
const authRouter = require('./routes/authRoutes')
const jobRouter = require('./routes/jobRoute')

/**
 * - Use Routes
 */
app.get('/', (req,res)=>{
    res.send("TaskPulse is working....")
})
app.use('/api/auth', authRouter)
app.use('/api/jobs', jobRouter)
module.exports = app;