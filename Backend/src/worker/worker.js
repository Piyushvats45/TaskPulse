
require("dotenv").config();

const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const { connection } = require("../queue/queue");
const Job = require("../models/jobModel");
const { sendEmail } = require("../services/email");

// Connect DB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Worker DB connected"))
  .catch(err => console.log(err));

// Worker
const worker = new Worker(
  "jobQueue",
  async (job) => {
    const { jobId, data, type } = job.data;

    console.log(`Processing job: ${jobId}`);


    try {
      // 1 Update → processing + attempts
      await Job.findByIdAndUpdate(jobId, {
        status: "processing",
        $inc: { attempts: 1 },
      });

      let result = {};

      // 2 Handle different job types
      switch (type) {

        case "email":
          await sendEmail(
            data.to,
            "TaskPulse Notification",
            "Your job completed successfully"
          );
          result = { message: "Email sent successfully" };
          break;

        default:
          throw new Error("Unknown job type");
      }

      // 3️ Success update
      await Job.findByIdAndUpdate(jobId, {
        status: "completed",
        result,
        processedAt: new Date(),
      });

      console.log(`Job completed: ${jobId}`);
      

      return result;

    } catch (error) {

      console.error(`Job failed: ${jobId}`, error.message);

      // 4️ Failure update
      await Job.findByIdAndUpdate(jobId, {
        status: "failed",
        error: error.message,
      });

      throw error; // needed for retry
    }
  },
  { connection }
);

// Events
worker.on("completed", (job) => {
  console.log(`Completed job ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`Failed job ${job.id}: ${err.message}`);
});

module.exports = worker;











// require("dotenv").config();
// const { Worker } = require("bullmq");
// const { connection } = require("../queue/queue");
// const Job = require("../models/jobModel");

// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Worker DB connected"))
//     .catch(err => console.log(err));

// // Create Worker
// const worker = new Worker(
//     "jobQueue",
//     async (job) => {
//         const { jobId, data } = job.data;

//         console.log(`Processing job: ${jobId}`);

//         try {
//             // 1️ Update status → processing
//             await Job.findByIdAndUpdate(jobId, {
//                 status: "processing",
//                 $inc: { attempts: 1 }
//             });

//             // 2️ Simulate actual task (example: email sending)
//             await new Promise((resolve) => setTimeout(resolve, 3000));

//             const result = {
//                 message: "Job completed successfully",
//             };

//             // 3️ Update success
//             await Job.findByIdAndUpdate(jobId, {
//                 status: "completed",
//                 result,
//                 processedAt: new Date(),
//             });

//             console.log(`Job completed: ${jobId}`);

//             return result;
//         } catch (error) {
//             console.error(`Job failed: ${jobId}`, error.message);

//             // 4️ Update failure
//             await Job.findByIdAndUpdate(jobId, {
//                 status: "failed",
//                 error: error.message,
//                 $inc: { attempts: 1 },
//             });

//             throw error; // important for retry
//         }
//     },
//     {
//         connection,
//     }
// );

// // Event listeners (important for debugging)
// worker.on("completed", (job) => {
//     console.log(`Completed job ${job.id}`);
// });

// worker.on("failed", (job, err) => {
//     console.log(`Failed job ${job.id}: ${err.message}`);
// });

// module.exports = worker;