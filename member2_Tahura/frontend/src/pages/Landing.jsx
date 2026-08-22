import { useNavigate } from "react-router-dom";
import {
  Rocket,
  LayoutDashboard,
  Wallet,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
} from "lucide-react";
import heroImg from "../assets/hero-illustration.png";

const AMBER = "#FDB515";
const ORANGE = "#F7931E";
const NAVY = "#0B3D56";
const NAVY_DEEP = "#072138";
const TEAL = "#0EA5B7";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- HERO (text written directly on the image) ---------- */}
      <section className="relative" style={{ background: `linear-gradient(135deg, ${AMBER}, ${ORANGE})` }}>
        <div
          className="relative w-full mx-auto"
          style={{ maxWidth: "1416px", aspectRatio: "1416 / 980" }}
        >
          <img
            src={heroImg}
            alt="Where AI meets startups"
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          />

          {/* Nav row — sits inside the orange top border */}
          <div
            className="absolute flex items-center justify-between"
            style={{ left: "6%", top: "3%", width: "88%" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="rounded-md flex items-center justify-center"
                style={{ background: NAVY, width: "clamp(20px,2.4vw,30px)", height: "clamp(20px,2.4vw,30px)" }}
              >
                <Rocket size={13} color="#FFFFFF" />
              </div>
              <span
                className="font-extrabold text-white"
                style={{ fontSize: "clamp(11px, 1.4vw, 18px)" }}
              >
                StartupAI
              </span>
            </div>

            <div
              className="hidden md:flex items-center gap-6 font-semibold text-white"
              style={{ fontSize: "clamp(9px, 1vw, 13px)" }}
            >
              <a href="#features" className="hover:opacity-75">Features</a>
              <a href="#how-it-works" className="hover:opacity-75">How It Works</a>
              <a href="#contact" className="hover:opacity-75">Contact</a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-white hover:opacity-75"
                style={{ fontSize: "clamp(9px,1vw,13px)" }}
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold text-white rounded-md transition hover:opacity-90"
                style={{
                  background: NAVY,
                  fontSize: "clamp(9px,1vw,13px)",
                  padding: "clamp(4px,0.7vw,8px) clamp(8px,1.4vw,16px)",
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Headline block — overlaid on the blank white space at left */}
          <div className="absolute" style={{ left: "9%", top: "13%", width: "36%" }}>
            <h1 className="font-extrabold leading-tight" style={{ fontSize: "clamp(22px, 4vw, 54px)" }}>
              <span style={{ color: NAVY }}>Where AI Meets</span>
              <br />
              <span style={{ color: ORANGE }}>Startups</span>
            </h1>
            <p
              className="text-slate-500 mt-3"
              style={{ fontSize: "clamp(8px, 1.1vw, 15px)", lineHeight: 1.5 }}
            >
              Manage tasks, budgets, and your team in one place — with AI
              agents that watch for risks and recommend what to do next.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 text-white font-semibold rounded-lg transition hover:opacity-90"
                style={{
                  background: ORANGE,
                  fontSize: "clamp(8px,1vw,14px)",
                  padding: "clamp(5px,0.9vw,11px) clamp(10px,1.8vw,22px)",
                }}
              >
                Get Started Free <ArrowRight size={13} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="font-semibold rounded-lg border-2 transition hover:bg-white/60"
                style={{
                  borderColor: NAVY,
                  color: NAVY,
                  fontSize: "clamp(8px,1vw,14px)",
                  padding: "clamp(5px,0.9vw,11px) clamp(10px,1.8vw,22px)",
                }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="max-w-6xl mx-auto px-4 md:px-8 py-20 text-center">
        <p className="text-sm font-bold tracking-wide uppercase" style={{ color: ORANGE }}>
          Everything in one place
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold mt-2" style={{ color: NAVY }}>
          Built for lean startup teams
        </h2>
        <p className="text-slate-500 mt-3 max-w-xl mx-auto">
          Six core modules that keep your team, budget, and roadmap in sync — no spreadsheets required.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { icon: LayoutDashboard, label: "Live Dashboard", color: NAVY },
            { icon: ListTodo, label: "Task Management", color: ORANGE },
            { icon: Wallet, label: "Budget Monitoring", color: TEAL },
            { icon: Users, label: "Team Management", color: NAVY },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                style={{ background: color }}
              >
                <Icon size={22} />
              </div>
              <p className="text-sm font-semibold" style={{ color: NAVY }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how-it-works" className="py-20" style={{ background: "#FFF7EA" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm font-bold tracking-wide uppercase" style={{ color: ORANGE }}>
            Simple by design
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2" style={{ color: NAVY }}>
            How StartupAI works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            {[
              {
                step: "01",
                title: "Set up your team",
                desc: "Add employees, assign roles, and track skills and workload in minutes.",
              },
              {
                step: "02",
                title: "Track work & budget",
                desc: "Create tasks, log expenses, and watch spending trends in real time.",
              },
              {
                step: "03",
                title: "Let AI watch for risks",
                desc: "The AI agent flags overdue tasks, overloaded teammates, and budget issues before they become problems.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 shadow-sm">
                <span className="text-3xl font-extrabold" style={{ color: AMBER }}>{s.step}</span>
                <h3 className="font-bold text-lg mt-3" style={{ color: NAVY }}>{s.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY CHOOSE US ---------- */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-bold tracking-wide uppercase" style={{ color: ORANGE }}>
            Why StartupAI
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-6" style={{ color: NAVY }}>
            One dashboard, zero guesswork
          </h2>
          <ul className="space-y-4">
            {[
              "Real-time risk alerts before deadlines slip",
              "AI-suggested task assignments based on skills",
              "Clear budget charts, not messy spreadsheets",
              "Built for teams of 2 to 50+",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={20} style={{ color: TEAL }} className="shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-8 text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})` }}>
          <AlertTriangle size={28} style={{ color: AMBER }} />
          <p className="mt-4 text-lg font-semibold">
            "Backend API task is 3 days overdue" — the kind of alert you'd
            normally miss until it's too late.
          </p>
          <p className="text-sm text-slate-300 mt-3">
            StartupAI's AI agent catches it the moment it happens.
          </p>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="py-16 text-center" style={{ background: `linear-gradient(135deg, ${AMBER}, ${ORANGE})` }}>
        <Sparkles className="mx-auto mb-3 text-white" size={28} />
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Ready to run your startup smarter?
        </h2>
        <button
          onClick={() => navigate("/signup")}
          className="mt-6 bg-white text-sm font-semibold px-6 py-3 rounded-xl transition hover:opacity-90"
          style={{ color: ORANGE }}
        >
          Get Started Free
        </button>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer id="contact" className="text-slate-300 py-10" style={{ background: NAVY_DEEP }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center" style={{ background: ORANGE }}>
              <Rocket size={16} />
            </div>
            <span className="font-bold text-white">StartupAI</span>
          </div>
          <p className="text-xs text-slate-400">CSE327 · Software Engineering Group Project</p>
        </div>
      </footer>
    </div>
  );
}
