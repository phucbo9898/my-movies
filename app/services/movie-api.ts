import { fetcher } from "../lib/fetcher";
import type { Country, Movie } from "../types/movie";
import type { Genre } from "../types/genre";

export const OPHIM_API_BASE_URL = process.env.NEXT_PUBLIC_OPHIM_API_BASE_URL;
const OPHIM_API_PREFIX = "/v1/api";

export type MovieImages = Record<string, unknown>;
export type MoviePeoples = Record<string, unknown>;
export type MovieKeywords = string[];
export type HomeMovieGroups = Record<string, Movie[]>;

type OPhimMovieRaw = Record<string, unknown>;
type TaxonomyRaw = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeString = (value: unknown): string =>
  typeof value === "string" ? value : value == null ? "" : String(value);

const normalizeNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeImageUrl = (value: unknown, baseUrl?: string): string => {
  const rawValue = normalizeString(value);
  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  if (!baseUrl) {
    return rawValue;
  }

  return `${baseUrl.replace(/\/+$/, "")}/${rawValue.replace(/^\/+/, "")}`;
};

const extractImageBase = (payload: unknown): string | undefined => {
  if (!isRecord(payload)) {
    return undefined;
  }

  const value = pathImg(normalizeString(payload.APP_DOMAIN_CDN_IMAGE));

  return value || undefined;
};

const normalizeTaxonomy = (raw: TaxonomyRaw): Genre | Country => ({
  _id: normalizeString(raw._id),
  name: normalizeString(raw.name),
  slug: normalizeString(raw.slug),
});

const normalizeGenre = (raw: TaxonomyRaw): Genre =>
  normalizeTaxonomy(raw) as Genre;

const normalizeCountry = (raw: TaxonomyRaw): Country =>
  normalizeTaxonomy(raw) as Country;

const normalizeMovie = (raw: OPhimMovieRaw, imageBaseUrl?: string): Movie => ({
  _id: normalizeString(raw._id),
  name: normalizeString(raw.name),
  origin_name: normalizeString(raw.origin_name),
  slug: normalizeString(raw.slug),
  poster_url: normalizeImageUrl(raw.poster_url ?? raw.thumbnail, imageBaseUrl),
  thumb_url: normalizeImageUrl(
    raw.thumb_url ?? raw.poster_url ?? raw.thumbnail,
    imageBaseUrl,
  ),
  content: normalizeString(raw.content),
  type: normalizeString(raw.type),
  status: normalizeString(raw.status),
  actor: normalizeStringArray(raw.actor),
  director: normalizeStringArray(raw.director),
  category: Array.isArray(raw.category)
    ? raw.category.filter(isRecord).map(normalizeTaxonomy)
    : [],
  country: Array.isArray(raw.country)
    ? raw.country.filter(isRecord).map(normalizeTaxonomy)
    : [],
  episode_current: normalizeString(raw.episode_current),
  episode_total: normalizeString(raw.episode_total),
  time: normalizeString(raw.time),
  quality: normalizeString(raw.quality),
  lang: normalizeString(raw.lang),
  view: normalizeNumber(raw.view),
  alternative_names: Array.isArray(raw.alternative_names)
    ? raw.alternative_names
        .filter((item): item is string => typeof item === "string")
    : [],
  year: normalizeNumber(raw.year),
});

const buildUrl = (path: string): string =>
  `${OPHIM_API_BASE_URL}${OPHIM_API_PREFIX}${path}`;

