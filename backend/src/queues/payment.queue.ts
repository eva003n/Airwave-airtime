import { Queue } from "bullmq";
import { connection } from "../config/database/redis/redis.js";



const paymentQueue = new Queue("paymentQueue", { 
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
paymentQueue.setGlobalConcurrency(1)
//process 1 jop up per second
paymentQueue.setGlobalRateLimit(1, 1000);

export { paymentQueue };
