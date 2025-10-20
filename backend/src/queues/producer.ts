import type { Queue } from "bullmq";

class JobProducer {
  //add a single job to queue
  async addJob<T>(queue: Queue, jobName: string, data: T, id: string) {
    await queue.add(jobName, data);
  }
  //add a multiple jobs to queue
  async addJobs<T>(queue: Queue, jobName: string, data: T[], id: string) {
    const jobs = data.map((dataItem, Index) => ({
      name: `${jobName}-${Index + 1}`,
      data: Object.assign({userId: id}, dataItem),
    }));
    await queue.addBulk(jobs);
  }
}

export const jobProducer = new JobProducer();
