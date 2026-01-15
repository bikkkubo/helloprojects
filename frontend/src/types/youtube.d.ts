// YouTube IFrame API の型定義
export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  destroy: () => void;
  addEventListener: (event: string, listener: (e: YTStateChangeEvent) => void) => void;
}

export interface YTStateChangeEvent {
  data: number;
  target: YTPlayer;
}

export interface YTPlayerOptions {
  videoId: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: YTStateChangeEvent) => void;
  };
}

export interface YTAPI {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT: YTAPI;
    onYouTubeIframeAPIReady: () => void;
  }
}
