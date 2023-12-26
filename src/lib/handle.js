const iframeId = "vue2-file-preview-directive-iframe";
const mediaId = "vue2-file-preview-directive-media";
const previewContainerId = "vue2-file-preview-container";
const primaryColor = "#736cdf";
const sideBarWidth = "300px";

const dialogStyles = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexFlow: "column nowrap",
  zIndex: "999999",
};

// 头部样式
const headerStyles = {
  height: "50px",
  lineHeight: "50px",
  padding: "0 1rem",
  backgroundColor: primaryColor,
  flex: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

// 标题样式
const titleStyles = {
  fontSize: "24px",
  color: "white",
};

// 关闭按钮样式
const closeButtonStyles = {
  fontSize: "24px",
  color: "white",
  cursor: "pointer",
};

// 内容区域样式
const contentStyles = {
  flex: "1",
  position: "relative",
  backgroundColor: "white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "stretch",
};

const fileListViewStyles = {
  width: sideBarWidth,
  display: "flex",
  flexFlow: "column nowrap",
  padding: "8px",
  background: "#eee",
};

const listItemStyles = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "16px",
  background: "#fff",
  color: "#736cdf",
  borderBottom: "1px solid #ccc",
  whiteSpace: "normal", // 允许文本换行
  overflow: "hidden", // 超出容器隐藏
  textOverflow: "ellipsis", // 显示省略符号表示文本被截断
};

