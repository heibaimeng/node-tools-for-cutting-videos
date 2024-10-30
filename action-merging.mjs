import { merge } from './core/merge.mjs'

const inputVideos = [
    '1.mp4',
    '2.mp4',
    '3.mp4'
];

const outputVide = 'merged.mp4';

merge(inputVideos, outputVide);