import { AlertCircle } from "lucide-react";
import type { SessionData } from "../types";
import { THEME } from "../utils/constants";
import Header from "./Header";
import LastWorkout from "./LastWorkout";
import SetCounter from "./SetCounter";
import AppTimer from "./Timer";
import FinishButton from "./FinishButton";

const ActiveSessionDetail = ({
  setActiveSessionId,
  activeSession,
  error,
  handleUpdateSets,
  handleUpdateDefaultTime,
  setIsTimerRunning,
  setTimerTime,
  timerTime,
  isTimerRunning,
  handleFinish,
}: {
  setActiveSessionId: (sessionId: string | null) => void;
  activeSession: SessionData | undefined;
  error: string | null;
  handleUpdateSets: (newVal: number) => void;
  handleUpdateDefaultTime: (newVal: number) => void;
  setIsTimerRunning: (newVal: boolean) => void;
  setTimerTime: (newVal: number) => void;
  timerTime: number;
  isTimerRunning: boolean;
  handleFinish: () => void;
}) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
    <Header
      setActiveSessionId={setActiveSessionId}
      activeSession={activeSession}
    />
    <main className="max-w-md mx-auto p-4 space-y-4 mt-2">
      {error && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 ${THEME.colors.errorBg} ${THEME.colors.errorBorder} border`}
        >
          <AlertCircle className={`h-5 w-5 shrink-0 ${THEME.colors.error}`} />
          <p className={`text-sm ${THEME.colors.error}`}> {error}</p>
        </div>
      )}

      <LastWorkout activeSession={activeSession} />
      <SetCounter
        activeSession={activeSession}
        handleUpdateSets={handleUpdateSets}
        timerTime={timerTime}
      />
      <AppTimer
        activeSession={activeSession}
        handleUpdateDefaultTime={handleUpdateDefaultTime}
        setTimerTime={setTimerTime}
        timerTime={timerTime}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
      />
      <FinishButton
        isTimerRunning={isTimerRunning}
        handleFinish={handleFinish}
      />
    </main>
  </div>
);

export default ActiveSessionDetail;
