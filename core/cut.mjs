import ffmpeg from './instance.mjs'
import {
  getDuration,
  secondsToTimeStr,
  ensureOutputDirExists
} from './utils.mjs'

/**
 * 剪切单个视频
 * @param {string} inputVideo 视频文件名
 * @param {string} start 片段开始时间
 * @param {string} end 片段结束时间
 * @param {string} outputFileName 视频文件名
 * @returns 
 */
function cutSingle(inputVideo, start, end, outputFileName) {
  const duration = getDuration(start, end)

  return new Promise((resolve, reject) => {
    ffmpeg(`input/${inputVideo}`)
      .setStartTime(start)
      .setDuration(duration)
      // 视频和音频都不重新进行编码
      .videoCodec('copy')
      .audioCodec('copy')
      .output(outputFileName)
      .on('end', () => {
        console.log(`生成视频成功: ${outputFileName}，位置 ${start}-${end} ，视频共 ${duration} 秒。`);
        resolve()
      })
      .on('error', err => {
        console.error(`生成视频失败: ${outputFileName}，错误信息: ${err.message}。`);
        reject()
      })
      .run();
  })
}

/**
 * 开始执行视频剪裁
 * @param {string} inputVideo 视频文件名
 * @param {string[][]} segments 片段信息
 * @param {number} startNumber 首个视频开始的序号
 * @param {number} numberLength 视频序号位数，不足补0
 */
export async function cut(inputVideo, segments, startNumber = 1, numberLength = 2) {
  // 先获取视频总时长，结合计算每段片段的开始时间和持续时长
  ffmpeg.ffprobe(`input/${inputVideo}`, async (err, metadata) => {
    if (err) {
      console.error('读取视频元数据出错:', err);
      return;
    }

    await ensureOutputDirExists()

    const videoDuration = metadata.format.duration;
    const segmentCount = segments.length;

    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index];

      const start = segment[0];
      const end = (index + 1 < segmentCount) ? segments[index + 1][0] : secondsToTimeStr(videoDuration);
      const outputFileName = `output/${String(startNumber + index).padStart(numberLength, '0')}. ${segment[1]}.mp4`;

      // 为保证成功率和降低能耗，每个片段逐一调用 fluent-ffmpeg 剪切视频
      await cutSingle(inputVideo, start, end, outputFileName)
    }
  });
}