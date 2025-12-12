import { Dumbbell, Minus, Plus } from "lucide-react";
import { THEME } from "../utils/constants";
import Card from "./ui/Card";
import ActionBtn from "./ui/ActionBtn";

const SetCounter = ({
  handleUpdateSets,
  sets,
}: {
  handleUpdateSets: (newVal: number) => void;
  sets: number;
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
        onClick={() => handleUpdateSets(sets - 1)}
        icon={Minus}
        variant="secondary"
        className="w-14! h-14! rounded-2xl!"
      />
      <div className="t iext-6xl font-black text-white tabular-nums tracking-tighter">
        {sets}
      </div>
      <ActionBtn
        onClick={() => handleUpdateSets(sets + 1)}
        icon={Plus}
        variant="icon-only"
        className="rounded-2xl!"
      />
    </div>
  </Card>
);

export default SetCounter;
