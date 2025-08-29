import { assets } from "@/assets/assets";
import Image from "next/image";

interface ChatLabelProps {
  openMenu: { id: string | null; open: boolean };
  setOpenMenu: (openMenu: { id: string | null; open: boolean }) => void;
  chatId: string;
}

export default function ChatLabel({ openMenu, setOpenMenu, chatId }: ChatLabelProps) {
  const toggleMenu = () => {
    if (openMenu.open && openMenu.id === chatId) {
      setOpenMenu({ id: null, open: false });
    } else {
      setOpenMenu({ id: chatId, open: true });
    }
  };

  return (
    <div className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer relative">
      <p className="truncate group-hover:max-w-5/6">Chat Name here!</p>

      {/* Dots button */}
      <div
        onClick={toggleMenu}
        className="flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
      >
        <Image src={assets.three_dots} alt="" className={`w-4 ${openMenu.open?"hidden":"group-hover:blocks"}`}/>
      </div>

      {/* Dropdown Menu */}
      {openMenu.open && openMenu.id === chatId && (
        <div className="absolute right-0 top-8 w-40 rounded-xl bg-gray-700 p-2 shadow-lg z-50">
          <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
            <Image src={assets.pencil_icon} alt="rename" />
            <p>Rename</p>
          </div>
          <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
            <Image src={assets.delete_icon} alt="delete" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      )}
    </div>
  );
}
