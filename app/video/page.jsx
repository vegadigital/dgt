"use client";

import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { cleanOutputName, isVideoFile, stripMetadataArgs, videoFileExt } from "@/lib/video-metadata";

function FilePicker({ label, hint, file, onChange, accent, accept, badge }) {
  return (
    <label className="qa-glass rounded-3xl p-6 block cursor-pointer hover:shadow-lg transition group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[11px] font-bold tracking-widest ${accent}`}>{label}</p>
          <p className="text-slate-500 text-sm mt-1">{hint}</p>
        </div>
        <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap">
          {badge}
        </span>
      </div>
      <input
        type="file"
        accept={accept}
        className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      {file && (
        <p className="mt-3 text-sm text-slate-700 font-medium truncate">
          {file.name}{" "}
          <span className="text-slate-400 font-normal">
            ({(file.size / (1024 * 1024)).toFixed(1)} MB)
          </span>
        </p>
      )}
    </label>
  );
}

function mimeForExt(ext) {
  if (ext === "webm") return "video/webm";
  if (ext === "mkv") return "video/x-matroska";
  if (ext === "mov") return "video/quicktime";
  return "video/mp4";
}

export default function VideoCleanPage() {
  const ffmpegRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function ensureFfmpeg() {
    if (ffmpegRef.current?.loaded) return ffmpegRef.current;

    setProgress("Carregando FFmpeg no navegador (1ª vez pode demorar)…");
    const ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      if (message) console.debug("[ffmpeg]", message);
    });
    ffmpeg.on("progress", ({ progress: p }) => {
      if (Number.isFinite(p) && p > 0) {
        setProgress(`Processando… ${Math.min(99, Math.round(p * 100))}%`);
      }
    });

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setProgress("");

    if (!video || !isVideoFile(video)) {
      setError("Selecione um arquivo de vídeo.");
      return;
    }

    setBusy(true);
    const ext = videoFileExt(video, "mp4");
    const inputName = `input.${ext}`;
    const outputName = `out.${ext}`;
    const tempFiles = [inputName, outputName];

    try {
      const ffmpeg = await ensureFfmpeg();

      setProgress("Lendo o vídeo…");
      await ffmpeg.writeFile(inputName, await fetchFile(video));

      setProgress("Clonando streams e limpando metadados…");
      await ffmpeg.exec(stripMetadataArgs(inputName, outputName, { ext }));

      const out = await ffmpeg.readFile(outputName);
      const bytes = out instanceof Uint8Array ? out : new Uint8Array(out);
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const blob = new Blob([copy], { type: mimeForExt(ext) });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = cleanOutputName(video.name);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      for (const f of tempFiles) {
        try {
          await ffmpeg.deleteFile(f);
        } catch {
          /* ignore */
        }
      }

      setProgress("Pronto! O vídeo limpo foi baixado (processado no seu navegador).");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erro inesperado no processamento.");
      setProgress("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none -z-10 aurora-gradient" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="qa-blob qa-blob-a" />
        <div className="qa-blob qa-blob-b" />
        <div className="qa-blob qa-blob-c" />
      </div>
      <div className="fixed inset-0 pointer-events-none -z-10 aurora-grid" />

      <main className="relative min-h-screen px-5 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold tracking-widest text-indigo-500 mb-2">
              TOOL · METADATA
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Video Clean
            </h1>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Envie um <strong className="text-slate-700">vídeo</strong> e receba um clone com os
              metadados do container zerados. Sem reencode — só remux com FFmpeg.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FilePicker
              label="VÍDEO"
              hint="O arquivo original não é alterado. O download sai com título, data, GPS e encoder removidos."
              file={video}
              onChange={setVideo}
              accent="text-indigo-500"
              accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*,.mp4,.mov,.m4v,.webm,.mkv"
              badge="MP4 · MOV · WEBM · MKV"
            />

            <button
              type="submit"
              disabled={busy}
              className={`relative overflow-hidden w-full rounded-2xl px-8 py-4 text-lg font-bold text-white flex items-center justify-center gap-3 transition active:scale-[.98] ${
                busy
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 shadow-[0_18px_40px_-10px_rgba(99,102,241,.6)]"
              }`}
            >
              {!busy && <span className="qa-shine" />}
              <span className="relative z-10">{busy ? "Processando…" : "Limpar metadados"}</span>
            </button>

            {progress && (
              <p className="text-center text-sm font-medium text-indigo-600">{progress}</p>
            )}
            {error && (
              <p className="text-center text-sm font-medium text-rose-600 bg-rose-50 rounded-2xl px-4 py-3">
                {error}
              </p>
            )}
          </form>

          <div className="mt-10 qa-glass-soft rounded-3xl p-6 text-sm text-slate-500 leading-relaxed space-y-2">
            <p className="text-[11px] font-bold tracking-widest text-slate-400">COMO FUNCIONA</p>
            <p>
              1. O FFmpeg <strong className="text-slate-700">copia</strong> o vídeo e o áudio
              originais, sem recomprimir.
            </p>
            <p>
              2. Remove metadados do container: título, comentário, data de criação, encoder, GPS,
              capítulos e tags extras.
            </p>
            <p>
              3. Entrega um arquivo <strong className="text-slate-700">-clean</strong> no mesmo
              formato, pronto para download.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Tudo roda no Chrome/Edge (FFmpeg.wasm). O original permanece no seu computador.
            </p>
          </div>

          <p className="text-center mt-8">
            <a href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              ← Voltar ao site
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
