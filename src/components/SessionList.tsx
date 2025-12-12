import { Activity, LogOut } from "lucide-react";
import { THEME } from "../utils/constants";
import CreateNewSessions from "./CreateNewSessions";
import type { SessionData } from "../types";
import SessionsList from "./SessionsList";

const SessionList = ({
  handleLogout,
  isCreating,
  setIsCreating,
  newSessionName,
  setNewSessionName,
  handleCreateSession,
  handleDeleteSession,
  setActiveSessionId,
  sessions,
}: {
  handleLogout: () => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  newSessionName: string;
  setNewSessionName: (value: string) => void;
  handleCreateSession: () => void;
  handleDeleteSession: (e: React.MouseEvent, sessionId: string) => void;
  setActiveSessionId: (sessionId: string) => void;
  sessions: SessionData[];
}) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-20">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className={`h-5 w-5 ${THEME.colors.primary}`} />
          <h1 className="font-bold tracking-tight">My Trainings</h1>
        </div>
        <button
          onClick={handleLogout}
          title="logoutBtn"
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>

    <main className="max-w-md mx-auto p-4 space-y-4 mt-2">
      <CreateNewSessions
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newSessionName={newSessionName}
        setNewSessionName={setNewSessionName}
        handleCreateSession={handleCreateSession}
      />
      <SessionsList
        handleDeleteSession={handleDeleteSession}
        setActiveSessionId={setActiveSessionId}
        sessions={sessions}
        isCreating={isCreating}
      />
    </main>
  </div>
);

export default SessionList;
