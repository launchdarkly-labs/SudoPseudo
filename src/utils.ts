import { useEffect, useState } from "@storybook/addons";
import { memoize } from "lodash";
import {
  PSEUDO_STATES,
  ADDON_STYLES_SELECTOR,
  STYLE_PREFIX,
  ROOT_STYLE_PREFIX,
} from "./constants";

type cssRule = {
  cssText?: string;
  selectorText?: string;
};

const pseudoStates = Object.values(PSEUDO_STATES);
const joinedPseudoStates = pseudoStates.join("|");
export const matchAllPseudoSelectors = new RegExp(
  `:(${joinedPseudoStates})`,
  "g"
);
export const matchOnePseudoSelector = new RegExp(`:(${joinedPseudoStates})`);

// Replaces a pseudo selector with a class name instead
// ex: :focus becomes .pseudo-focus
export const processPseudoSelector = memoize(function (
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
});

// appends a prefix to a selector
export function createSelector(s: string) {
  return `${ROOT_STYLE_PREFIX}-${s}`;
}

/**
 * Adds styles to the DOM using a custom selector created by the function creatSelector
 * @param styleList Array of css rules as strings that will be added to the DOM
 * @param contextId
 */
export function insertStylesIntoDOM(
  styleList: Array<string>,
  contextId: string
) {
  // don't add styles again if already added
  if (document.getElementById(ADDON_STYLES_SELECTOR)) return;

  // Create the marking selector to note we have already added styles
  const markingElement = document.createElement("style");
  markingElement.setAttribute("id", ADDON_STYLES_SELECTOR);

  // Create the style rule that will be added
  // We will use a custom selector based on the Context id
  const selectorID = createSelector(contextId);
  const style = document.createElement("style");
  style.setAttribute("id", selectorID);
  // Join all the rules together
  const cssText = styleList.join("");
  style.innerHTML = cssText;

  const previouslySetStyles = document.getElementById(selectorID);
  if (previouslySetStyles) {
    // this means we already inserted this into the DOM. We just need to update whats inside
    previouslySetStyles.innerHTML = cssText;
  } else {
    const docFragment = document.createDocumentFragment();
    docFragment.appendChild(markingElement);
    docFragment.appendChild(style);
    document.head.appendChild(docFragment);
  }
}

export function removeStylesFromDOM(contextId: string) {
  const selectorID = createSelector(contextId);
  document.getElementById(selectorID)?.remove();
  document.getElementById(ADDON_STYLES_SELECTOR)?.remove();
}

// This checks to see if we have already modified the stylesheets
export function useHasPseudoClasses() {
  const [hasPseudoClasses, setHasPseudo] = useState<boolean>(false);
  // each story is isolated from the other
  useEffect(() => {
    const isUsingModifiedRules = !!document
      .getElementsByTagName("style")
      .namedItem(ADDON_STYLES_SELECTOR);

    if (hasPseudoClasses !== isUsingModifiedRules) {
      setHasPseudo(isUsingModifiedRules);
    }
  }, []);

  return hasPseudoClasses;
}

// Returns an array of css rules that match the pseudo states and
// have their pseudo selectors replaced with class names
export function replacePseudoSelectors(
  styleSheetsList?: StyleSheetList
): Array<string> {
  const rulesProcessed = [];
  if (!styleSheetsList) return [];
  for (let i = 0; i < styleSheetsList.length; i++) {
    const currentStyleSheet = styleSheetsList.item(i);

    for (let j = 0; j < currentStyleSheet.cssRules.length; j++) {
      try {
        const currentCSSRule = currentStyleSheet.cssRules.item(j);
        const { cssText, selectorText }: cssRule = currentCSSRule;
        if (
          matchOnePseudoSelector.test(cssText) &&
          !cssText.includes(`.${STYLE_PREFIX}-`)
        ) {
          // generate new rule for the pseudo state
          // ex: replace :hover with .hover
          const newRule = processPseudoSelector(cssText, selectorText);
          rulesProcessed.push(newRule);
        }
      } catch (e: unknown) {
        console.error(
          "SudoPseudo: There was an issue processing a style rule",
          e
        );
      }
    }
  }

  return rulesProcessed;
}
