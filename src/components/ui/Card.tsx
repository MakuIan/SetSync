import { THEME } from "../../utils/constants";

const Card = ({
  children,
  highlight = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`${THEME.layout.card} ${highlight ? "bg-linear-to-br from-indigo-950 to -slate-900 border-indigo-500/30 shadow-lg" : THEME.colors.surface} ${onClick ? "cursor-pointer hover:border-slate-600 active:scale-[0.98]" : ""} ${className}`}
  >
    {children}
  </div>
);

export default Card;
