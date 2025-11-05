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

type EventContextType = {
  topups: TopUp[];
  isConnected: boolean;
  reconnecting: boolean;
}

export const EventConsumerContext = createContext<EventContextType>({
  topups: [],
  isConnected: false,
  reconnecting: false,
});

export const useEventConsumer = () => useContext(EventConsumerContext)

// Helper function to safely upsert into Dexie
async function upsertTopup(data: TopUp) {
  const existing = await db.topups.get(data.id);
  if (existing) {
    await TopUpService.update(data.id, {
      ...existing,
      ...data,
    });
  } else {
    await db.topups.add({
      ...data,
    
    });
  }
}
export {
    upsertTopup
}