import { addEventListener, initFileWithFullPath } from "@/lib/util.js";
import handlePreview from "@/lib/handle.js";

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `file-${timestamp}-${randomPart}`;
}

export default function previewDirective(options) {
  const updateFileList = (el, value, options) => {
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
        const uniqueId = generateUniqueId();
        fileInfo = { filePath, fileName, fileType, id: uniqueId };
      }
      fileInfo = initFileWithFullPath(fileInfo, options);
      return fileInfo;
    });

    // 移除旧的事件监听器
    if (el._handlePreviewListenerRef) {
      el.removeEventListener("click", el._handlePreviewListenerRef);
    }

    // 定义事件处理器
    const handlePreviewEvent = (event) =>
      handlePreview(event, options, sourceFileList);

    // 添加新的事件监听器
    el.addEventListener("click", handlePreviewEvent);
    el._handlePreviewListenerRef = handlePreviewEvent;
  };

  return {
    bind(el, { value }, vnode) {
      if (!value) {
        console.warn(`v-preview指令必须传入文件数据！`);
        return;
      }
      updateFileList(el, value, options);
    },
    update(el, { value }, vnode) {
      if (!value) {
        console.warn(`v-preview指令必须传入文件数据！`);
        return;
      }
      // 检查 value 是否发生了变化
      if (el._prevValue !== JSON.stringify(value)) {
        updateFileList(el, value, options);
        el._prevValue = JSON.stringify(value); // 存储当前 value 的字符串表示
      }
    },
    unbind(el) {
      if (el._handlePreviewListenerRef) {
        el.removeEventListener("click", el._handlePreviewListenerRef);
      }
    },
  };
}
