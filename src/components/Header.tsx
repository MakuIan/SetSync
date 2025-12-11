import { Activity, LogOut } from "lucide-react";
import { THEME } from "../utils/constants";
import type { User } from "firebase/auth";

const Header = ({
  user,
  handleLogout,
}: {
  user: User;
  handleLogout: () => void;
}) => (
  <header className="bg-slate-900/80 backdrop-blur-md border-slate-800 p-4 sticky top-0 z-20">
    <div className="max-w-md mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Activity className={`h-5 w-5 ${THEME.colors.primary}`} />
        <h1 className="font-bold tracking-tight"> SetSync </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate500 font-mono hidden sm:block">
          {user.isAnonymous
            ? "Guest"
            : user.displayName?.split(" ")[0] || "User"}
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
);

export default Header;
