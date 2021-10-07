import { before } from "lodash";
import {
  processPseudoSelector,
  insertStylesIntoDOM,
  createSelector,
  removeStylesFromDOM,
} from "../utils";
type RuleMockObject = {
  [key: string]: string;
};
const generateRandomCSSIndex = () => {
  return `css-${Math.floor(Math.random() * (1000 - 100) + 100)}-${Math.floor(
    Math.random() * (1000 - 100) + 100
  )}-${Math.floor(Math.random() * (1000 - 100) + 100)}`;
};
describe("processPseudoSelector function", () => {
  it("should be able to process :focus styles and return combined styles", () => {
    const mockInput = "big-button:focus";
    const pseudoSelector = ":focus";
    const response = processPseudoSelector(mockInput, pseudoSelector);
    expect(response).toBe(`${mockInput}, .pseudo-focus`);
  });
  it("should be able to process :hover styles and return combined styles", () => {
    const mockInput = "big-button:hover";
    const pseudoSelector = ":hover";
    const response = processPseudoSelector(mockInput, pseudoSelector);
    expect(response).toBe(`${mockInput}, .pseudo-hover`);
  });
  it("should be able to process :focus-visible styles and return the combined styles", () => {
    const mockInput = "big-button:focus-visible";
    const pseudoSelector = ":focus-visible";
    const response = processPseudoSelector(mockInput, pseudoSelector);
    expect(response).toBe(`${mockInput}, .pseudo-focus-visible`);
  });
  it("should be able process :focus-within and return the combined styles", () => {
    const mockInput = "big-button:focus-within";
    const pseudoSelector = ":focus-within";
    const response = processPseudoSelector(mockInput, pseudoSelector);
    expect(response).toBe(`${mockInput}, .pseudo-focus-within`);
  });

  it("should be able process :active and return the combined styles", () => {
    const mockInput = "big-button:active";
    const pseudoSelector = ":active";
    const response = processPseudoSelector(mockInput, pseudoSelector);
    expect(response).toBe(`${mockInput}, .pseudo-active`);
  });
  it("should be able process :not:focus-visible and return the combined styles", () => {
    const pseudoSelector = ":not(:focus-visible)";
    const mockInput = `big-button${pseudoSelector}`;

    const response = processPseudoSelector(mockInput, pseudoSelector);
    expect(response).toBe(`${mockInput}, :not(.pseudo-focus-visible)`);
  });
  // Setup for performance benchmark
  const generateMockRules = () => {
    const result: RuleMockObject = {};
    const amountOfRules = 3000;
    const pseudoStyles = [":hover", ":focus-visible", ":focus", ":active"];
    for (let i = 0; i < amountOfRules; i++) {
      // generate number between 0-3
      const whichStyleIndex = Math.floor(Math.random() * pseudoStyles.length);
      const cssSelectorText = generateRandomCSSIndex();
      const entireRule = `${cssSelectorText}${pseudoStyles[whichStyleIndex]} {outline:1px red;}`;
      Object.assign(result, { [cssSelectorText]: entireRule });
    }
    return result;
  };
  const rules = generateMockRules();
  it("should be able to process a large amount of styles without crashing and under 60ms", () => {
    const start = performance.now();
    for (const ruleCssSelectorAsKey of Object.keys(rules)) {
      const rule = rules[ruleCssSelectorAsKey];
      processPseudoSelector(rule, ruleCssSelectorAsKey);
    }
    const end = performance.now();

    expect(end - start).toBeLessThan(60);
  });
});

describe("insertStylesIntoDOM ", () => {
  beforeAll(() => {
    document.head.innerHTML = `<head/>`;
  });

  it("should be able to insert basic styles into the dom", () => {
    const styles = ["primary-button:focus{outline:1px red}"];
    const mockContextId = "button-primary";

    insertStylesIntoDOM(styles, mockContextId);
    const styleSelector = createSelector(mockContextId);

    const htmlStyles = document.head.innerHTML;

    expect(htmlStyles).toContain(styleSelector);
  });
});
describe("removeStylesFromDOM", () => {
  beforeAll(() => {
    document.head.innerHTML = `<head/>`;
  });
  it("should be able to remove basic styles from the dom", () => {
    const styles = ["primary-button:focus{outline:1px red}"];
    const mockContextId = "button-primary";
    // add our styles
    insertStylesIntoDOM(styles, mockContextId);
    removeStylesFromDOM(mockContextId);
    const styleSelector = createSelector(mockContextId);

    const htmlStyles = document.head.innerHTML.search(styleSelector);
    // it should not be there, so it should have an index of -1
    expect(htmlStyles).toBe(-1);
  });
});
