import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay = (id: string) => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    if (!songs || songs.length === 0) return;

    player.setIds(songs.map((s) => s.id));
    player.setId(id);
  };

  return onPlay;
};

export default useOnPlay;
