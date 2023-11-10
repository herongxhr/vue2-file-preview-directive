import { globalConfig } from "@/@core/data/global.config";
import path from "path";
// import { convertToHtml } from 'mammoth'; //npm install mammoth

const { pdfViewerTemplateUrl, imgViewerTemplateUrl, videoViewerTemplateUrl } =
  globalConfig;

// 事件处理函数
let handleFileItemClick;

export function getIframeHtml(fileInfo) {
  if (fileInfo.isImg) {
    // 首个图片的路径
    return imgViewerTemplateUrl + fileInfo.filePath;
  } else if (fileInfo.isVideo) {
    // 首个视频的路径
    return fileInfo.filePath;
  } else if (fileInfo.isAudio) {
    // 首个音频的路径
    return fileInfo.filePath;
  } else if (fileInfo.isWord) {
    // 首个word的路径
    return fileInfo.filePath;
  } else if (fileInfo.isExcel) {
    // 首个excel的路径
    return fileInfo.filePath;
  } else {
    // 首个文件的路径
    return pdfViewerTemplateUrl + fileInfo.filePath;
  }
}

export const handleClick = (event, listOptions = {}) => {
  if (event) {
    event.preventDefault();
  }
  const {
    fileList = [],
    imageList = [],
    videoList = [],
    audioList = [],
    wordList = [],
    excelList = [],
    pptList = [],
    officeList = [],
  } = listOptions;
  if (officeList.length > 0) {
    const filePath = officeList[0].filePath;
    //www.pageoffice.cn/pages/c51fa8/
    POBrowser.openWindow("/pageOffice", "width=1150px;height=900px;", filePath);
    return;
  }
  let dialog = document.createElement("div");
  dialog.classList.add("preview-dialog");

  let dialogHeader = document.createElement("div");
  dialogHeader.classList.add("preview-dialog-header");

  let dialogTitle = document.createElement("div");
  dialogTitle.classList.add("preview-dialog-title");
  dialogTitle.innerText = "文件预览";

  let closeButton = document.createElement("span");
  closeButton.classList.add("preview-close-btn");
  closeButton.innerHTML = "&times;";

  const handleClose = () => {
    dialog.removeEventListener("click", handleClose);
    document.body.removeChild(dialog);
  };

  closeButton.addEventListener("click", handleClose);

  let dialogContent = document.createElement("div");
  dialogContent.classList.add("preview-dialog-content");
  //fileList和imgList,videoList,audioList,wordList, excelList合并为一个新数组
  const fileFullList = fileList.concat(
    imageList,
    videoList,
    audioList,
    wordList,
    excelList
  );
  // 多个文件显示顶部栏
  let dialogContentFileList = null;
  if (fileFullList.length > 1) {
    dialogContentFileList = document.createElement("div");
    dialogContentFileList.classList.add("preview-dialog-file-list");
  }

  let dialogContentBody = document.createElement("div");
  dialogContentBody.classList.add("preview-dialog-file-detail");

  const frameName = "preview-iframe";
  const iframeElement = document.createElement("iframe"); //创建iframe元素
  iframeElement.setAttribute("name", frameName);

  // const videoElement = document.createElement('video'); //创建video元素
  // 默认展示第一个
  const fileInfo = fileFullList[0];
  if (fileInfo) {
    //首个文件的路径
    iframeElement.setAttribute("src", getIframeHtml(fileInfo));
    if (fileInfo.isVideo) {
      //如果是视频文件 则添加配置项
      iframeElement.setAttribute("allowfullscreen", "true");
    } else if (fileInfo.isAudio) {
      //如果是音频文件
    } else if (fileInfo.isWord) {
      //如果是word文件
    } else if (fileInfo.isExcel) {
      //如果是excel文件
    }
  }
  iframeElement.style.width = "100%";
  iframeElement.style.height = "100%";

  // 多个文件才给列表元素添加事件
  if (fileFullList.length > 1) {
    fileFullList.forEach((i) => {
      let fileListItem = document.createElement("div");
      fileListItem.classList.add("preview-dialog-file-list-item");
      fileListItem.innerText = i.fileName;

      function findIframeByName(name) {
        let iframes = document.getElementsByName(name);
        if (iframes.length > 0) {
          return iframes[0];
        } else {
          return null;
        }
      }

      handleFileItemClick = () => {
        let frameElement = findIframeByName(frameName);
        if (frameElement) {
          if (i.isImg) {
            // 图片多文件切换
            frameElement.setAttribute(
              "src",
              imgViewerTemplateUrl + imageList.map((i) => i.filePath).join(",")
            );
          } else if (i.isVideo) {
            // 视频多文件切换
            // console.log('video', i,frameElement);
            // videoElement.src = videoViewerTemplateUrl + i.filePath;
            // videoElement.controls = true; // 添加 controls 参数
            // videoElement.autoplay = false;
            // videoElement.loop = false;
            frameElement.setAttribute(
              "src",
              videoViewerTemplateUrl + i.filePath + "?controls=true"
            );
            frameElement.setAttribute("allowfullscreen", "true");
          } else if (i.isAudio) {
            // 音频多文件切换
            frameElement.setAttribute("src", i.filePath);
          } else if (i.isWord) {
            // word多文件切换 ****待实现****
            // 转换 Word 文档为 HTML
            // const reader = new FileReader();
            // reader.onload = (readerEvent) => {
            //   const arrayBuffer = readerEvent.target.result;
            //   // 使用 mammoth.js 将 Word 文档转换为 HTML
            //   convertToHtml({ arrayBuffer })
            //     .then((result) => {
            //       const html = result.value;
            //       // 将转换后的 HTML 添加到 iframe 中展示
            //       const iframe = this.$refs.myIframe;
            //       iframe.srcdoc = html;
            //     })
            //     .catch((error) => {
            //       console.error('转换出错:', error);
            //     });
            // };
            // reader.readAsArrayBuffer(i.file);
            // frameElement.setAttribute('src', i.filePath);
          } else if (i.isExcel) {
            // excel多文件切换 ****待实现****
            // frameElement.setAttribute('src', i.filePath);
          } else {
            // pdf等其他文件的切换
            frameElement.setAttribute("src", pdfViewerTemplateUrl + i.filePath);
          }
        }
      };
      fileListItem.addEventListener("click", handleFileItemClick);
      dialogContentFileList.appendChild(fileListItem);
    });
  }

  // 拼接dom渲染
  dialogHeader.appendChild(dialogTitle);
  dialogHeader.appendChild(closeButton);
  dialogContentBody.appendChild(iframeElement);
  if (dialogContentFileList) {
    dialogContent.appendChild(dialogContentFileList);
  }
  dialogContent.appendChild(dialogContentBody);
  dialog.appendChild(dialogHeader);
  dialog.appendChild(dialogContent);
  document.body.appendChild(dialog);
};

