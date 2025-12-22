import type { SessionData } from "../types";
import { THEME } from "../utils/constants";
import { formatDuration } from "../utils/timeHelpers";
import ActionBtn from "./ui/ActionBtn";
import Card from "./ui/Card";
import { RotateCcw, Timer, Pause, Play } from "lucide-react";

const AppTimer = ({
  handleUpdateDefaultTime,
  setIsTimerRunning,
  setTimerTime,
  activeSession,
  timerTime,
  isTimerRunning,
}: {
  handleUpdateDefaultTime: (newVal: number) => void;
  setIsTimerRunning: (newVal: boolean) => void;
  setTimerTime: (newVal: number) => void;
  timerTime: number;
  isTimerRunning: boolean;
  activeSession: SessionData | undefined;
}) => (
  <Card>
    <div className="flex justify-between items-center mb-6">
      <h2
        className={`font-bold flex items-center gap-2 ${THEME.colors.primary}`}
      >
        <Timer className="h-4 w-4" /> Pause
      </h2>
      <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
        {[30, 60, 300, 600].map((t) => (
          <button
            key={t}
            onClick={() => {
              handleUpdateDefaultTime(t);
            }}
            className={`text-xs px-3 py-1.5 rounded-md transition-all ${activeSession?.defaultTimer === t ? "bg-slate-700 text-white font-medium shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
          >
            {formatDuration(t)}
          </button>
        ))}
      </div>
    </div>

    <div className="text-center relative py-2">
      <div
        className={`text-6xl font-mono font-medium tracking-tighter tabular-nums transition-colors ${timerTime === 0 ? THEME.colors.primary : "text-white"}`}
      >
        {formatDuration(timerTime)}
      </div>
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${THEME.colors.primaryBg}`}
          style={{
            width: `${(timerTime / (activeSession?.defaultTimer || 60)) * 100}%`,
          }}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button
        onClick={() => setIsTimerRunning(!isTimerRunning)}
        className={`py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${
          isTimerRunning
            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            : `${THEME.colors.primaryBg} text-slate-900`
        }`}
      >
        {isTimerRunning ? (
          <>
            <Pause className="h-5 w-5 fill-current" /> Pause
          </>
        ) : (
          <>
            <Play className="h-5 w-5 fill-current" /> Start
          </>
        )}
      </button>
      <ActionBtn
        onClick={() => {
          setTimerTime(activeSession?.defaultTimer || 60);
        }}
        label="Reset"
        icon={RotateCcw}
        variant="secondary"
      />
    </div>
  </Card>
);

export default AppTimer;
