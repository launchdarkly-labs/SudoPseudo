import React, { useCallback } from "react";
import { useGlobals } from "@storybook/api";

import { IconButton } from "@storybook/components";
import { TOOL_ID, GLOBAL_PARAM_KEY } from "./constants";
import { SudoIcon } from "./icons/";
export const Tool = () => {
  const [globals, updateGlobals] = useGlobals();

  const isAddonEnabled = !!globals[GLOBAL_PARAM_KEY];

  const toggleSudoPseudo = useCallback(() => {
    updateGlobals({
      [GLOBAL_PARAM_KEY]: isAddonEnabled ? undefined : true,
    });
  }, [isAddonEnabled]);

  return (
    <IconButton
      key={TOOL_ID}
      active={isAddonEnabled}
      title="Display pseudo styles"
      onClick={toggleSudoPseudo}
    >
      <SudoIcon
        fill="currentColor"
        style={{ position: "absolute", width: 0, height: 0 }}
        data-chromatic="ignore"
      />
    </IconButton>
  );
};
