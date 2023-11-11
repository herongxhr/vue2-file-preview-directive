import { addEventListener, handlePreview, initFileWithFullPath } from "./util";
import handlePreview from "./handle";

// lib/index.js
export default function previewDirective(options) {
  return (el, { value }) => {
    debugger;
    if (el.hasInit) return;
    if (!value) {
      console.log(`v-preview指令必须传入文件数据！`);
      return;
    }
    // value值是响应式的
    let sourceFileList = [];
    if (Array.isArray(value)) {
      sourceFileList = value;
    } else if (typeof value === "string") {
      // 如果value是逗号分隔的字符串，则分隔成数组
      sourceFileList = value.split(",").filter(Boolean);
    } else {
      sourceFileList = [value];
    }

    sourceFileList = sourceFileList.map((fileInfo) => {
      let filePath, fileName, fileType;
      if (typeof fileInfo === "string") {
        filePath = fileInfo;
        fileName = filePath.split("/").pop();
        fileType = fileName.split(".").pop();
        fileInfo = { filePath, fileName, fileType };
      }
      fileInfo = initFileWithFullPath(fileInfo, options);
      return fileInfo;
    });

    addEventListener(el, "click", handlePreview, options, sourceFileList);
    // 只处理一次
    el.hasInit = true;
  };
}
