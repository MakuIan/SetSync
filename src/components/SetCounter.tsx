import { Dumbbell, Minus, Plus } from "lucide-react";
import { THEME } from "../utils/constants";
import Card from "./ui/Card";
import ActionBtn from "./ui/ActionBtn";
import type { SessionData } from "../types";

const SetCounter = ({
  handleUpdateSets,
  activeSession,
}: {
  handleUpdateSets: (newVal: number) => void;
  activeSession: SessionData | undefined;
}) => (
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
      <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
        {activeSession?.sets || 1}
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

export default SetCounter;
