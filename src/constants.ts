export const ADDON_ID = "storybook/sudo-pseudo";

export const TOOL_ID = `${ADDON_ID}/tool`;

export const PANEL_ID = `${ADDON_ID}/panel`;

export const TAB_ID = `${ADDON_ID}/tab`;

export const ADDON_STYLES_SELECTOR = "has-sudo";

export const STYLE_PREFIX = `pseudo`;

export const GLOBAL_PARAM_KEY = `sudoPseudo`;

export const ROOT_STYLE_PREFIX = `pseudo-style`;

export const PSEUDO_STATES: {
  [key: string]: string | undefined;
} = {
  hover: "hover",
  active: "active",
  focusVisible: "focus-visible",
  focusWithin: "focus-within",
  focus: "focus",
};
