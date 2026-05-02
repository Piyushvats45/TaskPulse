const IORedis = require("ioredis");
const redis = new IORedis();

const rateLimiter = async (req, res, next) => {
  const key = `rate:${req.user._id}`;

  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, 60); // 1 minute window
  }

  if (requests > 5) {
    return res.status(429).json({
      message: "Too many requests. Try again later.",
    });
  }

  next();
};

module.exports = rateLimiter;