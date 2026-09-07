import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { extractStereoWav, muxVideoWithWav } from "@/lib/ffmpeg";
import { mergeVisibleMonoInvisibleSide } from "@/lib/wav-ms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function saveUpload(file, destPath) {
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, bytes);
}

export async function POST(request) {
  const jobDir = path.join(os.tmpdir(), `audio-merge-${randomUUID()}`);

  try {
    const form = await request.formData();
    const principal = form.get("principal");
    const invisible = form.get("invisible");
    const widthRaw = form.get("stereoWidth");
    const gainRaw = form.get("invisibleGainDb");

    if (!(principal instanceof File) || !(invisible instanceof File)) {
      return Response.json(
        { error: "Envie os dois vídeos MP4: principal e invisível." },
        { status: 400 }
      );
    }

    const stereoWidth = Number(widthRaw ?? 2);
    const invisibleGainDb = Number(gainRaw ?? -15);

    await fs.mkdir(jobDir, { recursive: true });

    const principalPath = path.join(jobDir, "principal.mp4");
    const invisiblePath = path.join(jobDir, "invisible.mp4");
    const wavA = path.join(jobDir, "a.wav");
    const wavB = path.join(jobDir, "b.wav");
    const mixedWav = path.join(jobDir, "mixed.wav");
    const outputMp4 = path.join(jobDir, "output.mp4");

    await saveUpload(principal, principalPath);
    await saveUpload(invisible, invisiblePath);

    await extractStereoWav(principalPath, wavA);
    await extractStereoWav(invisiblePath, wavB);

    const bufA = await fs.readFile(wavA);
    const bufB = await fs.readFile(wavB);
    const mixed = mergeVisibleMonoInvisibleSide(bufA, bufB, {
      stereoWidth: Number.isFinite(stereoWidth) ? stereoWidth : 2,
      invisibleGainDb: Number.isFinite(invisibleGainDb) ? invisibleGainDb : -15,
    });
    await fs.writeFile(mixedWav, mixed);

    await muxVideoWithWav(principalPath, mixedWav, outputMp4);

    const out = await fs.readFile(outputMp4);
    const base =
      (principal.name || "video").replace(/\.[^.]+$/, "").replace(/[^\w\-]+/g, "_") || "video";

    return new Response(out, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${base}-merged.mp4"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[audio-merge]", err);
    return Response.json(
      { error: err?.message || "Falha ao processar os vídeos." },
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
