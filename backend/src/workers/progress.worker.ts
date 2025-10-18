import { QueueEvents } from "bullmq";

//listen on global events emmited by a queue for progress tracking

const generateQueueEvents = (queueName: string) => {
    return new QueueEvents(queueName)

}
const validateCsvEvants = generateQueueEvents("validateQueue")

validateCsvEvants.on("progress", ({jobId, data}, id) => {
    console.log(`Job id-${jobId} progress:${data}`)

})
