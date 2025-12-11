import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { appId, auth, db } from "./config/firebase";
import { doc, onSnapshot } from "firebase/firestore";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sets, setSets] = useState(0);
  const [lastWorkout, setLastWorkout] = useState<Date | null>(null);

  // Timer State
  const [timer, setTimer] = useState(90);
  const [defaultTimer, setDefaultTimer] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auth & Data Sync
  useEffect(() => {
    // Firebase listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(
      db,
      "artifacts",
      appId,
      "users",
      user.uid,
      "fitness_data",
      "current_session"
    );

    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSets(data.sets);
        setLastWorkout(data.lastWorkout);
      }
    });
  });

  return <div>Placeholder</div>;
}

export default App;
