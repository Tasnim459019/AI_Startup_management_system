import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { BG } from "../theme";

export default function Layout({ title, children }) {
  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}