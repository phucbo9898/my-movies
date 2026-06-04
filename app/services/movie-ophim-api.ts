import { fetcher } from "../lib/fetcher";
import type { Country, Episode, Movie, ServerData } from "../types/movie";
import type { Genre, MovieGenre } from "../types/genre";
import type { MovieDetail } from "../types/movie-detail";
import type { PlayerSource } from "../types/player-source";

export const OPHIM_API_BASE_URL = process.env.NEXT_PUBLIC_OPHIM_API_BASE_URL;
const OPHIM_API_PREFIX = "/v1/api";

export type MovieImages = Record<string, unknown>;
export type MoviePeoples = Record<string, unknown>;
export type MovieKeywords = string[];
export type HomeMovieGroups = Record<string, Movie[]>;

export interface SearchMoviesResult {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

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

const getDefaultImageBaseUrl = (): string => {
  const baseUrl =
    normalizeString(process.env.NEXT_PUBLIC_OPHIM_IMG_URL) ||
    "https://img.ophim.live";
  const path = normalizeString(process.env.NEXT_PUBLIC_OPHIM_PATH);

  if (!path) {
    return baseUrl.replace(/\/+$/, "");
  }

  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const normalizeImageUrl = (value: unknown, baseUrl?: string): string => {
  const rawValue = normalizeString(value);

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  const resolvedBaseUrl = normalizeString(baseUrl) || getDefaultImageBaseUrl();

  if (!resolvedBaseUrl) {
    return rawValue;
  }

  return `${resolvedBaseUrl.replace(/\/+$/, "")}/${rawValue.replace(/^\/+/, "")}`;
};

const extractImageBase = (payload: unknown): string | undefined => {
  if (isRecord(payload)) {
    const domain = normalizeString(payload.APP_DOMAIN_CDN_IMAGE);
    const value = pathImg(domain);
    if (value) {
      return value;
    }
  }

  return getDefaultImageBaseUrl();
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
    ? raw.country.filter(isRecord).map(normalizeCountry)
    : [],
  episode_current: normalizeString(raw.episode_current),
  episode_total: normalizeString(raw.episode_total),
  time: normalizeString(raw.time),
  quality: normalizeString(raw.quality),
  lang: normalizeString(raw.lang),
  view: normalizeNumber(raw.view),
  alternative_names: Array.isArray(raw.alternative_names)
    ? raw.alternative_names.filter(
        (item): item is string => typeof item === "string",
      )
    : [],
  year: normalizeNumber(raw.year),
  last_episodes: Array.isArray(raw.last_episodes)
    ? raw.last_episodes.filter(isRecord).map((episode) => ({
        server_name: normalizeString(episode.server_name),
        name: normalizeString(episode.name),
      }))
    : [],
});

const normalizeMovieGenre = (raw: TaxonomyRaw): MovieGenre => ({
  id: normalizeString(raw.id),
  name: normalizeString(raw.name),
  slug: normalizeString(raw.slug),
});

const createPlayerSource = (
  type: PlayerSource["type"],
  provider: PlayerSource["provider"],
  url: unknown,
): PlayerSource | null => {
  const normalizedUrl = normalizeString(url);

  if (!normalizedUrl) {
    return null;
  }

  return {
    type,
    provider,
    url: normalizedUrl,
  };
};

const normalizePlayerSources = (raw: OPhimMovieRaw): PlayerSource[] =>
  [
    createPlayerSource("embed", "nguonc", raw.link_embed),
    createPlayerSource("hls", "ophim", raw.link_m3u8),
  ].filter((source): source is PlayerSource => source !== null);

const normalizeServerData = (raw: OPhimMovieRaw): ServerData => ({
  name: normalizeString(raw.name),
  slug: normalizeString(raw.slug),
  filename: normalizeString(raw.filename),
  link_embed: normalizeString(raw.link_embed),
  link_m3u8: normalizeString(raw.link_m3u8),
  sources: normalizePlayerSources(raw),
});

const normalizeEpisode = (raw: OPhimMovieRaw): Episode => ({
  server_name: normalizeString(raw.server_name),
  slug: normalizeString(raw.slug),
  server_data: Array.isArray(raw.server_data)
    ? raw.server_data.filter(isRecord).map(normalizeServerData)
    : [],
});

const normalizeMovieDetail = (
  raw: OPhimMovieRaw,
  imageBaseUrl?: string,
): MovieDetail => ({
  ...normalizeMovie(raw, imageBaseUrl),
  category: Array.isArray(raw.category)
    ? raw.category.filter(isRecord).map(normalizeMovieGenre)
    : [],
  episodes: Array.isArray(raw.episodes)
    ? raw.episodes.filter(isRecord).map(normalizeEpisode)
    : [],
  trailer_url: normalizeString(
    raw.trailer_url ?? raw.trailerUrl ?? raw.trailer,
  ),
});

const extractMoviePayload = (payload: unknown): OPhimMovieRaw | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const data = isRecord(payload.data) ? payload.data : null;
  const movieRaw =
    (isRecord(data?.item) ? data.item : null) ??
    (isRecord(payload.movie) ? payload.movie : null) ??
    data ??
    payload;

