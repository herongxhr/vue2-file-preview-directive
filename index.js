import previewDirective from "./lib/index.js";

export default {
  install(Vue, options) {
    Vue.directive("preview", previewDirective(options));
  },
};
