/**
 * Mid/Side WAV helpers — Node + browser (Uint8Array / DataView).
 * Lógica alinhada ao processStereoWide / replaceMonoKeepStereo.
 */

function asBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input?.buffer) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  throw new Error("Buffer de áudio inválido.");
}

function readAscii(bytes, start, end) {
  let s = "";
  for (let i = start; i < end; i++) s += String.fromCharCode(bytes[i]);
  return s;
}

function readU16(view, offset) {
  return view.getUint16(offset, true);
}

function readU32(view, offset) {
  return view.getUint32(offset, true);
}

function readI16(view, offset) {
  return view.getInt16(offset, true);
}

function writeI16(view, offset, value) {
  view.setInt16(offset, value, true);
}

export function parseWavHeader(input) {
  const bytes = asBytes(input);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (readAscii(bytes, 0, 4) !== "RIFF" || readAscii(bytes, 8, 12) !== "WAVE") {
    throw new Error("Arquivo WAV inválido.");
  }

  let offset = 12;
  let fmt = null;
  let dataOffset = null;
  let dataSize = null;

  while (offset + 8 <= bytes.length) {
    const id = readAscii(bytes, offset, offset + 4);
    const size = readU32(view, offset + 4);
    const chunkStart = offset + 8;

    if (id === "fmt ") {
      fmt = {
        audioFormat: readU16(view, chunkStart),
        numChannels: readU16(view, chunkStart + 2),
        sampleRate: readU32(view, chunkStart + 4),
        byteRate: readU32(view, chunkStart + 8),
        blockAlign: readU16(view, chunkStart + 12),
        bitsPerSample: readU16(view, chunkStart + 14),
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

function midSample(left, right) {
  const rightInverted = -right;
  return (left - rightInverted) / 2;
}

/**
 * Combina Mid do vídeo A (visível) + Mid do B em anti-fase (invisível no mono).
 */
export function mergeVisibleMonoInvisibleSide(videoAWav, videoBWav, options = {}) {
  const width = options.stereoWidth ?? 2.0;
  const gainBDb = options.invisibleGainDb ?? -15;
  const gainB = Math.pow(10, gainBDb / 20);

  const bytesA = asBytes(videoAWav);
  const bytesB = asBytes(videoBWav);
  const viewA = new DataView(bytesA.buffer, bytesA.byteOffset, bytesA.byteLength);
  const viewB = new DataView(bytesB.buffer, bytesB.byteOffset, bytesB.byteLength);

  const headerA = parseWavHeader(bytesA);
  const headerB = parseWavHeader(bytesB);

  if (headerA.numChannels !== 2) {
    throw new Error("O vídeo principal precisa ter áudio estéreo.");
  }
  if (headerB.numChannels < 1) {
    throw new Error("O segundo vídeo precisa ter áudio.");
  }

  const bytesPerSample = headerA.bitsPerSample / 8;
  const samplesA = Math.floor(
    (bytesA.length - headerA.dataOffset) / (bytesPerSample * headerA.numChannels)
  );
  const channelsB = headerB.numChannels;
  const samplesB = Math.floor(
    (bytesB.length - headerB.dataOffset) / (bytesPerSample * channelsB)
  );

  const out = new Uint8Array(bytesA.length);
  out.set(bytesA.subarray(0, headerA.dataOffset));
  const outView = new DataView(out.buffer, out.byteOffset, out.byteLength);

  for (let i = 0; i < samplesA; i++) {
    const offA = headerA.dataOffset + i * bytesPerSample * 2;
    const leftA = readI16(viewA, offA);
    const rightA = readI16(viewA, offA + bytesPerSample);
    const midA = midSample(leftA, rightA);

    const iB = Math.min(i, Math.max(samplesB - 1, 0));
    let midB = 0;
    if (samplesB > 0) {
      if (channelsB === 1) {
        midB = readI16(viewB, headerB.dataOffset + iB * bytesPerSample);
      } else {
        const offB = headerB.dataOffset + iB * bytesPerSample * 2;
        const leftB = readI16(viewB, offB);
        const rightB = readI16(viewB, offB + bytesPerSample);
        midB = midSample(leftB, rightB);
      }
    }

    const side = midB * width * gainB;
    writeI16(outView, offA, clamp16(midA + side));
    writeI16(outView, offA + bytesPerSample, clamp16(midA - side));
  }

  return out;
}
