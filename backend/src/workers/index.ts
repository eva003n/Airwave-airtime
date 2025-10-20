import { QueueEvents } from "bullmq";
import { connection } from "../config/database/redis/redis.js";
import { Worker } from "bullmq";
import logger from "../logger/logger.winston.js";

// Article to read from---. https://workerholic.github.io/


//listen on global events emmited by a queue for progress tracking

const generateQueueEvents = (queueName: string) => {
    return new QueueEvents(queueName, {connection})

}


//graceful shutdown
/*Ensures jobs are completed before shutting down workers */
const shutDownWorker = (worker: Worker) => {
    process.on("SIGINT", async () => {
      logger.info("Received SIGINT. Closing worker...");
      await worker.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("Received SIGTERM. Closing worker...");
      await worker.close();
      process.exit(0);
    });

}

export {
    generateQueueEvents,
    shutDownWorker
}
