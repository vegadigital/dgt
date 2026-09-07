/**
 * Mid/Side WAV helpers — lógica alinhada ao processStereoWide / replaceMonoKeepStereo.
 */

export function parseWavHeader(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("Arquivo WAV inválido.");
  }

  let offset = 12;
  let fmt = null;
  let dataOffset = null;
  let dataSize = null;

  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;

    if (id === "fmt ") {
      fmt = {
        audioFormat: buffer.readUInt16LE(chunkStart),
        numChannels: buffer.readUInt16LE(chunkStart + 2),
        sampleRate: buffer.readUInt32LE(chunkStart + 4),
        byteRate: buffer.readUInt32LE(chunkStart + 8),
        blockAlign: buffer.readUInt16LE(chunkStart + 12),
        bitsPerSample: buffer.readUInt16LE(chunkStart + 14),
      };
    } else if (id === "data") {
      dataOffset = chunkStart;
      dataSize = size;
      break;
    }

    offset = chunkStart + size + (size % 2);
  }

  if (!fmt || dataOffset == null) {
    throw new Error("WAV sem chunk fmt/data.");
  }
  if (fmt.audioFormat !== 1 || fmt.bitsPerSample !== 16) {
    throw new Error("Só é suportado PCM 16-bit.");
  }

  return { ...fmt, dataOffset, dataSize };
}

function clamp16(n) {
  return Math.max(-32768, Math.min(32767, Math.round(n)));
}

/** Extrai o "conteúdo" Mid do estéreo: (L + R) / 2 — via fórmula do processStereoWide. */
function midSample(left, right) {
  const rightInverted = -right;
  return (left - rightInverted) / 2; // = (L + R) / 2
}

/**
 * Combina:
 * - Áudio VISÍVEL  = Mid do vídeo principal (A)
 * - Áudio INVISÍVEL = Mid do 2º vídeo (B), codificado em anti-fase (some no mono)
 *
 * L = midA + midB * width * gainB
 * R = midA - midB * width * gainB
 * → mono downmix = midA (visível); B cancela em mono.
 */
export function mergeVisibleMonoInvisibleSide(videoAWav, videoBWav, options = {}) {
  const width = options.stereoWidth ?? 2.0;
  const gainBDb = options.invisibleGainDb ?? -15;
  const gainB = Math.pow(10, gainBDb / 20);

  const headerA = parseWavHeader(videoAWav);
  const headerB = parseWavHeader(videoBWav);

  if (headerA.numChannels !== 2) {
    throw new Error("O vídeo principal precisa ter áudio estéreo.");
  }
  if (headerB.numChannels < 1) {
    throw new Error("O segundo vídeo precisa ter áudio.");
  }

  const bytesPerSample = headerA.bitsPerSample / 8;
  const dataA = videoAWav.subarray(headerA.dataOffset);
  const dataB = videoBWav.subarray(headerB.dataOffset);

  const samplesA = Math.floor(dataA.length / (bytesPerSample * headerA.numChannels));
  const channelsB = headerB.numChannels;
  const samplesB = Math.floor(dataB.length / (bytesPerSample * channelsB));

  const out = Buffer.alloc(samplesA * bytesPerSample * 2);

  for (let i = 0; i < samplesA; i++) {
    const offA = i * bytesPerSample * 2;
    const leftA = dataA.readInt16LE(offA);
    const rightA = dataA.readInt16LE(offA + bytesPerSample);
    const midA = midSample(leftA, rightA);

    const iB = Math.min(i, Math.max(samplesB - 1, 0));
    let midB = 0;
    if (samplesB > 0) {
      if (channelsB === 1) {
        midB = dataB.readInt16LE(iB * bytesPerSample);
      } else {
        const offB = iB * bytesPerSample * 2;
        const leftB = dataB.readInt16LE(offB);
        const rightB = dataB.readInt16LE(offB + bytesPerSample);
        midB = midSample(leftB, rightB);
      }
    }

    const side = midB * width * gainB;
    const finalLeft = clamp16(midA + side);
    const finalRight = clamp16(midA - side);

    out.writeInt16LE(finalLeft, offA);
    out.writeInt16LE(finalRight, offA + bytesPerSample);
  }

  return Buffer.concat([videoAWav.subarray(0, headerA.dataOffset), out]);
}
