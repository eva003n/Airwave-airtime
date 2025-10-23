import { db } from "@/db/db";
import { getItem } from "@/utils";
import type { UserData } from "@/validation/validators";
import { useLiveQuery } from "dexie-react-hooks";
import { useState, useRef, useEffect } from "react";
import { TopupContext, upsertTopup } from "./topup.context";
import { apiClient } from "@/api/apiclient";
import { TopUpService } from "@/db/topup.service";

const API_BASE = import.meta.env.VITE_API_BASE_URI || "http://localhost:8000/api/v1";

export const TopupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const [token, setToken] = useState("");
  

  const topups = useLiveQuery(
    () => db.topups.orderBy("createdAt").reverse().toArray(),
    [] 
  ) || [];

  // Function to start SSE connection
  const connectStream = () => {
    const user = getItem<UserData>("user")
    if(!user) return
    const url = `${API_BASE}/top-ups/progress/${user.id}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSourceRef.current = eventSource;
    setIsConnected(true);

    eventSource.addEventListener("topup", async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data)
        await TopUpService.add(data);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    })

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };


    eventSource.onerror = async (error) => {
      if (eventSource?.readyState === EventSource.CLOSED) {
      await handleSessionExpired();

      }

      console.warn("SSE error or disconnect:", error);
        setIsConnected(false);
        eventSource.close();

      
          scheduleReconnect();
        
    };
  };

  const scheduleReconnect = () => {
    if (reconnectTimer.current) return; // Avoid multiple timers
    setReconnecting(true);
    reconnectTimer.current = setTimeout(() => {
      console.log("Reconnecting SSE...");
      setReconnecting(false);
      connectStream();
      reconnectTimer.current = null;
    }, 5000);
  };

  const handleSessionExpired = async() => {
   
    const newToken = await apiClient.getAccessToken();
    if(newToken) setToken(newToken)
   
  };

//   const checkTokenValidity = async (): Promise<boolean> => {
//     try {
//       const res = await fetch(`${API_BASE}/auth/check`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       });]
//       return res.ok;
//     } catch {
//       return false;
//     }
//   };

  // Cleanup old topups every 168h  1 week
  const cleanupOldTopups = async (hours = 168) => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    await db.topups.where("createdAt").below(cutoff.toISOString()).delete();
  };

  useEffect(() => {
    connectStream();
    cleanupOldTopups();
    return () => {
      eventSourceRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [token, eventSourceRef]);

  return (
    <TopupContext.Provider value={{ topups, isConnected, reconnecting }}>
      {children}
    </TopupContext.Provider>
  );
};
