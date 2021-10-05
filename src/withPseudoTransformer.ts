import {
  useEffect,
  useGlobals,
  useMemo,
  StoryFn as StoryFunction,
  StoryContext,
} from "@storybook/addons";
import {
  processPseudoSelector,
  insertStylesIntoDOM,
  matchOnePseudoSelector,
  removeStylesFromDOM,
  useHasHuber,
} from "./utils";
import { STYLE_PREFIX, GLOBAL_PARAM_KEY } from "./constants";

type cssRule = {
  cssText?: string;
  selectorText?: string;
};

// Returns an array of css rules that match the pseudo states and
// have their pseudo selectors replaced with class names
function replacedPseudoSelectors(
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

export function withPseudoTransformer(
  StoryFn: StoryFunction,
  context: StoryContext
) {
  const [globals] = useGlobals();
  const isSudoPseudoEnabled = globals[GLOBAL_PARAM_KEY];
  const hasHuberAdded = useHasHuber();

  const getModifiedStyles = useMemo(() => {
    const stylesSheets = document.styleSheets;
    return replacedPseudoSelectors(stylesSheets);
  }, [context.id]);

  useEffect(() => {
    if (!isSudoPseudoEnabled) {
      // remove huber from the DOM
      removeStylesFromDOM(context.id);
    } else if (!hasHuberAdded) {
      // if we haven't added huber yet, add it to the DOM
      const processedStyles = getModifiedStyles;
      insertStylesIntoDOM(processedStyles, context.id);
    }

    return () => {
      removeStylesFromDOM(context.id);
    };
  }, [
    getModifiedStyles,
    context.id,
    isSudoPseudoEnabled,
    removeStylesFromDOM,
    insertStylesIntoDOM,
  ]);

  return StoryFn();
}
