import { Activity } from "lucide-react";
import Card from "./ui/Card";
import ActionBtn from "./ui/ActionBtn";

const LoginPage = ({
  onGuestLogin,
  onGoogleLogin,
}: {
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
}) => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-sm space-y-8">
      {/* Logo Area */}
      <div className="text-center">
        <div className="bg-emerald-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
          <Activity className="h-10 w-10 text-emerald-500 " />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          SetSync
        </h1>
        <p className="text-slate-400">
          Your Focus. Your Training. Your Progress
        </p>
      </div>

      <Card className="space-y-4 p-8! backdrop-blur-sm bg-slate-900/50">
        <button
          onClick={onGoogleLogin}
          title="GoogleLoginBtn"
          className="w-full bg-white hover:bg-slate100 text-slate-900 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
            <div className="relative flex justify-centertext-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500"></span>
            </div>
          </div>
        </div>

        <ActionBtn
          onClick={onGuestLogin}
          label="Continue as Guest"
          variant="secondary"
          className="w-full bg-slate-800/50 hover:bg-slate-800"
        />
      </Card>

      <p className="text-center text-xs text-slate-600">
        By registering, you agree to the terms of use.
      </p>
    </div>
  </div>
);

export default LoginPage;
