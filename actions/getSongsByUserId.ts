import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async () => {
  const cookieStore = cookies(); // must call function
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return [];
  const { data } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session.user.id)
    .order("created_at", { ascending: false });

  return (data as any) || [];
};

export default getSongsByUserId;
