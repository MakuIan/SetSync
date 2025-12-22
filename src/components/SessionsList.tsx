import { History, Trash2 } from "lucide-react";
import type { SessionData } from "../types";
import Card from "./ui/Card";
import { getTimeSince } from "../utils/timeHelpers";
import { getDateObj } from "../utils/renderHelpers";

const SessionsList = ({
  sessions,
  handleDeleteSession,
  setActiveSessionId,
  isCreating,
}: {
  sessions: SessionData[];
  handleDeleteSession: (e: React.MouseEvent, sessionId: string) => void;
  setActiveSessionId: (sessionId: string) => void;
  isCreating: boolean;
}) => (
  <div className="grid gap-3">
    {sessions.length === 0 && isCreating && (
      <div className="text-center text-slate-500 py-10">
        No Trainings yet created
      </div>
    )}
    {sessions.map((session) => (
      <Card
        key={session.id}
        onClick={() => setActiveSessionId(session.id)}
        className="group hover:border-slate-700"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
              {session.name}
            </h3>
            <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <History className="h-3 w-3" />
              {getTimeSince(getDateObj(session.lastWorkout))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={(e) => handleDeleteSession(e, session.id)}
              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete Session"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {/* {session.sets > 0 && (
              <span className="text-cs bg-indigo-500 text-white px-2 py-1 rounded-md font-bold">
                {session.sets} Sets
              </span>
            )} */}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default SessionsList;
