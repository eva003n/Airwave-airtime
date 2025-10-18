import { ExpressAdapter } from "@bull-board/express";
import {createBullBoard} from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { validateQueue } from "../../queues/validate.queue.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(validateQueue)],
  serverAdapter,
});

export {
    serverAdapter
}