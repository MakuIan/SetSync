import { THEME } from "../../utils/constants";

const Card = ({
  children,
  highlight = false,
  className = "",
}: {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) => (
  <div
    className={`${THEME.layout.card} ${highlight ? "bg-linear-to-br from-indigo-950 to -slate-900 border-indigo-500/30 shadow-lg" : THEME.colors.surfaceBg} ${className}`}
  >
    {children}
  </div>
);

export default Card;
