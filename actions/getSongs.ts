import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  // ✅ Convert song_path to a public URL
  const mapped = data.map((song: any) => ({
    ...song,
    song_path: `https://rgyprufabmyurlbtzrbq.supabase.co/storage/v1/object/public/${song.song_path}`,
  }));

  return mapped as Song[];
};

export default getSongs;
