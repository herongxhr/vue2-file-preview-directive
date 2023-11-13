import previewDirective from "./lib/index.js";
export { default as handlePreview } from "./lib/handle.js";

export default {
  install(Vue, options) {
    Vue.directive("preview", previewDirective(options));
  },
};

console.log("first");
