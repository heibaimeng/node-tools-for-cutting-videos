import * as fs from 'fs/promises'
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

function timeStrToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map((x) => +x || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

function getDuration(start, end) {
  const startSeconds = timeStrToSeconds(start);
  const endSeconds = timeStrToSeconds(end);
  return Math.abs(endSeconds - startSeconds);
}

function secondsToTimeStr(seconds) {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

async function ensureOutputDirExists() {
  const outputDir = 'output';

  try {
    await fs.access(outputDir);
    console.log('检查 output 目录已存在。');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(outputDir, { recursive: true });
      console.log('创建 output 目录成功。');
    } else {
      throw error;
    }
  }
}

function cut({
  inputVideo,
  start,
  end,
  outputFileName
}) {
  const duration = getDuration(start, end)

  return new Promise((resolve, reject) => {
    ffmpeg(inputVideo)
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
export async function run(inputVideo, segments, startNumber = 1, numberLength = 2) {
  ffmpeg.ffprobe(inputVideo, async (err, metadata) => {
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

      await cut({
        inputVideo,
        start,
        end,
        outputFileName
      })
    }
  });
}