export const addEventListener = (element, eventName, eventHandle, ...args) => {
  element.addEventListener(eventName, (event) => eventHandle(event, ...args));
};

export const imgExt = [
  ".jpe",
  ".jpg",
  ".jpeg",
  ".gif",
  ".png",
  ".bmp",
  ".ico",
  ".svg",
  ".webp",
  "image",
];
export const videoExt = [".mp4", ".avi", ".wmv"];
export const audioExtend = [".mp3", ".wav", ".mov", ".m4a"];
export const wordExtend = [".doc", ".docx"];
export const excelExtend = [".xls", ".xlsx"];
export const pptExtend = [".ppt", ".pptx"];
export const pdfExtend = [".pdf"];

export const isImgType = (ext) =>
  ext && imgExt.some((i) => i.includes(ext.toLowerCase()));

export const isVideoType = (ext) =>
  ext && videoExt.some((i) => i.includes(ext.toLowerCase()));

export const isAudioType = (ext) =>
  ext && audioExtend.some((i) => i.includes(ext.toLowerCase()));

export const isWordType = (ext) =>
  ext && wordExtend.some((i) => i.includes(ext.toLowerCase()));

export const isExcelType = (ext) =>
  ext && excelExtend.some((i) => i.includes(ext.toLowerCase()));

export const isPPTType = (ext) =>
  ext && pptExtend.some((i) => i.includes(ext.toLowerCase()));

export const isOfficeType = (ext) => {
  return isWordType(ext) || isExcelType(ext) || isPPTType(ext);
};

export const isPdfType = (ext) => ext && pdfExtend.some((i) => i.includes(ext));

export const initFileWithFullPath = (file, options) => {
  const { getNginxProxyFileUrl, getFileStreamUrl } = options;
  let { filePath, fileType = "", fileName = "" } = file;

  if (!filePath) {
    const errorMessage = `${fileName}文件路径缺失`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  } else {
    let isPdf = false,
      isImg = false,
      isAudio = false,
      isVideo = false,
      isWord = false,
      isExcel = false,
      isPPT = false,
      isOffice = false;

    if (isPdfType(fileType)) {
      isPdf = true;
    } else if (isImgType(fileType)) {
      isImg = true;
    } else if (isAudioType(fileType)) {
      isAudio = true;
    } else if (isVideoType(fileType)) {
      isVideo = true;
    } else if (isWordType(fileType)) {
      isWord = true;
    } else if (isExcelType(fileType)) {
      isExcel = true;
    } else if (isPPTType(fileType)) {
      isPPT = true;
    }

    isOffice = isWord || isExcel || isPPT;
    const isNginxProxyType = isImg || isVideo || isAudio;

    let fullFilePath = filePath;
    if (!filePath.startsWith("http://") || !filePath.startsWith("https://")) {
      // 目前就是pdf类型，Office特殊处理
      if (!isNginxProxyType && !isOffice) {
        fullFilePath = getFileStreamUrl(filePath);
      } else if (!isOffice) {
        fullFilePath = getNginxProxyFileUrl(filePath);
      }
      // office类型非全路径的不处理
    }

    return {
      ...file,
      isPdf,
      isImg,
      isAudio,
      isVideo,
      isWord,
      isExcel,
      isPPT,
      isOffice,
      filePath: fullFilePath,
      isFullPath,
    };
  }
};
