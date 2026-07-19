import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage.js";

const AudioPlayerContext = createContext(null);

/** localStorage key for the optional listening-progress stretch goal. */
const PROGRESS_KEY = "podcastExplorer:progress";

/**
 * Build the composite id used to key an episode across favourites and
 * listening progress: unique per show + season + episode.
 *
 * @param {{ showId: string|number, seasonNumber: number, episodeNumber: number }} ref
 * @returns {string}
 */
export function buildEpisodeId({ showId, seasonNumber, episodeNumber }) {
  return `${showId}-${seasonNumber}-${episodeNumber}`;
}

/**
 * Provides a single, app-wide `<audio>` element and its controls.
 *
 * Because this provider (and the `<audio>` element it owns) is mounted
 * once in `App.jsx`, outside of `<Routes>`, navigating between pages never
 * unmounts it — so playback naturally continues uninterrupted as the user
 * moves around the app. This is the mechanism behind the "keep playing
 * across pages" and "player fixed at the bottom on every page" user
 * stories; no manual state hand-off between pages is required.
 *
 * Also owns the stretch-goal listening-progress store (per-episode saved
 * position + "finished" flag), and a `beforeunload` guard that prompts the
 * user for confirmation if they try to close/reload the tab mid-playback.
 *
 * @param {{ children: import("react").ReactNode }} props
 * @returns {JSX.Element}
 */
export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [episode, setEpisode] = useState(null); // { ...episodeRef, title, file, image, showTitle, seasonTitle }
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const [progress, setProgress] = useState(() => readStorage(PROGRESS_KEY, {}));

  useEffect(() => {
    writeStorage(PROGRESS_KEY, progress);
  }, [progress]);

  // Confirmation prompt on reload/close while audio is actively playing.
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isPlaying) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  /**
   * Start playing a given episode. If it's already the loaded episode,
   * this just resumes/toggles instead of restarting from zero.
   *
   * @param {Object} episodeRef - Episode plus the show/season context needed to display and key it.
   */
  const playEpisode = useCallback(
    (episodeRef) => {
      const id = buildEpisodeId(episodeRef);
      const audio = audioRef.current;
      if (!audio) return;

      setError(null);

      if (episode?.id === id) {
        audio.play().catch(() => setError("Playback couldn't start."));
        return;
      }

      // Resume from saved progress, if any, once metadata has loaded.
      const savedPosition = progress[id]?.position ?? 0;
      audioRef.current.dataset.resumeTo = String(savedPosition);

      setEpisode({ ...episodeRef, id });
    },
    [episode, progress]
  );

  // Whenever the selected episode changes, (re)load the new source.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !episode) return;

    audio.src = episode.file;
    const resumeTo = Number(audio.dataset.resumeTo || 0);
    audio.currentTime = Number.isFinite(resumeTo) ? resumeTo : 0;
    audio.play().catch(() => setError("This episode's audio couldn't be loaded."));
  }, [episode]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !episode) return;
    if (audio.paused) {
      audio.play().catch(() => setError("Playback couldn't start."));
    } else {
      audio.pause();
    }
  }, [episode]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  /** Marks the current episode's saved progress as reset (stretch goal). */
  const resetProgress = useCallback(() => {
    setProgress({});
  }, []);

  // Wire native <audio> events to React state + persisted progress.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (episode) {
        const id = episode.id;
        setProgress((prev) => ({
          ...prev,
          [id]: {
            position: audio.currentTime,
            duration: audio.duration || prev[id]?.duration || 0,
            finished: prev[id]?.finished ?? false,
          },
        }));
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (episode) {
        const id = episode.id;
        setProgress((prev) => ({
          ...prev,
          [id]: { position: 0, duration: prev[id]?.duration || 0, finished: true },
        }));
      }
    };
    const handleError = () => setError("This episode's audio couldn't be loaded.");

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [episode]);

  const value = useMemo(
    () => ({
      audioRef,
      episode,
      isPlaying,
      currentTime,
      duration,
      error,
      progress,
      playEpisode,
      togglePlay,
      seek,
      resetProgress,
    }),
    [episode, isPlaying, currentTime, duration, error, progress, playEpisode, togglePlay, seek, resetProgress]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {/* Single, app-wide audio element — see the module doc comment above. */}
      <audio ref={audioRef} preload="metadata" />
    </AudioPlayerContext.Provider>
  );
}

/**
 * Access the global audio player's state and controls.
 *
 * @returns {ReturnType<typeof useState> & Object} Player context value.
 */
export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
