import { createContext, useContext } from "react";


type EnvModeType = {
  mode: "Sandbox" | "Live";
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (mode: "Sandbox" | "Live") => void;
};
const EnvContext = createContext<EnvModeType>({
    mode: "Live",
    enabled: false,
    setEnabled: () => {},
    switchMode: () => {}
})

const useEnv = () => useContext(EnvContext);

export {
    useEnv,
    EnvContext
}