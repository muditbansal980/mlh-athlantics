"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config/app";
import { useUserData } from "../../../store/usesUserData";
import ErrorPopup from "../lib/errorpopup";
import { Variants } from "framer-motion";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.3 }
  }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const errmsg = useRef("");
  const [errormsg, setErrmsg] = useState("");
  const [errdisplay, setErrdisplay] = useState("hidden");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errdisplay === "fixed") {
      const timer = setTimeout(() => {
        errmsg.current = "";
        setErrdisplay("hidden");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errdisplay]);

  async function Register(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: name,
          Email: email,
          Password: password,
        }),
        credentials: "include",
      });

      if (res.ok) {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      } 
      if(res.status === 400){
        setErrdisplay("fixed");
        const data = await res.json();
        setErrmsg(data.errors?"Password should be at least 6 characters long and Username should be 2 characters long and unique": "Validation failed. Please check your input.");
        // errmsg.current = data.errors?"Password should be at least 6 characters long and Username should be 2 characters long": "Validation failed. Please check your input.";
      }
      else {
        const data = await res.json();
        // errmsg.current = data.message || "Registration failed. Please try again.";
        setErrmsg(data.message || "Registration failed. Please try again.");
        setErrdisplay("fixed");
      }
    } catch {
      errmsg.current = "An unexpected database link disconnect occurred.";
      setErrdisplay("fixed");
    } finally {
      setLoading(false);
    }
  }

  async function Login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          Password: password,
        })
      });

      if (res.ok) {
        const data = await res.json();
        useUserData.setState({ currentUser: data.User });
        router.push("/home");
      } else {
        const data = await res.json();
        errmsg.current = data.message || "Login failed. Please try again.";
        setErrdisplay("fixed");
      }
    } catch {
      errmsg.current = "An operational connection failure occurred.";
      setErrdisplay("fixed");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
window.location.href =
      `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="relative min-h-dvh w-full bg-[#EEEDED] text-[#201C1C] flex items-center justify-center overflow-hidden font-sans p-4 sm:p-6">
      <ErrorPopup message={errormsg} display={errdisplay} />
      {/* Background Grid Mesh - Custom Crisp Stadium White Accentuation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#D1D1D6_1px,transparent_1px),linear-gradient(to_bottom,#D1D1D6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* Main Container Chassis layout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md lg:max-w-5xl min-h-[660px] bg-white border border-[#EEEDED] shadow-[0_24px_60px_-15px_rgba(32,28,28,0.12)] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >

        {/* --- LEFT SIDE: FIXED TEXT OVERLAY PANEL (Midnight Core Black) --- */}
        <div className="hidden lg:flex relative bg-[#201C1C] p-12 flex-col justify-between items-start text-[#EEEDED] overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#EEEDED_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Subtle Graphic Crimson Blur Orb */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#EA3A3A] rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#EA3A3A] uppercase bg-black px-3 py-1.5 rounded-full border border-neutral-900 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#EA3A3A]" /> Edition v1.0
            </span>
          </div>

          <div className="relative z-10 max-w-sm">
            <AnimatePresence mode="wait">
              {forgotPassword ? (
                <motion.div key="text-forgot" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                  <h1 className="text-4xl font-black tracking-tight leading-none mb-6 font-serif italic text-white">
                    Credential <span className="text-[#EA3A3A]">Recovery</span> System.
                  </h1>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">
                    Verify account linkage vectors safely to recover credentials and restore perimeter sync.
                  </p>
                </motion.div>
              ) : isLogin ? (
                <motion.div key="text-login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                  <h1 className="text-4xl font-black tracking-tight leading-none mb-6 font-serif italic text-white">
                    Never Miss an <span className="text-[#EA3A3A]">Opportunity</span> Again.
                  </h1>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">
                    Stop reading endless streams. Start acting on core metrics dynamically inside your cockpit.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="text-reg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                  <h1 className="text-4xl font-black tracking-tight leading-none mb-6 font-serif italic text-white">
                    Join the Elite <span className="text-[#EA3A3A]">Infrastructure</span>.
                  </h1>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">
                    Set up your secure profile workspace nodes in under two minutes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative z-10 w-full flex justify-between items-center border-t border-neutral-800 pt-6 text-[10px] text-neutral-500 font-mono tracking-wider">
            <span>© 2026 ATHLANTICS</span>
            <span>SHAPING FUTURE</span>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM WORKSPACE INTERFACE --- */}
        <div className="w-full p-8 sm:p-12 md:p-14 flex flex-col justify-between bg-white min-h-[600px]">

          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-black tracking-tighter uppercase border-b-2 border-[#EA3A3A] text-[#201C1C] cursor-pointer">
              ATHLANTICS
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
            <AnimatePresence mode="wait">
              {forgotPassword ? (

                /* --- RESET LAYOUT ENGINE --- */
                <motion.div key="forgot" variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <button type="button" onClick={() => setForgotPassword(false)} className="text-xs font-semibold text-neutral-400 hover:text-[#EA3A3A] mb-4 flex items-center gap-1 transition-colors">
                      ← Back to Login
                    </button>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2 font-serif italic text-[#201C1C]">Reset Password</h2>
                    <p className="text-sm text-neutral-500">Provide registration address node targets.</p>
                  </motion.div>

                  <motion.form variants={fadeInUp} onSubmit={(e) => { e.preventDefault();  }} className="space-y-4">
                    <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="athlete@example.com" icon="email" />
                    <button type="submit" className="w-full bg-[#EA3A3A] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#c22e2e] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(234,58,58,0.2)]">
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.form>
                </motion.div>
              ) : (

                /* --- DYNAMIC ACTION AUTH ENGINE --- */
                <motion.div key={isLogin ? "signin-form" : "signup-form"} variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-1 font-serif italic text-[#201C1C]">
                      {isLogin ? "Welcome back." : "Get started."}
                    </h2>
                    <p className="text-sm text-neutral-400">
                      {isLogin ? "New to ATHLANTICS? " : "Already registered? "}
                      <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#EA3A3A] font-semibold underline underline-offset-4 hover:text-[#201C1C] transition-colors">
                        {isLogin ? "Create account" : "Sign in here"}
                      </button>
                    </p>
                  </motion.div>

                  <motion.form variants={fadeInUp} onSubmit={isLogin ? Login : Register} className="space-y-4">
                    {!isLogin && (
                      <InputField label="Username" type="text" value={name} onChange={setName} placeholder="Username" icon="user" />
                    )}

                    <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="athlete@example.com" icon="email" />

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="field-label">Password</label>
                        {isLogin && (
                          <button type="button" onClick={() => setForgotPassword(true)} className="text-xs text-neutral-400 font-medium hover:text-[#EA3A3A] transition-colors underline underline-offset-2">
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div className="relative w-full flex items-center group">
                        <div className="absolute left-3.5 z-20 pointer-events-none flex items-center justify-center text-neutral-400 group-focus-within:text-[#EA3A3A] transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="sport-input pl-11 pr-11"
                          placeholder="••••••••"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 z-20 text-neutral-400 hover:text-[#EA3A3A] transition-colors p-1 flex items-center justify-center">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full mt-2 bg-[#201C1C] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-neutral-300">
                      {loading ? "Syncing data matrix..." : isLogin ? "Enter the Field" : "Create Account"}
                      {!loading && <ArrowRight className="w-4 h-4 text-[#EA3A3A]" />}
                    </button>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- GOOGLE FEDERATED LAYER --- */}
            {!forgotPassword && (
              <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mt-6">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#EEEDED]"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Or connect via</span>
                  <div className="flex-grow border-t border-[#EEEDED]"></div>
                </div>

                <button type="button" onClick={handleGoogleLogin} className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-[#EEEDED] text-[#201C1C] py-3.5 rounded-xl text-sm font-medium hover:bg-[#EEEDED] transition-all shadow-sm">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google Profile Node
                </button>
              </motion.div>
            )}
          </div>

          <p className="mt-8 text-center text-[10px] text-neutral-400 tracking-wide font-mono">
            © 2026 ATHLANTICS · Enforcing Secure Session Token Sets
          </p>
        </div>

      </motion.div>

      <style>{`
        .field-label {
          display: block;
          color: #888;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.35rem;
        }
        .sport-input {
          width: 100%;
          background: #EEEDED;
          border: 1px solid #EEEDED;
          border-radius: 0.75rem;
          padding-top: 0.8rem;
          padding-bottom: 0.8rem;
          color: #201C1C;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sport-input::placeholder { color: #A1A1AA; }
        .sport-input:focus {
          border-color: #EA3A3A;
          background: white;
          box-shadow: 0 0 0 1px #EA3A3A;
        }
        .sport-input:-webkit-autofill,
        .sport-input:-webkit-autofill:hover, 
        .sport-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #201C1C !important;
          -webkit-box-shadow: 0 0 0px 1000px #EEEDED inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}

function InputField({
  label, type, value, onChange, placeholder, icon,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: "email" | "user";
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative w-full flex items-center group">
        <div className="absolute left-3.5 z-20 pointer-events-none flex items-center justify-center text-neutral-400 group-focus-within:text-[#EA3A3A] transition-colors">
          {icon === "email" ? (
            <Mail className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sport-input pl-11 pr-4"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}