  return isRecord(movieRaw) ? movieRaw : null;
};

const buildUrl = (path: string): string =>
  `${OPHIM_API_BASE_URL}${OPHIM_API_PREFIX}${path}`;

const pathImg = (domain: string): string | undefined => {
  const normalizedDomain = normalizeString(domain).trim();
  if (!normalizedDomain) {
    return undefined;
  }

  const path = normalizeString(process.env.NEXT_PUBLIC_OPHIM_PATH);
  if (!path) {
    return normalizedDomain.replace(/\/+$/, "");
  }

  return `${normalizedDomain.replace(/\/+$/, "")}/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
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
        console.log(1);
        return result;
      }

      if (isRecord(value)) {
        const items = extractItems(value);
        if (items.length > 0) {
          const imageBaseUrl = extractImageBase(value) ?? parentBaseUrl;
          result[key] = normalizeMovies(items, imageBaseUrl);
          console.log(2);
        }
      }

      return result;
    },
    {},
  );
};

const getSearchPagination = (payload: unknown) => {
  if (!isRecord(payload)) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    };
  }

  const data = isRecord(payload.data) ? payload.data : null;
  const params = isRecord(data?.params) ? data.params : null;
  const pagination = isRecord(params?.pagination) ? params.pagination : null;

  const totalItems = normalizeNumber(pagination?.totalItems);
  const itemsPerPage = Math.max(
    1,
    normalizeNumber(pagination?.totalItemsPerPage) || 10,
  );
  const currentPage = Math.max(
    1,
    normalizeNumber(pagination?.currentPage) || 1,
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
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
  limit = 5,
): Promise<Movie[]> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return [];
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : 0;

  if (normalizedLimit > 0) {
    return fetchMovies(
      `/danh-sach/${encodeURIComponent(normalizedSlug)}?limit=${normalizedLimit}`,
    );
  }

  return fetchMovies(
    `/danh-sach/${encodeURIComponent(normalizedSlug)}?page=${normalizedPage}`,
  );
};

export const searchMovies = async (
  keyword: string,
  page = 1,
): Promise<SearchMoviesResult> => {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return {
      movies: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    };
  }

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const payload = await fetcher<unknown>(
    buildUrl(
      `/tim-kiem?keyword=${encodeURIComponent(trimmed)}&page=${normalizedPage}`,
    ),
  );

  const imageBaseUrl = extractImageBase(payload);
  const movies = extractItems(payload).map((item) =>
    normalizeMovie(item, imageBaseUrl),
  );
  console.log('movie', movies);
  const pagination = getSearchPagination(payload);

  return {
    movies,
    ...pagination,
  };
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

  const movieRaw = extractMoviePayload(payload);
  if (!movieRaw) {
    return null;
  }

  const imageBaseUrl = extractImageBase(payload);
  return normalizeMovie(movieRaw, imageBaseUrl);
};

export const getMovieDetail = async (
  slug: string,
): Promise<MovieDetail | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const payload = await fetcher<unknown>(
    buildUrl(`/phim/${encodeURIComponent(normalizedSlug)}`),
  );

  const movieRaw = extractMoviePayload(payload);
  if (!movieRaw) {
    return null;
  }

  const imageBaseUrl = extractImageBase(payload);
  return normalizeMovieDetail(movieRaw, imageBaseUrl);
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
