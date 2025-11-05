import React, { useEffect, useState } from "react";
import { EnvContext } from "./env.context";
import { getItem, setItem } from "@/utils";
import { json } from "zod";
import { apiClient } from "@/api/apiclient";

// Provides the mode the application should run in Live or sandbox
const EnvProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"Live" | "Sandbox">(() =>
    getItem<"Live" | "Sandbox">("env") || "Live"
  );
    const [enabled, setEnabled] = useState(() => getItem<"Live" | "Sandbox">("env") === "Sandbox");
  

  const switchMode = (value: "Live" | "Sandbox") => {
    setItem("env", JSON.stringify(value));
    setMode(value);
  };

  useEffect(() => {
    const env = getItem<"Live" | "Sandbox">("env");
    //send header to backend
     apiClient.request("GET", "/")

    // if (!env) return setItem("env", JSON.stringify("Live"));

    setMode(env);
  }, [enabled]);
  return (
    <EnvContext.Provider
      value={{
        mode,
        enabled,
        setEnabled,
        switchMode,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

export default EnvProvider;
