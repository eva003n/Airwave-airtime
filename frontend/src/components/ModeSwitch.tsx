import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEnv } from "@/context/Environment/env.context";
const ModeSwitch = () => {
  const { mode, switchMode, enabled, setEnabled } = useEnv();

  const handleModeChange = (checked: boolean) => {
    setEnabled(checked);

    if (!enabled) {
      switchMode("Sandbox");
    } else {
      switchMode("Live");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="mode"
        className={`${
          enabled
            ? "bg-gray-300"
            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        }`}
        checked={enabled}
        onCheckedChange={(checked) => handleModeChange(checked)}
      />
      <span className="text-gray-400 tracking-widest w-20 text-sm">
        {enabled ? "Sandbox" : "Live"}
      </span>
    </div>
  );
};

export default ModeSwitch;
