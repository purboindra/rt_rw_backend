import { Queue } from "bullmq";

export const reportCreatedQueue = new Queue("report.created", {
  connection: {
    url: process.env.REDIS_PUBLIC_URL,
  },
});
