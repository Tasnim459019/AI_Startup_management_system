import { NAVY, ORANGE } from "../theme";

export default function Topbar({ title }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold" style={{ color: NAVY }}>
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-bold"
          style={{ background: ORANGE }}
        >
          M
        </div>
        <span className="text-sm text-slate-600">Manager</span>
      </div>
    </header>
  );
}
