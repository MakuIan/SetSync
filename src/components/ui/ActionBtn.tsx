import type { ActionBtnProps } from "../../types";
import { THEME } from "../../utils/constants";

const ActionBtn = ({
  onClick,
  icon: Icon,
  label,
  variant = "secondary",
  className = "",
}: ActionBtnProps) => {
  let styles = THEME.layout.button;

  if (variant === "primary")
    styles += `${THEME.colors.primaryBg} text-slate-950 font-bold py-3 px-4 w-full gap-2 hover:brightnes-110`;
  if (variant === "secondary")
    styles += `${THEME.colors.surfaceHighlight} hover:bg-slate700 text-slate-300 py-3 px-4 gap-2 font-semibold border border-slate-700`;
  if (variant === "ghost") styles += `text-xs text-indigo-300 hover:text-white`;
  if (variant === "icon-only")
    styles += `${THEME.colors.accentBg} text-white shadow-lg shadow-indigo-500/20 h-14 w-14`;
  if (variant === "danger")
    styles += `bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 p-2`;
  return (
    <button onClick={onClick} className={styles + " " + className}>
      {Icon && (
        <Icon
          className={
            variant === "icon-only" ? "h6- w-6" : "h-5 w-5 fill-current"
          }
        />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionBtn;
