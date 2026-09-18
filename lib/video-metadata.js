const EMPTY_TAGS = [
  "title",
  "comment",
  "description",
  "synopsis",
  "artist",
  "album",
  "album_artist",
  "composer",
  "genre",
  "date",
  "year",
  "creation_time",
  "encoder",
  "encoded_by",
  "handler_name",
  "copyright",
  "publisher",
  "language",
  "location",
  "location-eng",
  "make",
  "model",
  "software",
];

function isFaststartContainer(ext) {
  return /^(mp4|m4v|mov|m4a)$/i.test(ext || "");
}

/**
 * Args do ffmpeg para clonar streams e zerar metadados do container.
 * Sem reencode: -c copy.
 */
export function stripMetadataArgs(inputName, outputName, options = {}) {
  const ext = options.ext || (outputName.match(/\.([a-z0-9]+)$/i)?.[1] || "mp4");
  const args = [
    "-hide_banner",
    "-i",
    inputName,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-map_metadata",
    "-1",
    "-map_chapters",
    "-1",
    "-c",
    "copy",
    "-fflags",
    "+bitexact",
  ];

  for (const tag of EMPTY_TAGS) {
    args.push("-metadata", `${tag}=`);
  }

  for (const spec of ["s:v:0", "s:a:0"]) {
    args.push(
      `-metadata:${spec}`,
      "handler_name=",
      `-metadata:${spec}`,
      "encoder=",
      `-metadata:${spec}`,
      "creation_time="
    );
  }

  if (options.faststart ?? isFaststartContainer(ext)) {
    args.push("-movflags", "+faststart");
  }

  args.push(outputName);
  return args;
}

export function videoFileExt(file, fallback = "mp4") {
  const match = (file?.name || "").match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : fallback;
}

export function isVideoFile(file) {
  if (!file) return false;
  if (file.type?.startsWith("video/")) return true;
  return /\.(mp4|m4v|mov|webm|mkv|avi)$/i.test(file.name || "");
}

export function cleanOutputName(originalName) {
  const ext = videoFileExt({ name: originalName }, "mp4");
  const base = (originalName || "video").replace(/\.[^.]+$/, "").replace(/[^\w\-]+/g, "_") || "video";
  return `${base}-clean.${ext}`;
}
