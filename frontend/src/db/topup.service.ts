// src/db/topup.service.ts
import { db, type TopUp } from "./db";

export const TopUpService = {
  async add(topup: TopUp) {
    await db.topups.put(topup);
  },

  async bulkAdd(topups: TopUp[]) {
    await db.topups.bulkPut(topups);
  },

  async update(id: string, updates: Partial<TopUp>) {
    await db.topups.update(id, updates);
  },

  async all(): Promise<TopUp[]> {
    return db.topups.orderBy("createdAt").reverse().toArray();
  },

  async clear() {
    await db.topups.clear();
  },
};
