import { SignInButton } from "@clerk/clerk-react";

export default function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center mb-5 shadow-xl shadow-rose-600/30">
            <span
              className="text-xl font-black text-white tracking-wider"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              TD
            </span>
          </div>
          <h1
            className="text-3xl font-black text-white text-center leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Teatro<br />Dislocador
          </h1>
          <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-[0.25em] mt-2.5">
            Panel de Control
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
          <p className="text-sm text-slate-400 text-center mb-6">
            Accede con tu cuenta de administrador.
          </p>
          <SignInButton mode="modal">
            <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl transition text-sm shadow-md">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.133 1 1.18 5.925 1.18 12s4.953 11 11.06 11c6.373 0 10.596-4.414 10.596-10.74 0-.727-.078-1.282-.175-1.697H12.24z" />
              </svg>
              Continuar con Google
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}