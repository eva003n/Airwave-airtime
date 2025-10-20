import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type TopUp } from "../db/db";
import { TopUpService } from "@/db/topup.service";

type TopupContextType = {
  topups: TopUp[];
  isConnected: boolean;
  reconnecting: boolean;
}

const TopupContext = createContext<TopupContextType>({
  topups: [],
  isConnected: false,
  reconnecting: false,
});

export const useTopups = () => useContext(TopupContext);


// Helper function to safely upsert into Dexie
async function upsertTopup(data: TopUp) {
  const existing = await db.topups.get(data.id);
  if (existing) {
    await TopUpService.update(data.id, {
      ...existing,
      ...data,
      updatedAt: new Date(),
    });
  } else {
    await db.topups.add({
      ...data,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: new Date(),
    });
  }
}
export {
    TopupContext,
    upsertTopup
}