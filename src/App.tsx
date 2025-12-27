import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
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
import { AUTO_RESET_DELAY_MS } from "./utils/constants";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  //Timer derived state
  const [, setTick] = useState(0);
  const isTimerRunning = activeSession?.timerRunning ?? false;

  const timerTime = (() => {
    if (activeSession?.timerRunning && activeSession?.timerEndsAt) {
      const now = Timestamp.now();
      const diff =
        activeSession.timerEndsAt.toDate().getTime() - now.toDate().getTime();
      return Math.max(0, Math.floor(diff / 1000));
    }
    return activeSession?.timerLeft ?? activeSession?.defaultTimer ?? 60;
  })();

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
            timerRunning: data.timerRunning || false,
            timerEndsAt: data.timerEndsAt || null,
            timerLeft:
              data.timerLeft !== undefined
                ? data.timerLeft
                : data.defaultTimer || 60,
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

  //Active ticking effect - handles the active session timer logic
  useEffect(() => {
    if (!isTimerRunning) return;
    const timerId = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

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
          timerRunning: false,
          timerLeft: 60,
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

  const handleUpdateSets = useCallback(
    async (newVal: number) => {
      const finalSet = newVal > 3 ? 1 : newVal;
      if (!user || !activeSessionId) return;
      const val = Math.max(0, finalSet);
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
    },
    [user, activeSessionId]
  );

  // start/pause Timer logic
  const handleSetIsTimerRunning = async (shouldRun: boolean) => {
    if (!user || !activeSessionId) return;

    try {
      const ref = doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "sessions",
        activeSessionId
      );
      if (shouldRun) {
        const endTime = new Date(Date.now() + timerTime * 1000);
        await updateDoc(ref, {
          timerRunning: true,
          timerEndsAt: Timestamp.fromDate(endTime),
        });
      } else {
        await updateDoc(ref, {
          timerRunning: false,
          timerEndsAt: null,
          timerLeft: timerTime,
        });
      }
    } catch (err) {
      console.error("Failed to update timer status", err);
      setError("Failed to update timer status");
    }
  };

  const handleSetTimerTime = async (newTime: number) => {
    if (!user || !activeSessionId) return;
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
        { timerLeft: newTime, timerRunning: false, timerEndsAt: null }
      );
    } catch (err) {
      console.error("Failed to update timer time", err);
      setError("Failed to update timer time");
    }
  };

  const handleUpdateDefaultTime = async (time: number) => {
    if (!user || !activeSessionId) return;
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
          defaultTimer: time,
          timerLeft: time,
          timerRunning: false,
          timerEndsAt: null,
        }
      );
    } catch (err) {
      console.error("Failed to update default time", err);
      setError("Failed to update default time");
    }
  };

  const handleFinish = async () => {
    if (!window.confirm("Are you sure you want to finish this session?")) return;
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
          defaultTimer: activeSession?.defaultTimer || 60,
          timerLeft: activeSession?.defaultTimer || 60,
          timerRunning: false,
        }
      );
    } catch (err) {
      console.error("Failed to exit", err);
      setError("Failed to exit");
    }
  };

  // Auto-Reset timer when it reaches zero
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (timerTime === 0 && activeSession) {
      timeoutId = setTimeout(() => {
        const defaultT = activeSession.defaultTimer || 60;
        const currentSets = activeSession.sets || 1;
        const nextSet = currentSets + 1;

        handleUpdateSets(nextSet);

        if (user && activeSessionId) {
          updateDoc(
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
              timerRunning: false,
              timerLeft: defaultT,
              timerEndsAt: null,
            }
          ).catch((e) => {
            console.error("Auto-reset error", e);
            setError("Auto-reset error");
          });
        }
      }, AUTO_RESET_DELAY_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [timerTime, activeSession, handleUpdateSets, user, activeSessionId]);

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
      setIsTimerRunning={handleSetIsTimerRunning}
      setTimerTime={handleSetTimerTime}
      timerTime={timerTime}
      isTimerRunning={isTimerRunning}
    />
  );
}

export default App;
