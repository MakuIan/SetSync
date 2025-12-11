import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { appId, auth, db } from "./config/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import type { FitnessData } from "./types";
import { GoogleAuthProvider } from "firebase/auth";
import { Activity } from "lucide-react";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sets, setSets] = useState(0);
  const [lastWorkout, setLastWorkout] = useState<Date | null>(null);

  // Timer State
  const [timerTime, setTimerTime] = useState(90);
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

    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as FitnessData;
          setSets(data.sets || 0);
          if (data.lastWorkout) setLastWorkout(data.lastWorkout.toDate());
        } else {
          setDoc(
            docRef,
            {
              sets: 0,
              lastWorkout: null,
            },
            { merge: true }
          );
        }
      },
      (error) => console.error("Sync Error:", error)
    );
  }, [user]);

  // Timer Effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const tick = () => {
      setTimerTime((prevTime) => {
        if (prevTime <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    };

    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [isTimerRunning]);

  const handleGoogleLogin = async () => {
    console.log("DEBUG AUTH:", auth);
    try {
      const provider = new GoogleAuthProvider();
      console.log("DEBUG PROVIDER:", provider);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Guest Login Error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSets(0);
    setLastWorkout(null);
  };

  const handleUpdateSets = async (newVal: number) => {
    if (!user) return;
    const val = Math.max(0, newVal);
    setSets(val);
    await setDoc(
      doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "fitness_data",
        "current_session"
      ),
      { sets: val },
      { merge: true }
    );
  };

  const handleFinish = async () => {
    if (!user) return;
    await setDoc(
      doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "fitness_data",
        "current_session"
      ),
      { merge: true }
    );
    setSets(0);
    setLastWorkout(new Date());
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate950 flex items-center justify-center">
        <Activity className="animate-spin text-emerald-500" />
      </div>
    );

  if (!user)
    return (
      <LoginPage
        onGuestLogin={handleGuestLogin}
        onGoogleLogin={handleGoogleLogin}
      />
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header user={user} handleLogout={handleLogout} />
      <main className="max-w-md mx-auto p-4 space-y-4 mt-2"></main>
    </div>
  );
}

export default App;
