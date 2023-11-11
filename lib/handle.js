const iframeId = "file-preview-iframe";

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
  backgroundColor: "#736cdf",
  flex: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

// 标题样式
const titleStyles = {
  fontSize: "1.5rem",
  color: "white",
};

// 关闭按钮样式
const closeButtonStyles = {
  fontSize: "2rem",
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
  flexFlow: "column nowrap",
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

const createFileList = (fileList, options) => {
  let fileListViewStyles = {
    flex: "none",
    display: "flex",
    flexFlow: "row nowrap",
    padding: "1rem",
    borderBottom: "1px solid #736cdf",
    overflowX: "auto",
  };

  let fileListView = createElementWithStyles(
    "div",
    ["preview-dialog-file-list"],
    "",
    fileListViewStyles
  );

  fileList.forEach((file) => {
    fileListView.appendChild(buildFileListItem(file, options));
  });

  return fileListView;
};

const handleFileItemClick = (file, content, options) => {
  let iframe = content.querySelector(`#${iframeId}`);

  if (file.isImg || file.isPdf) {
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      content.appendChild(iframe);
    }
    iframe.src = getIframeHtml(file, options); // 更新iframe的src
  } else {
    // 对于不是图片或PDF的文件，删除iframe
    if (iframe) {
      content.removeChild(iframe);
    }

    // 针对其他文件类型的处理逻辑
    if (file.isOffice) {
      // Office文件处理逻辑
      POBrowser.openWindow(
        "/pageOffice",
        "width=1150px;height=900px;",
        file.filePath
      );
    } else if (file.isAudio || file.isVideo) {
      // 音频和视频的处理逻辑
      let mediaElement = document.createElement(
        file.isAudio ? "audio" : "video"
      );
      mediaElement.src = file.filePath;
      mediaElement.controls = true;
      mediaElement.style.width = "100%";
      content.appendChild(mediaElement);
    }
  }
};

// 根据文件类型构建文件列表项
const buildFileListItem = (file, options) => {
  let listItemStyles = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    margin: "0.5rem 0",
  };

  let fileListItem = createElementWithStyles(
    "div",
    ["preview-dialog-file-list-item"],
    "",
    listItemStyles
  );

  let fileNameSpan = createElementWithStyles(
    "span",
    [],
    file.fileName,
    { marginLeft: "0.5rem" } // 文字距离缩略图的间距
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
    handleFileItemClick(file, content, options)
  );

  return fileListItem;
};

export default (event, options = {}, fileList) => {
  if (event) {
    event.preventDefault();
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
    "&times;",
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

  const frameName = "preview-iframe";
  const iframeElement = document.createElement("iframe");
  iframeElement.setAttribute("name", frameName);
  iframeElement.style.width = "100%";
  iframeElement.style.height = "100%";

  // 判断文件列表长度并相应处理
  let dialogContentFileList = null;
  if (fileList.length > 1) {
    dialogContentFileList = createFileList(fileList, options);
    content.appendChild(dialogContentFileList); // 只有多个文件时添加文件列表
  }

  // 默认展示第一个文件
  if (fileList.length > 0) {
    iframeElement.setAttribute("src", getIframeHtml(fileList[0]));
  }

  content.appendChild(iframeElement);
  dialog.appendChild(header);
  dialog.appendChild(content);
  document.body.appendChild(dialog);
};

export function getIframeHtml(fileInfo, options) {
  const { pdfViewerTemplateUrl, imgViewerTemplateUrl } = options;
  if (fileInfo.isImg) {
    return imgViewerTemplateUrl + fileInfo.filePath;
  } else {
    return pdfViewerTemplateUrl + fileInfo.filePath;
  }
}
