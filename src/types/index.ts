import { Timestamp } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";

export interface FitnessData {
  sets: number;
  lastWorkout: Timestamp | null;
}

export interface ActionBtnProps {
  onClick: (e?: React.MouseEvent) => void;
  icon?: LucideIcon;
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "icon-only" | "danger";
  className?: string;
}

export interface SessionData {
  id: string;
  name: string;
  sets: number;
  lastWorkout: Timestamp | null;
  defaultTimer: number;
}
