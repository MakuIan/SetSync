import { Timestamp } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";

export interface FitnessData {
  sets: number;
  lastWorkout: Timestamp | null;
}

export interface ActionBtnProps {
  onClick: () => void;
  icon?: LucideIcon;
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "icon-only";
  className?: string;
}
