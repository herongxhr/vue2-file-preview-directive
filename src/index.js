import previewDirective from "@/lib/index.js";
export { default as handlePreview } from "@/lib/handle.js";
export { initFileWithFullPath } from "@/lib/util.js";

export default {
  install(Vue, options) {
    Vue.directive("preview", previewDirective(options));
  },
};
