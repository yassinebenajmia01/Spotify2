import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
  const { supabaseClient } = useSessionContext();
  const [song, setSong] = useState<Song | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        // ✅ Transform song_path into a public URL
        const {
          data: { publicUrl },
        } = supabaseClient.storage
          .from("songs")
          .getPublicUrl(data.song_path);

        setSong({
          ...data,
          song_path: publicUrl,
        } as Song);
      }

      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(() => ({ song, isLoading }), [song, isLoading]);
};

export default useGetSongById;
