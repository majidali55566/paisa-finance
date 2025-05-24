import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { loadEnv } from "./env";
loadEnv();

const redisUri = process.env.REDIS_URL;
export const redisConnection = new IORedis(redisUri, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: {
    rejectUnauthorized: false,
  },
  connectTimeout: 10000,
});

redisConnection.on("connect", () => console.log("✅ Redis connected"));
redisConnection.on("error", (err) => console.error("❌ Redis error:", err));

export const transactionQueue = new Queue("recurring-transactions", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

//For monitoring
export const queueEvents = new QueueEvents("recurring-transactions", {
  connection: redisConnection,
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} failed:`, failedReason);
});
