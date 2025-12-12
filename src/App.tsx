import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { appId, auth, db } from "./config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import type { SessionData } from "./types";
import { GoogleAuthProvider } from "firebase/auth";
import { Activity } from "lucide-react";
import LoginPage from "./components/LoginPage";
import ActiveSessionDetail from "./components/ActiveSessionDetail";
import SessionList from "./components/SessionList";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  // Timer State
  const [timerTime, setTimerTime] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

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
    const colRef = collection(
      db,
      "artifacts",
      appId,
      "users",
      user.uid,
      "sessions"
    );

    return onSnapshot(
      colRef,
      (snap) => {
        const loadedSessions: SessionData[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          loadedSessions.push({
            id: doc.id,
            name: data.name || "Unknown Training",
            sets: data.sets || 0,
            lastWorkout: data.lastWorkout || null,
            defaultTimer: data.defaultTimer || 60,
          });
        });
        loadedSessions.sort((a, b) => a.name.localeCompare(b.name));
        setSessions(loadedSessions);
      },
      (error) => {
        console.error("Sync Error:", error);
        setError("Database Connection Error");
      }
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
    setSessions([]);
    setActiveSessionId(null);
  };

  const handleCreateSession = async () => {
    if (!user || !newSessionName.trim()) return;
    try {
      await addDoc(
        collection(db, "artifacts", appId, "users", user.uid, "sessions"),
        {
          name: newSessionName.trim(),
          sets: 0,
          lastWorkout: null,
          defaultTimer: 60,
        }
      );
      setNewSessionName("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Failed to create session");
    }
  };

  const handleDeleteSession = async (
    e: React.MouseEvent,
    sessionId: string
  ) => {
    e.stopPropagation(); //prevents opening the card
    if (!user || !window.confirm("Do you want to delete this training")) return;
    try {
      await deleteDoc(
        doc(db, "artifacts", appId, "users", user.uid, "sessions", sessionId)
      );
      if (activeSessionId === sessionId) setActiveSessionId(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
      setError("Failed to delete session");
    }
  };

  const handleUpdateSets = async (newVal: number) => {
    if (!user || !activeSessionId) return;
    const val = Math.max(0, newVal);
    try {
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "sessions",
          activeSessionId
        ),
        {
          sets: val,
        }
      );
    } catch (err) {
      console.error("Failed to updates Sets", err);
      setError("Failed to update sets");
    }
  };

  const handleUpdateDefaultTime = async (time: number) => {
    if (!user || !activeSessionId) return;
    try {
      setTimerTime(time);
      setIsTimerRunning(false);
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "sessions",
          activeSessionId
        ),
        { defaultTimer: time }
      );
    } catch (err) {
      console.error("Failed to update default time", err);
      setError("Failed to update default time");
    }
  };

  const handleFinish = async () => {
    if (!user || !activeSessionId) return;
    const now = new Date();
    try {
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "sessions",
          activeSessionId
        ),
        {
          sets: 0,
          lastWorkout: Timestamp.fromDate(now),
          name: activeSession?.name || "Unknown Training",
        }
      );
    } catch (err) {
      console.error("Failed to exit", err);
      setError("Failed to exit");
    }
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

  if (!activeSessionId)
    return (
      <SessionList
        handleLogout={handleLogout}
        handleCreateSession={handleCreateSession}
        handleDeleteSession={handleDeleteSession}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newSessionName={newSessionName}
        setNewSessionName={setNewSessionName}
        setActiveSessionId={setActiveSessionId}
        sessions={sessions}
      />
    );

  return (
    <ActiveSessionDetail
      setActiveSessionId={setActiveSessionId}
      handleUpdateDefaultTime={handleUpdateDefaultTime}
      activeSession={activeSession}
      error={error}
      handleUpdateSets={handleUpdateSets}
      handleFinish={handleFinish}
      setIsTimerRunning={setIsTimerRunning}
      setTimerTime={setTimerTime}
      timerTime={timerTime}
      isTimerRunning={isTimerRunning}
    />
  );
}

export default App;
