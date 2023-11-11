import previewDirective from "./lib/index.js";
export { handlePreview } from "./lib/util.js";

export default {
  install(Vue, options) {
    Vue.directive("preview", previewDirective(options));
  },
};
