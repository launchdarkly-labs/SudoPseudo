import { useEffect, useState } from "@storybook/addons";
import {
  PSEUDO_STATES,
  ADDON_STYLES_SELECTOR,
  STYLE_PREFIX,
  ROOT_STYLE_PREFIX,
} from "./constants";

const pseudoStates = Object.values(PSEUDO_STATES);
export const matchAllPseudoSelectors = new RegExp(
  `:(${pseudoStates.join("|")})`,
  "g"
);
export const matchOnePseudoSelector = new RegExp(
  `:(${pseudoStates.join("|")})`
);

// Replaces a pseudo selector with a class name instead
// ex: :focus becomes .pseudo-focus
export function processPseudoSelector(
  ct: string,
  st: string
): string | undefined {
  return ct.replace(
    st,
    st
      .split(", ")
      .flatMap((selector: string) => {
        if (selector.includes(`.${STYLE_PREFIX}-`)) return [];

        const modifiedSelector = selector.replace(
          matchAllPseudoSelectors,
          (originalSelector: string | undefined, state: string) => {
            const replacement = originalSelector.replace(
              `:${state}`,
              `.${STYLE_PREFIX}-${state}`
            );
            return replacement;
          }
        );

        return [st, modifiedSelector];
      })
      .join(", ")
  );
}

// appends a prefix to a selector
function createSelector(s: string) {
  return `${ROOT_STYLE_PREFIX}-${s}`;
}

export function insertStylesIntoDOM(
  styleList: Array<string>,
  contextId: string
) {
  if (document.getElementById(ADDON_STYLES_SELECTOR)) return;

  const markingElement = document.createElement("style");
  markingElement.setAttribute("id", ADDON_STYLES_SELECTOR);
  document.head.appendChild(markingElement);

  const selectorID = createSelector(contextId);
  const style = document.createElement("style");
  style.setAttribute("id", selectorID);

  const cssText = styleList.join(" ");
  style.innerHTML = cssText;
  if (document.getElementById(selectorID)) {
    // this means we already inserted this into the DOM. We just need to update whats inside
    document.getElementById(selectorID).innerHTML = cssText;
  } else {
    document.head.appendChild(style);
  }
}

export function removeStylesFromDOM(contextId: string) {
  const selectorID = createSelector(contextId);
  document.getElementById(selectorID)?.remove();

  document.getElementById(ADDON_STYLES_SELECTOR)?.remove();
}

// This checks to see if we have already modified the stylesheets
export function useHasHuber() {
  const [hasHuber, setHasHuber] = useState<boolean>(false);
  // each story is isolated from the other
  useEffect(() => {
    const huberElemFound = !!document
      .getElementsByTagName("style")
      .namedItem(ADDON_STYLES_SELECTOR);

    if (hasHuber !== huberElemFound) {
      setHasHuber(huberElemFound);
    }
  }, []);

  return hasHuber;
}
