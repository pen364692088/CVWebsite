import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function loadShotbook(root) {
  const shotbookPath = path.join(root, "data", "alche-works-shotbook.json");
  return JSON.parse(fs.readFileSync(shotbookPath, "utf8"));
}

export function generateAlcheReferenceFrames({
  root = process.cwd(),
  outputDir = path.join(root, ".playwright-artifacts", "alche-top-page", "reference-video"),
} = {}) {
  const shotbook = loadShotbook(root);
  const videoPath = path.join(root, "Task", "参考视频.mp4");
  const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });

  if (ffmpegCheck.status !== 0) {
    throw new Error("ffmpeg is required to generate ALCHE reference frames.");
  }

  fs.mkdirSync(outputDir, { recursive: true });

  for (const shot of shotbook.shots) {
    const outputPath = path.join(outputDir, `${shot.id}.png`);
    const result = spawnSync(
      "ffmpeg",
      [
        "-loglevel",
        "error",
        "-y",
        "-ss",
        String(shot.reference.videoTime),
        "-i",
        videoPath,
        "-frames:v",
        "1",
        outputPath,
      ],
      { stdio: "inherit" },
    );

    if (result.status !== 0) {
      throw new Error(`Failed to generate reference frame for ${shot.id}.`);
    }
  }

  return {
    outputDir,
    shots: shotbook.shots.map((shot) => ({
      id: shot.id,
      outputPath: path.join(outputDir, `${shot.id}.png`),
    })),
  };
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const result = generateAlcheReferenceFrames();
  console.log(`Generated ${result.shots.length} ALCHE reference frames in ${result.outputDir}`);
}