const pathImg = (domain: string): string => {
  const path = process.env.NEXT_PUBLIC_OPHIM_PATH || "";
  return `${domain.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

const extractItems = (payload: unknown): OPhimMovieRaw[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidate =
    payload.data ??
    payload.items ??
    payload.results ??
    payload.movies ??
    payload.films;

  if (Array.isArray(candidate)) {
    return candidate.filter(isRecord);
  }

  return extractItems(candidate);
};

const extractStrings = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeString).filter(Boolean);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidate =
    payload.data ??
    payload.items ??
    payload.results ??
    payload.years ??
    payload.list;

  return extractStrings(candidate);
};

const normalizeHomeGroups = (payload: unknown): HomeMovieGroups => {
  if (!isRecord(payload)) {
    return {};
  }

  const parentBaseUrl = extractImageBase(payload);

  return Object.entries(payload).reduce<HomeMovieGroups>(
    (result, [key, value]) => {
      if (key === "APP_DOMAIN_CDN_IMAGE") {
        return result;
      }

      if (Array.isArray(value)) {
        result[key] = normalizeMovies(value, parentBaseUrl);
        return result;
      }

      if (isRecord(value)) {
        const items = extractItems(value);
        if (items.length > 0) {
          const imageBaseUrl = extractImageBase(value) ?? parentBaseUrl;
          result[key] = normalizeMovies(items, imageBaseUrl);
        }
      }

      return result;
    },
    {},
  );
};

const fetchMovies = async (path: string): Promise<Movie[]> => {
  const payload = await fetcher<unknown>(buildUrl(path));
  const imageBaseUrl = extractImageBase(payload);
  return extractItems(payload).map((item) =>
    normalizeMovie(item, imageBaseUrl),
  );
};

const fetchTaxonomyList = async <T>(
  path: string,
  normalizer: (raw: TaxonomyRaw) => T,
): Promise<T[]> => {
  const payload = await fetcher<unknown>(buildUrl(path));
  return extractItems(payload).map(normalizer);
};

export const getHomeMovies = async (): Promise<HomeMovieGroups> => {
  const payload = await fetcher<unknown>(buildUrl("/home"));
  return normalizeHomeGroups(payload);
};

export const getListingMovies = async (
  slug: string,
  page = 1,
): Promise<Movie[]> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return [];
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  return fetchMovies(
    `/danh-sach/${encodeURIComponent(normalizedSlug)}?page=${normalizedPage}`,
  );
};

export const searchMovies = async (
  keyword: string,
  page = 1,
): Promise<Movie[]> => {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return [];
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  return fetchMovies(
    `/tim-kiem?keyword=${encodeURIComponent(trimmed)}&page=${normalizedPage}`,
  );
};

export const getGenres = async (): Promise<Genre[]> =>
  fetchTaxonomyList("/the-loai", normalizeGenre);

export const getMoviesByGenre = async (
  slug: string,
  page = 1,
): Promise<Movie[]> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return [];
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  return fetchMovies(
    `/the-loai/${encodeURIComponent(normalizedSlug)}?page=${normalizedPage}`,
  );
};

export const getCountries = async (): Promise<Country[]> =>
  fetchTaxonomyList("/quoc-gia", normalizeCountry);

export const getMoviesByCountry = async (
  slug: string,
  page = 1,
): Promise<Movie[]> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return [];
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  return fetchMovies(
    `/quoc-gia/${encodeURIComponent(normalizedSlug)}?page=${normalizedPage}`,
  );
};

export const getReleaseYears = async (): Promise<string[]> => {
  const payload = await fetcher<unknown>(buildUrl("/nam-phat-hanh"));
  return extractStrings(payload);
};

export const getMoviesByYear = async (
  year: string | number,
  page = 1,
): Promise<Movie[]> => {
  const normalizedYear = normalizeString(year).trim();
  if (!normalizedYear) {
    return [];
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  return fetchMovies(
    `/nam-phat-hanh/${encodeURIComponent(normalizedYear)}?page=${normalizedPage}`,
  );
};

export const getMovieBySlug = async (slug: string): Promise<Movie | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const payload = await fetcher<unknown>(
    buildUrl(`/phim/${encodeURIComponent(normalizedSlug)}`),
  );

  if (!isRecord(payload)) {
    return null;
  }

  const movieRaw =
    (isRecord(payload.data) ? payload.data : null) ??
    (isRecord(payload.movie) ? payload.movie : null) ??
    payload;

  return isRecord(movieRaw) ? normalizeMovie(movieRaw) : null;
};

export const getMovieImages = async (
  slug: string,
): Promise<MovieImages | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const payload = await fetcher<unknown>(
    buildUrl(`/phim/${encodeURIComponent(normalizedSlug)}/images`),
  );

  return isRecord(payload) ? payload : null;
};

export const getMoviePeoples = async (
  slug: string,
): Promise<MoviePeoples | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const payload = await fetcher<unknown>(
    buildUrl(`/phim/${encodeURIComponent(normalizedSlug)}/peoples`),
  );

  return isRecord(payload) ? payload : null;
};

export const getMovieKeywords = async (
  slug: string,
): Promise<MovieKeywords> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return [];
  }

  const payload = await fetcher<unknown>(
    buildUrl(`/phim/${encodeURIComponent(normalizedSlug)}/keywords`),
  );

  return extractStrings(payload);
};

export const normalizeMovies = (
  items: unknown[],
  imageBaseUrl?: string,
): Movie[] =>
  items.filter(isRecord).map((item) => normalizeMovie(item, imageBaseUrl));
