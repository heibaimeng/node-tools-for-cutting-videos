import { cut } from "./core/cut.mjs";

const inputVideo = 'input.mp4';

const segments = [
  ['00:00:00', '第一段'],
  ['00:02:30', '第二段'],
  ['00:05:10', '第三段'],
];

cut(inputVideo, segments, 1);