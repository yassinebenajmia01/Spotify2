import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
  const cookieStore = cookies(); // must call function
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return [];

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  // ✅ Map song_path into a public URL
  const mapped = data.map((song: any) => ({
    ...song,
    song_path: `https://rgyprufabmyurlbtzrbq.supabase.co/storage/v1/object/public/${song.song_path}`,
  }));

  return mapped as Song[];
};

export default getSongsByUserId;
