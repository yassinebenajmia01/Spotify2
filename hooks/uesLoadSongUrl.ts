import { Song } from "@/types";

const useLoadSongUrl = (song: Song | undefined): string => {
  if (!song) return "";

  // ✅ song.song_path is already a public URL now
  return song.song_path;
};

export default useLoadSongUrl;
