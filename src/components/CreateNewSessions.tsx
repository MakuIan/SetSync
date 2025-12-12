import { Plus } from "lucide-react";
import Card from "./ui/Card";

const CreateNewSessions = ({
  isCreating,
  setIsCreating,
  newSessionName,
  setNewSessionName,
  handleCreateSession,
}: {
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  newSessionName: string;
  setNewSessionName: (value: string) => void;
  handleCreateSession: () => void;
}) =>
  !isCreating ? (
    <button
      onClick={() => setIsCreating(true)}
      title="Create New Training"
      className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all items-center justify-center gap-2 font-semibold"
    >
      <Plus className="h-5 w-5" />
    </button>
  ) : (
    <Card className="animate-in fade-in zoom-in-95 duration-200">
      <h3 className="text-sm font-bold text-slate-400 mb-3">
        Name New Training
      </h3>
      <div className="flex gap-2">
        <input
          autoFocus
          value={newSessionName}
          onChange={(e) => setNewSessionName(e.target.value)}
          placeholder="e.g. chest training, full body,..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleCreateSession()}
        />
        <button
          onClick={handleCreateSession}
          title="Create Training"
          className="bg-emerald-500 text-slate-950 font-bold px-4 rounded-xl hover:bg0emerald-400"
        >
          OK
        </button>
        <button
          onClick={() => setIsCreating(false)}
          title="Cancel"
          className="text-slate-400 px-3 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </Card>
  );
export default CreateNewSessions;
