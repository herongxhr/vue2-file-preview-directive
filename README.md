````markdown
# Vue2 File Preview Directive

## 描述

`vue2-file-preview-directive`是一个 Vue2 指令，用于在前端预览图片、音频、视频、PDF、Word、Excel、PPT 等多种文件格式。

## 安装

您可以通过以下命令安装此指令：

```bash
npm install vue2-file-preview-directive
```
````

## 使用方法

1. 首先，在您的 Vue 项目中导入指令：

   ```javascript
   import FilePreviewDirective from "vue2-file-preview-directive";
   ```

2. 在您的 Vue 组件中使用指令：

   ```vue
   <template>
     <div v-file-preview="fileList"></div>
   </template>

   <script>
   export default {
     directives: {
       FilePreviewDirective,
     },
     data() {
       return {
         fileList: [
           /* 文件数组 */
         ],
       };
     },
   };
   </script>
   ```

## API

### 指令绑定值

- `fileList`: 文件对象数组，每个文件对象应包含文件类型和路径。

### 文件对象结构

- `filePath`: 文件路径或 URL。
- `fileType`: 文件类型，如'image', 'audio', 'video', 'pdf', 'word', 'excel', 'ppt'。

## 作者

herong

## 许可证

此项目遵循 MIT 许可证。

```

您可以根据实际情况调整和完善这个文档，比如添加更详细的安装和配置说明，或者包含更多关于如何在不同场景中使用该指令的示例。
```
