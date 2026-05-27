export type PlayerSourceType = "hls" | "embed";

export type PlayerProvider = "ophim" | "nguonc";

export interface PlayerSource {
  type: PlayerSourceType;
  provider: PlayerProvider;
  url: string;
}
