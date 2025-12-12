import { History } from "lucide-react";
import Card from "./ui/Card";

const LastWorkout = ({
  lastWorkout,
  getTimeSince,
}: {
  lastWorkout: Date | null;
  getTimeSince: (lastWorkout: Date | null) => string;
}) => (
  <Card>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
          Last Training
        </h3>
        <div className="text-2xl font-bold text-white">
          {getTimeSince(lastWorkout)}
        </div>
        {lastWorkout && (
          <div className="text-xstext-slate-500 mt-1">
            {" "}
            {lastWorkout.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
      <History className="text-slate-700 h-8 w-8" />
    </div>
  </Card>
);

export default LastWorkout;
