import * as fs from 'fs/promises'

/**
 * 将格式化的时间字符串转为秒数
 * @param {string} time 格式化的时间字符串
 * @returns 
 */
export function timeStrToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map((x) => +x || 0);
    return hours * 3600 + minutes * 60 + seconds;
};

/**
 * 根据时间段获取片段时长
 * @param {string} start 开始时间
 * @param {string} end 结束时间
 * @returns 
 */
export function getDuration(start, end) {
    const startSeconds = timeStrToSeconds(start);
    const endSeconds = timeStrToSeconds(end);
    return Math.abs(endSeconds - startSeconds);
}

/**
 * 秒转换为格式化的时间字符串
 * @param {number} seconds 秒数
 * @returns 
 */
export function secondsToTimeStr(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}


/**
 * 确保output目录存在，不存在时创建
 */
export async function ensureOutputDirExists() {
    const outputDir = 'output';

    try {
        await fs.access(outputDir);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(outputDir, { recursive: true });
            console.log('创建 output 目录成功。');
        } else {
            throw error;
        }
    }
}
