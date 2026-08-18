import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { NAVY, ORANGE } from "../theme";

const starterMessages = [
  { sender: "bot", text: "Hi! I'm your AI assistant. Ask me about tasks, budget, or team risks." },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const botReply = {
      sender: "bot",
      text: "This is a demo response. In the full version, I'd analyze your project data and answer this live.",
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition z-50 hover:opacity-90"
        style={{ background: ORANGE }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden">
          <div className="text-white px-4 py-3 flex items-center gap-2" style={{ background: NAVY }}>
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI Assistant</span>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-xl max-w-[85%] ${
                  m.sender === "bot" ? "bg-amber-50 text-slate-700 self-start" : "text-white self-end ml-auto"
                }`}
                style={m.sender === "user" ? { background: ORANGE } : {}}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-100 p-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 text-sm px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0"
              style={{ background: NAVY }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}