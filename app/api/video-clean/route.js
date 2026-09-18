import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { stripVideoMetadata } from "@/lib/ffmpeg";
import { cleanOutputName, isVideoFile, videoFileExt } from "@/lib/video-metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function saveUpload(file, destPath) {
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, bytes);
}

export async function POST(request) {
  const jobDir = path.join(os.tmpdir(), `video-clean-${randomUUID()}`);

  try {
    const form = await request.formData();
    const video = form.get("video");

    if (!(video instanceof File) || !isVideoFile(video)) {
      return Response.json({ error: "Envie um arquivo de vídeo." }, { status: 400 });
    }

    await fs.mkdir(jobDir, { recursive: true });

    const ext = videoFileExt(video, "mp4");
    const inputPath = path.join(jobDir, `input.${ext}`);
    const outputName = cleanOutputName(video.name);
    const outputPath = path.join(jobDir, outputName);

    await saveUpload(video, inputPath);
    await stripVideoMetadata(inputPath, outputPath, { ext });

    const out = await fs.readFile(outputPath);
    const type = video.type || `video/${ext === "mkv" ? "x-matroska" : ext}`;

    return new Response(out, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename="${outputName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[video-clean]", err);
    return Response.json(
      { error: err?.message || "Falha ao limpar os metadados do vídeo." },
      { status: 500 }
    );
  } finally {
    try {
      await fs.rm(jobDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}
