import { addEventListener, initFileWithFullPath } from "@/lib/util.js";
import handlePreview from "@/lib/handle.js";

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `file-${timestamp}-${randomPart}`;
}

export default function previewDirective(options) {
  const updateFileList = (el, fileList, options) => {
    let sourceFileList = fileList.map((fileInfo) => {
      let filePath, fileName, fileType;
      if (typeof fileInfo === "string") {
        filePath = fileInfo;
        fileName = filePath.split("/").pop();
        fileType = fileName.split(".").pop();
        const uniqueId = generateUniqueId();
        fileInfo = { filePath, fileName, fileType, id: uniqueId };
      }
      fileInfo = initFileWithFullPath(fileInfo, options);
      return fileInfo;
    });

    // 移除旧的事件监听器
    if (el._handlePreviewListener) {
      el.removeEventListener("click", el._handlePreviewListener);
    }

    // 添加新的事件监听器
    el._handlePreviewListener = (event) =>
      handlePreview(event, options, sourceFileList);
    addEventListener(el, "click", el._handlePreviewListener);
  };

  return {
    bind(el, { value }, vnode) {
      if (!value) {
        console.warn(`v-preview指令必须传入文件数据！`);
        return;
      }
      if (Array.isArray(value) || typeof value === "string") {
        updateFileList(el, value, options);
      }
    },
    update(el, { value }, vnode) {
      if (!value) {
        console.warn(`v-preview指令必须传入文件数据！`);
        return;
      }
      if (Array.isArray(value) || typeof value === "string") {
        updateFileList(el, value, options);
      }
    },
    unbind(el) {
      if (el._handlePreviewListener) {
        el.removeEventListener("click", el._handlePreviewListener);
      }
    },
  };
}
