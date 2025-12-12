import { History } from "lucide-react";
import Card from "./ui/Card";
import { getDateObj } from "../utils/renderHelpers";
import type { SessionData } from "../types";
import { getTimeSince } from "../utils/timeHelpers";

const LastWorkout = ({
  activeSession,
}: {
  activeSession: SessionData | undefined;
}) => (
  <Card>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          Last Training
        </h3>
        <div className="text-2xl font-bold text-white">
          {getTimeSince(getDateObj(activeSession?.lastWorkout || null))}
        </div>
        {activeSession?.lastWorkout && (
          <div className="text-xs text-slate-500 mt-1">
            {getDateObj(activeSession.lastWorkout)?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>
      <History className="text-slate-700 h-8 w-8" />
    </div>
  </Card>
);

export default LastWorkout;
