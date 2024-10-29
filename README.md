
## 功能介绍

自用剪切视频小工具，使用 Node.js 操作 ffmpeg ，将大视频分割为多个视频片段。

在视频平台看一些教程时，视频往往是几个小时，在评论区里发了每个片段的导航。虽然可以快速导航过去，但还是没那么方便，尤其本地保存时更难以使用。

使用本工具，只需要给出每个剪辑点的时分秒信息和对应片段标题，就会自动切割出对应多个视频。

## 使用方法

1. 需要 Node.js 18+ 环境，克隆项目后安装 npm 依赖。

2. 进入目录，打开 `index.mjs` ，能看到可以设置的内容，进行配置：

- 将视频文件放过来目录，更名为 input.mp4 ，或者更名 `index.mjs` 中的文件名为视频文件名 inputVideo 变量
- 按格式填写片段数组 segments 变量

```js
import { run } from "./core.mjs";

const inputVideo = 'input.mp4';

const segments = [
  ['00:00:00', '第一段'],
  ['00:02:30', '第二段'],
  ['00:05:10', '第三段'],
];

run(inputVideo, segments, 1);
```

3. 执行 `node index.mjs` ，生成的视频将出现在 output 目录下

## 实现思路

所有逻辑代码在 `core.mjs` 中。

- 先获取视频总时长，结合计算每段片段的开始时间和持续时长
- 为保证成功率和降低能耗，每个片段逐一调用 fluent-ffmpeg 剪切视频
