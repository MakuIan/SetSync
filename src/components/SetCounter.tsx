import { ArrowUp, Dumbbell, Minus, Plus } from "lucide-react";
import { THEME } from "../utils/constants";
import Card from "./ui/Card";
import ActionBtn from "./ui/ActionBtn";
import type { SessionData } from "../types";
import { useEffect, useRef, useState } from "react";

const SetCounter = ({
  handleUpdateSets,
  activeSession,
  timerTime,
}: {
  handleUpdateSets: (newVal: number) => void;
  activeSession: SessionData | undefined;
  timerTime: number;
}) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const prevSetsRef = useRef(activeSession?.sets || 1);

  useEffect(() => {
    const currentSets = activeSession?.sets || 1;
    if (currentSets > prevSetsRef.current) {
      const timer = setTimeout(() => {
        setShowIndicator(true);
        const hideTimer = setTimeout(() => {
          setShowIndicator(false);
        }, 2000);
        return () => clearTimeout(hideTimer);
      }, 0);
      return () => clearTimeout(timer);
    }
    prevSetsRef.current = currentSets;
  }, [activeSession?.sets]);
  const showWaitingIndicator = timerTime === 0;
  return (
    <Card highlight={true}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`font flex items-center gap-2 ${THEME.colors.accent}`}>
          <Dumbbell className="h-4 w-4" />
          Sets
        </h2>
        <ActionBtn
          onClick={() => handleUpdateSets(1)}
          label="Reset"
          variant="ghost"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <ActionBtn
          onClick={() => handleUpdateSets((activeSession?.sets || 1) - 1)}
          icon={Minus}
          variant="icon-only"
          className="rounded-2xl!"
        />
        <div className="relative flex items-center justify-center w-24">
          <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
            {activeSession?.sets || 1}
          </div>

          {/* Zustand 1: Warten (Timer = 0) - Schnelles Blinken */}
          {showWaitingIndicator && !showIndicator && (
            <div className="absolute -right-6 top-2 text-emerald-500/80 animate-pulse">
              <ArrowUp className="h-8 w-8 stroke- animate-[bounce_0.5s_infinite]" />
            </div>
          )}

          {/* Zustand 2: Erfolg (Set +1) - Einmaliges Aufsteigen */}
          <div
            className={`absolute -right-6 top-2 text-emerald-400 transition-all duration-700 ease-out flex flex-col items-center ${
              showIndicator
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <ArrowUp className="h-8 w-8 stroke-3" />
          </div>
        </div>

        <ActionBtn
          onClick={() => handleUpdateSets((activeSession?.sets || 1) + 1)}
          icon={Plus}
          variant="icon-only"
          className="rounded-2xl!"
        />
      </div>
    </Card>
  );
};

export default SetCounter;
