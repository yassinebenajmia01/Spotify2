import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (song?: Song): string => {
  const supabaseClient = useSupabaseClient();

  if (!song || !song.image_path) {
    // Fallback if no image_path
    return "/images/liked.png";
  }

  const { data } = supabaseClient.storage
    .from("images")
    .getPublicUrl(song.image_path);

  // Return public URL or fallback
  return data?.publicUrl || "/images/liked.png";
};

export default useLoadImage;
