
自用剪切视频小工具，使用 Node.js 操作 ffmpeg ，支持将大视频分割为多个视频片段、合并多个视频片段为一个视频。

## 功能介绍

- 分割视频：只需要给出每个剪辑点的时分秒信息和对应片段标题，就会自动切割出对应多个视频。
- 合并视频：将多个视频依次合成一个大视频。

## 环境安装

需要 Node.js 18+ 环境，克隆项目后，安装 npm 依赖。

## 分割视频

进入目录，打开 `action-cutting.mjs` ，能看到可以设置的内容，进行配置：

- 将视频文件放到 input 目录，更名为 input.mp4 ，或者更改视频文件名变量
- 按格式填写片段数组 segments 数组

配置后，执行 `node action-cutting.mjs` ，生成的视频将出现在 output 目录下

```js
import { cut } from "./core/cut.mjs";

const inputVideo = 'input.mp4';

const segments = [
  ['00:00:00', '第一段'],
  ['00:02:30', '第二段'],
  ['00:05:10', '第三段'],
];

cut(inputVideo, segments, 1);
```

## 合并视频

进入目录，打开 `action-merging` ，能看到可以设置的内容，进行配置：

- 将视频文件放到 input 目录，在 inputVideos 变量按顺序写入视频文件名
- 编写输出文件名 outputVide

配置后，执行 `node action-merging` ，生成的视频将出现在 output 目录下

```js
import { merge } from './core/merge.mjs'

const inputVideos = [
    '1.mp4',
    '2.mp4',
    '3.mp4'
];

const outputVide = 'merged.mp4';

merge(inputVideos, outputVide);
```