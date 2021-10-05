import { interpolateStyleSheet } from "../withPseudoTransformer";
function config(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/preview")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/manager")];
}
function myTestPreset(entry, ...rest) {
  console.log("loading test Preset", entry, { ...rest });
  interpolateStyleSheet(document.styleSheets);
}
module.exports = {
  managerEntries,
  config,
  myTestPreset,
};
