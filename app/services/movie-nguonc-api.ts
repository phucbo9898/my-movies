import { fetcher } from "../lib/fetcher";
import type { Episode, ServerData } from "../types/movie";
import type { PlayerSource } from "../types/player-source";

const NGUONC_API_PREFIX = "/film";

type NguonCRaw = Record<string, unknown>;
type NguonCEpisodeGroupRaw = Record<string, unknown>;
type NguonCEpisodeItemRaw = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeString = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  return "";
};

const NGUONC_API_BASE_URL =
  normalizeString(process.env.NEXT_PUBLIC_NGUONC_API_BASE_URL) ||
  "https://phim.nguonc.com/api";

const buildNguonCUrl = (slug: string): string => {
  const normalizedSlug = slug.trim();
  return (
    NGUONC_API_BASE_URL.replace(/\/+$/u, "") +
    NGUONC_API_PREFIX +
    "/" +
    encodeURIComponent(normalizedSlug)
  );
};

const createPlayerSource = (url: unknown): PlayerSource | null => {
  const normalizedUrl = normalizeString(url);
  if (!normalizedUrl) {
    return null;
  }

  return {
    type: "embed",
    provider: "nguonc",
    url: normalizedUrl,
  };
};

const normalizeServerData = (raw: NguonCEpisodeItemRaw): ServerData => {
  const name =
    normalizeString(raw.name) || normalizeString(raw.slug) || "NguonC";
  const slug = normalizeString(raw.slug) || name;
  const linkEmbed = normalizeString(raw.embed);
  const linkM3u8 = normalizeString(raw.m3u8);

  return {
    name,
    slug,
    filename: name,
    link_embed: linkEmbed,
    link_m3u8: linkM3u8,
    sources: [createPlayerSource(linkEmbed)].filter(
      (source): source is PlayerSource => source !== null,
    ),
  };
};

const normalizeEpisodeGroup = (raw: NguonCEpisodeGroupRaw): Episode => ({
  server_name:
    normalizeString(raw.server_name) ||
    normalizeString(raw.serverName) ||
    "NguonC",
  slug:
    normalizeString(raw.slug) ||
    normalizeString(raw.server_name) ||
    normalizeString(raw.serverName) ||
    "",
  server_data: Array.isArray(raw.items)
    ? raw.items
        .filter(isRecord)
        .map(normalizeServerData)
        .filter((server) => server.sources.length > 0)
    : [],
});

const extractMoviePayload = (payload: unknown): NguonCRaw | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const data = payload.data;
  const dataRecord = isRecord(data) ? data : undefined;
  const movie =
    (isRecord(payload.movie) ? payload.movie : null) ??
    (isRecord(dataRecord?.movie) ? dataRecord.movie : null) ??
    dataRecord ??
    payload;

  return isRecord(movie) ? movie : null;
};

const extractEpisodeGroups = (payload: unknown): NguonCEpisodeGroupRaw[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const data = payload.data;
  const candidate =
    payload.episodes ??
    (isRecord(payload.movie) ? payload.movie.episodes : undefined) ??
    payload.items ??
    (isRecord(data) ? data.episodes : undefined);

  if (Array.isArray(candidate)) {
    return candidate.filter(isRecord);
  }

  return [];
};

export const getNguonCEpisodes = async (slug: string): Promise<Episode[]> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return [];
  }

  const payload = await fetcher<unknown>(buildNguonCUrl(normalizedSlug));
  const movieRaw = extractMoviePayload(payload);
  if (!movieRaw) {
    return [];
  }

  return extractEpisodeGroups(movieRaw)
    .map(normalizeEpisodeGroup)
    .filter((episode) => episode.server_data.length > 0);
};
