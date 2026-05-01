require("dotenv").config();
const { Worker } = require("bullmq");
const { connection } = require("../queue/queue");
const Job = require("../models/jobModel");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Worker DB connected"))
    .catch(err => console.log(err));

// Create Worker
const worker = new Worker(
    "jobQueue",
    async (job) => {
        const { jobId, data } = job.data;

        console.log(`Processing job: ${jobId}`);

        try {
            // 1️ Update status → processing
            await Job.findByIdAndUpdate(jobId, {
                status: "processing",
                $inc: { attempts: 1 }
            });

            // 2️ Simulate actual task (example: email sending)
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const result = {
                message: "Job completed successfully",
            };

            // 3️ Update success
            await Job.findByIdAndUpdate(jobId, {
                status: "completed",
                result,
                processedAt: new Date(),
            });

            console.log(`Job completed: ${jobId}`);

            return result;
        } catch (error) {
            console.error(`Job failed: ${jobId}`, error.message);

            // 4️ Update failure
            await Job.findByIdAndUpdate(jobId, {
                status: "failed",
                error: error.message,
                $inc: { attempts: 1 },
            });

            throw error; // important for retry
        }
    },
    {
        connection,
    }
);

// Event listeners (important for debugging)
worker.on("completed", (job) => {
    console.log(`Completed job ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.log(`Failed job ${job.id}: ${err.message}`);
});

module.exports = worker;