"use client";

import { useState } from "react";

function FilePicker({ label, hint, file, onChange, accent }) {
  return (
    <label className="qa-glass rounded-3xl p-6 block cursor-pointer hover:shadow-lg transition group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-[11px] font-bold tracking-widest ${accent}`}>{label}</p>
          <p className="text-slate-500 text-sm mt-1">{hint}</p>
        </div>
        <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
          MP4
        </span>
      </div>
      <input
        type="file"
        accept="video/mp4,video/*"
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

export default function AudioMergePage() {
  const [principal, setPrincipal] = useState(null);
  const [invisible, setInvisible] = useState(null);
  const [stereoWidth, setStereoWidth] = useState(2);
  const [invisibleGainDb, setInvisibleGainDb] = useState(-15);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setProgress("");

    if (!principal || !invisible) {
      setError("Selecione os dois vídeos MP4.");
      return;
    }

    setBusy(true);
    setProgress("Enviando e processando… isso pode levar alguns minutos.");

    try {
      const form = new FormData();
      form.append("principal", principal);
      form.append("invisible", invisible);
      form.append("stereoWidth", String(stereoWidth));
      form.append("invisibleGainDb", String(invisibleGainDb));

      const res = await fetch("/api/audio-merge", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        let msg = "Falha no processamento.";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const base = (principal.name || "video").replace(/\.[^.]+$/, "");
      a.href = url;
      a.download = `${base}-merged.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setProgress("Pronto! O MP4 foi baixado.");
    } catch (err) {
      setError(err?.message || "Erro inesperado.");
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
              TOOL · MID / SIDE
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Audio Merge
            </h1>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Envie <strong className="text-slate-700">dois MP4</strong>. Mantemos o vídeo e o áudio
              visível do principal; o áudio do segundo vídeo entra como camada “invisível” (anti-fase /
              some no mono).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FilePicker
              label="VÍDEO PRINCIPAL"
              hint="Mantém a imagem + áudio visível (o que a pessoa ouve no mono)."
              file={principal}
              onChange={setPrincipal}
              accent="text-indigo-500"
            />

            <FilePicker
              label="VÍDEO DO ÁUDIO INVISÍVEL"
              hint="Só usamos o áudio deste arquivo. Ele é embutido em anti-fase (cancela no mono)."
              file={invisible}
              onChange={setInvisible}
              accent="text-violet-500"
            />

            <div className="qa-glass-soft rounded-3xl p-6 grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-xs font-bold tracking-wider text-slate-500">
                  STEREO WIDTH (invisível)
                </span>
                <input
                  type="number"
                  min="0.5"
                  max="4"
                  step="0.1"
                  value={stereoWidth}
                  onChange={(e) => setStereoWidth(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-800 font-semibold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Padrão: 2.0</span>
              </label>
              <label className="block">
                <span className="text-xs font-bold tracking-wider text-slate-500">
                  GAIN DO INVISÍVEL (dB)
                </span>
                <input
                  type="number"
                  min="-40"
                  max="6"
                  step="1"
                  value={invisibleGainDb}
                  onChange={(e) => setInvisibleGainDb(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-800 font-semibold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Padrão: −15 dB</span>
              </label>
            </div>

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
              <span className="relative z-10">{busy ? "Processando…" : "Gerar MP4 final"}</span>
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
              1. Do <strong className="text-slate-700">vídeo principal</strong> extraímos o Mid
              (áudio visível) e mantemos o vídeo.
            </p>
            <p>
              2. Do <strong className="text-slate-700">segundo vídeo</strong> extraímos só o áudio e
              codificamos em L/−L (anti-fase), com width e gain configuráveis.
            </p>
            <p>
              3. Montamos L = visível + invisível e R = visível − invisível → no mono a pessoa ouve
              só o principal; o segundo cancela.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Formato de saída: MP4 (vídeo copiado + áudio AAC). Prefira arquivos não gigantes no
              deploy da Vercel (limite de upload/tempo). Localmente aguenta bem mais.
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
