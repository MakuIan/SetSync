import { CheckCircle } from "lucide-react";
import { THEME } from "../utils/constants";

const FinishButton = ({
  handleFinish,
  isTimerRunning,
}: {
  handleFinish: () => void;
  isTimerRunning: boolean;
}) => {
  return (
    <button
      onClick={handleFinish}
      className="w-full group bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 text-slate-400 hover:text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all mt-6 active:scale-95"
    >
      <CheckCircle
        className={`h-6 w-6 transition-colors ${isTimerRunning ? "text-slate-600" : THEME.colors.primary}`}
      />
      <span className="font-semibold text-lg">Finish</span>
    </button>
  );
};

export default FinishButton;
