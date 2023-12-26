# Vue2 文件预览指令

## 描述

`vue2-file-preview-directive` 是一个用于 Vue2 的指令，用于预览多种文件格式，包括图片、音频、视频、PDF、Word、Excel 和 PowerPoint 文件。此指令支持在预览文件之前执行自定义的同步或异步操作，例如请求验证或记录日志。

## 安装

使用以下 npm 命令来安装这个指令：

```bash
npm install vue2-file-preview-directive
```

## 使用方法

1. 在您的 Vue 项目中导入指令：

   ```javascript
   import Vue from "vue";
   import FilePreviewDirective from "vue2-file-preview-directive";

   Vue.use(FilePreviewDirective);
   ```

2. 在 Vue 组件中使用指令：

   ```vue
   <template>
     <div v-file-preview="fileListOptions"></div>
   </template>

   <script>
   export default {
     data() {
       return {
         fileListOptions: {
           fileList: [
             /* 文件对象数组 */
           ],
           beforePreviewRequest: async (file) => {
             // 可选: 在预览文件之前执行的自定义操作
           },
         },
       };
     },
   };
   </script>
   ```

## API

### 指令绑定值

- `fileListOptions`：一个对象，包含以下属性：
  - `fileList`：文件对象数组，每个文件对象应包含文件类型和路径。
  - `beforePreviewRequest`：可选，一个函数，用于在预览文件之前执行自定义操作。可以是同步或异步。

### 文件对象结构

- `filePath`：文件的路径或 URL。
- `fileType`：文件类型，例如 'image', 'audio', 'video', 'pdf', 'word', 'excel', 'ppt'。

## 作者

herong

## 许可证

本项目遵循 MIT 许可证。