const previewContainerStyles = {
  flex: "1",
  height: "100%",
  position: "relative", // 相对定位，为了媒体元素的绝对定位
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fileListItemTitleStyles = {
  marginLeft: "0.5rem",
  display: "inline-block",
  width: `calc(${sideBarWidth} - 60px)`,
  whiteSpace: "wrap",
  wordWrap: "break-word",
};

/* 在您的样式表中添加 */
const selectedFileItemStyles = {
  backgroundColor: primaryColor,
  color: "#fff",
};

const createElementWithStyles = (
  elementType,
  classNames,
  textContent,
  styles
) => {
  let element = document.createElement(elementType);
  classNames.forEach((className) => element.classList.add(className));
  element.textContent = textContent || "";
  Object.assign(element.style, styles);
  return element;
};

const createFileList = (fileList, options, content) => {
  let fileListView = createElementWithStyles(
    "div",
    ["preview-dialog-file-list"],
    "",
    fileListViewStyles
  );

  fileList.forEach((file) => {
    fileListView.appendChild(buildFileListItem(file, options, content));
  });

  return fileListView;
};

const clearFileSelection = (fileListView) => {
  const fileItems = fileListView.querySelectorAll(
    ".preview-dialog-file-list-item"
  );
  fileItems.forEach((item) => {
    item.style.color = primaryColor;
    item.style.backgroundColor = "#fff";
  });
};

const handleFileItemClick = async (
  file,
  content,
  options,
  hasList = false,
  closePreviewHandle
) => {
  let previewContainer = content.querySelector(`#${previewContainerId}`);

  // 如果 previewContainer 不存在，创建它
  if (!previewContainer) {
    previewContainer = createElementWithStyles(
      "div",
      ["preview-container"],
      "",
      hasList
        ? previewContainerStyles
        : {
            flex: "1",
            justifyContent: "center",
            alignItems: "center",
          } // 根据是否有列表调整样式
    );
    previewContainer.id = previewContainerId;
    content.appendChild(previewContainer);
  }

  if (options.beforePreview && typeof options.beforePreview === "function") {
    try {
      await options.beforePreview(file);
    } catch (error) {
      console.error("执行beforePreview出错：", error);
      // 可选：处理错误，例如关闭弹窗或显示错误消息
      return;
    }
  }

  // 移除之前所有项的选中效果，并为当前点击的项添加选中效果
  if (hasList) {
    const fileListView = content.querySelector(".preview-dialog-file-list");
    clearFileSelection(fileListView);
    const currentFileItem = fileListView.querySelector(
      `[data-file-id="${file.id}"]`
    );
    if (currentFileItem) {
      Object.assign(
        currentFileItem.style,
        listItemStyles,
        selectedFileItemStyles
      );
    }
  }

  // 清除现有的 iframe 和 mediaElement
  const existingIframe = previewContainer.querySelector(`#${iframeId}`);
  if (existingIframe) {
    previewContainer.removeChild(existingIframe);
  }
  const existingMediaElement = previewContainer.querySelector(`#${mediaId}`);
  if (existingMediaElement) {
    previewContainer.removeChild(existingMediaElement);
  }

  // 创建 iframe 或 mediaElement
  let iframe = createElementWithStyles("iframe", ["preview-iframe"], "", {
    width: "100%",
    height: "100%", // 默认显示
    display: "none", // 默认不显示
  });
  iframe.id = iframeId;
  previewContainer.appendChild(iframe); // 添加 iframe 到 previewContainer

  let mediaElement = createElementWithStyles(
    file.isAudio ? "audio" : "video",
    ["preview-media"],
    "",
    {
      width: "100%",
      height: "100%", // 默认显示
      display: "none", // 默认不显示
    }
  );
  mediaElement.id = mediaId;
  previewContainer.appendChild(mediaElement); // 添加 mediaElement 到 previewContainer

  // 确保 iframe 和 mediaElement 不同时显示
  iframe.style.display = "none";
  mediaElement.style.display = "none";

  // 根据文件类型更新元素属性和样式
  if (file.isImg || file.isPdf) {
    iframe.src = getIframeSrc(file, options);
    iframe.style.display = "block";
  } else if (file.isAudio || file.isVideo) {
    mediaElement.src = file.filePath;
    mediaElement.controls = true;
    mediaElement.style.position = "absolute";
    mediaElement.style.display = "block";
    mediaElement.style.height = file.isVideo ? "100%" : "60px"; // 视频填充高度，音频则固定高度
  }

  // 处理 Office 文件的逻辑...
  if (file.isOffice) {
    // 关闭弹窗
    closePreviewHandle();
    POBrowser.openWindow(
      "/pageOffice",
      "width=1150px;height=900px;",
      file.filePath
    );
  }
};

// 根据文件类型构建文件列表项
const buildFileListItem = (file, options, content) => {
  let fileListItem = createElementWithStyles(
    "div",
    ["preview-dialog-file-list-item"],
    "",
    listItemStyles
  );
  fileListItem.setAttribute("data-file-id", file.id);

  let fileNameSpan = createElementWithStyles(
    "span",
    [],
    file.fileName,
    fileListItemTitleStyles // 文字距离缩略图的间距
  );

  // 创建缩略图或图标
  let thumbnail;
  if (file.isImg) {
    thumbnail = createElementWithStyles(
      "img",
      ["file-thumbnail"],
      "",
      { src: file.thumbnailUrl || file.filePath } // 假设图片文件有缩略图URL
    );
  } else if (file.isAudio || file.isVideo) {
    thumbnail = createElementWithStyles(
      "img",
      ["file-thumbnail"],
      "",
      { src: file.coverUrl || "default-audio-video-cover.jpg" } // 音频/视频封面图
    );
  } else {
    // 对于PDF、Word、Excel和PPT文件，使用默认图标
    let iconMap = {
      isPdf: "default-pdf-icon.jpg",
      isWord: "default-word-icon.jpg",
      isExcel: "default-excel-icon.jpg",
      isPPT: "default-ppt-icon.jpg",
    };
    thumbnail = createElementWithStyles(
      "img",
      ["file-thumbnail"],
      "",
      { src: iconMap[file.fileType] || "default-file-icon.jpg" } // 指定文件类型的默认图标
    );
  }

  fileListItem.appendChild(thumbnail);
  fileListItem.appendChild(fileNameSpan);
  fileListItem.addEventListener("click", () =>
    handleFileItemClick(file, content, options, true)
  );

  return fileListItem;
};

export default (event, options = {}, fileList) => {
  if (event) {
    event.preventDefault();
  }
  if (!fileList.length) {
    console.log("要预览的文件数据为空");
    return;
  }
  // 使用样式创建元素
  const dialog = createElementWithStyles(
    "div",
    ["preview-dialog"],
    "",
    dialogStyles
  );

  const header = createElementWithStyles(
    "div",
    ["preview-dialog-header"],
    "",
    headerStyles
  );

  const title = createElementWithStyles(
    "div",
    ["preview-dialog-title"],
    "文件预览",
    titleStyles
  );

  const closeButton = createElementWithStyles(
    "span",
    ["preview-close-btn"],
    "关闭",
    closeButtonStyles
  );

  const content = createElementWithStyles(
    "div",
    ["preview-dialog-content"],
    "",
    contentStyles
  );

  // 添加关闭事件监听
  const handleClose = () => {
    closeButton.removeEventListener("click", handleClose);
    document.body.removeChild(dialog);
  };
  closeButton.addEventListener("click", handleClose);

  // 判断文件列表长度并相应处理
  let dialogContentFileList = null;
  if (fileList.length > 1) {
    dialogContentFileList = createFileList(fileList, options, content);
    content.appendChild(dialogContentFileList); // 只有多个文件时添加文件列表
    // 默认展示第一个文件
    handleFileItemClick(fileList[0], content, options, true, handleClose);
  } else if (fileList.length === 1) {
    // 单个文件情况下的处理
    // 根据文件类型创建并展示对应的元素
    handleFileItemClick(fileList[0], content, options, false, handleClose);
  }

  header.appendChild(title);
  header.appendChild(closeButton);
  dialog.appendChild(header);
  dialog.appendChild(content);
  document.body.appendChild(dialog);
};

export function getIframeSrc(fileInfo = {}, options) {
  const { filePath } = fileInfo;
  // 检查fileInfo是否有效
  if (!filePath) {
    throw new Error("无效的fileInfo参数");
  }

  const { publicPath = "" } = options;
  const pdfViewerTemplateUrl = `${publicPath}/pdfjs/web/viewer.html?file=`;
  const imgViewerTemplateUrl = `${publicPath}/photoswipe/photoswipe.html?url=`;

  return fileInfo.isImg
    ? `${imgViewerTemplateUrl}${filePath}`
    : `${pdfViewerTemplateUrl}${filePath}`;
}
