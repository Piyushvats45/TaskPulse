const Job = require("../models/jobModel");
const { jobQueue } = require("../queue/queue");

/**
 * Creates a new job
    * @route POST /api/jobs/
 */
const createJob = async (req, res) => {
    try {
        const { type, data } = req.body;

        const userId = req.userId; // assuming auth middleware

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Job type is required",
            });
        }
        // 1 Save job in DB
        const job = await Job.create({
            userId,
            type,
            data,
        });

        // 2 Add job to queue
        await jobQueue.add("job-task", {
            jobId: job._id,
            data,
        });

        return res.status(201).json({
            success: true,
            message: "Job created and added to queue",
            jobId: job._id,
        });

    } catch (error) {
        console.error("Create Job Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to create job",
        });
    }
};



/**
 * Gets the status of a job
    * @route GET /api/jobs/:id
 */
const getJobStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }


        return res.status(200).json({
            success: true,
            job,
        });

    } catch (error) {
        console.error("Get Job Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching job",
        });
    }
};



module.exports = {
    createJob,
    getJobStatus,
};