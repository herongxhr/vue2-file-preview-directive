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
    const isFullPath =
      !filePath.startsWith("http://") || !filePath.startsWith("https://");
    let fullFilePath = filePath;
    if (isFullPath) {
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
