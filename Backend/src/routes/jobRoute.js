const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createJob, getJobStatus } = require("../controllers/jobController");

const router = express.Router();

/* POST /api/jobs/ */
router.post("/", authMiddleware, createJob);

/* GET /api/jobs/:id */
router.get("/:id", authMiddleware, getJobStatus);

module.exports = router;