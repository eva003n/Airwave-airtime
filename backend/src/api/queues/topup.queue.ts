import { Queue, Worker } from "bullmq";
import { connection } from "../config/database/redis/redis.js";



const topUpQueue = new Queue("topUpQueue", { 
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        /* Retry logic and backoff */
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 5000 //1st failure rery after 5s second 10s etc if it fails the fifth time add to failed queue
        }
    }    
    }
);
// process 5 tops ups at a time
topUpQueue.setGlobalConcurrency(1)
//process 1 jop up per second
topUpQueue.setGlobalRateLimit(1, 1000);

// (async () => {
//   await topUpQueue.pause(); // stop new jobs temporarily
//   await topUpQueue.obliterate({ force: true });
//   await topUpQueue.close();
//   console.log("✅ Queue completely reset");
// })();

export { topUpQueue };
