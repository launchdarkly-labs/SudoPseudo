import {
  useEffect,
  useGlobals,
  useMemo,
  StoryFn as StoryFunction,
  StoryContext,
} from "@storybook/addons";
import {
  insertStylesIntoDOM,
  removeStylesFromDOM,
  replacePseudoSelectors,
  useHasPseudoClasses,
} from "./utils";
import { GLOBAL_PARAM_KEY } from "./constants";

export function withPseudoClasses(
  StoryFn: StoryFunction,
  context: StoryContext
) {
  const [globals] = useGlobals();
  const isSudoPseudoEnabled = globals[GLOBAL_PARAM_KEY];
  const hasPseudoClasses = useHasPseudoClasses();

  const getModifiedStyles = useMemo(() => {
    const stylesSheets = document.styleSheets;
    return replacePseudoSelectors(stylesSheets);
  }, [context.id]);

  useEffect(() => {
    if (!isSudoPseudoEnabled) {
      // remove our modified styles from the DOM
      removeStylesFromDOM(context.id);
    } else if (!hasPseudoClasses) {
      // if we haven't added our modified yet, add it to the DOM
      const processedStyles = getModifiedStyles;
      insertStylesIntoDOM(processedStyles, context.id);
    }

    return () => {
      removeStylesFromDOM(context.id);
    };
  }, [getModifiedStyles, context.id, isSudoPseudoEnabled]);

  return StoryFn();
}
