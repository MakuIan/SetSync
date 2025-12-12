import { ChevronLeft } from "lucide-react";
import type { SessionData } from "../types";

const Header = ({
  setActiveSessionId,
  activeSession,
}: {
  setActiveSessionId: (sessionId: string | null) => void;
  activeSession: SessionData | undefined;
}) => (
  <header className="bg-slate-900/80 backdrop-blur-md border-slate-800 p-4 sticky top-0 z-20">
    <div className="max-w-md mx-auto flex justify-between items-center gap-3">
      <button
        title="Return to Session List"
        onClick={() => setActiveSessionId(null)}
        className="p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h1 className="font-bold tracking-tight text-lg truncate">
        {activeSession?.name}
      </h1>
    </div>
  </header>
);

export default Header;
