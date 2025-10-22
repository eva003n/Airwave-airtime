// src/db.ts
import Dexie, {type Table } from "dexie";

export type TopUp = {
  id: string; // unique ID from backend
  name: string,
  phone: string;
  amount: number;
  branch: string,
  operator: string;
  status: "Pending" | "Success" | "Failed" | "Processing";
  createdAt: string;
  updatedAt?: string;
  eroror?: string
}

export class TopUpDB extends Dexie {
  topups!: Table<TopUp, string>; // <Type, Primary Key>

  constructor() {
    super("TopUpDB");
    this.version(1).stores({
      topups: "id, phone, status, createdAt", // indexed fields
    });
  }
}

export const db = new TopUpDB();
