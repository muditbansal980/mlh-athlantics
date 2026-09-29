import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Extract frames from video for MediaPipe processing
 */
export async function extractFrames(
  videoPath: string,
  outputDir: string,
  fps: number = 1 // 1 frame per second (optimized for CPU)
): Promise<string[]> {
  // console.log("Extracting frames")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const framePattern = path.join(outputDir, "frame-%03d.jpg");

    ffmpeg(videoPath)
      .outputOptions([
        `-vf fps=${fps}`, // controls frame rate
      ])
      .output(framePattern)
      .on("end", () => {
        const files = fs
          .readdirSync(outputDir)
          .filter((file) => file.endsWith(".jpg"))
          .map((file) => path.join(outputDir, file));

        resolve(files);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
}