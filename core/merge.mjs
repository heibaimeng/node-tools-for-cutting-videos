import * as fs from 'fs/promises'
import ffmpeg from './instance.mjs'
import { ensureOutputDirExists } from './utils.mjs';

export async function merge(inputVideos, outputVideo) {
    await ensureOutputDirExists()
    // 创建一个临时文件列表
    const fileList = 'filelist.txt';
    const fileContent = inputVideos.map(video => `file 'input/${video}'`).join('\n');

    await fs.writeFile(fileList, fileContent);

    // 执行合并视频
    ffmpeg()
        .input(fileList)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions(['-c:v copy', '-c:a copy'])
        .output(`output/${outputVideo}`)
        .on('end', async () => {
            console.log(`合并文件成功: ${outputVideo}`);
            await fs.unlink(fileList);
        })
        .on('error', async err => {
            console.error(`合并文件失败: ${err.message}`);
            await fs.unlink(fileList);
        })
        .run();
}
