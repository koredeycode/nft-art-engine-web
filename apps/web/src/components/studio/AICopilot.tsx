import {
  Bot,
  ChevronDown,
  Mic,
  MicOff,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface AICopilotProps {
  projectName?: string;
  onClose?: () => void;
}

interface Message {
  id: string;
  sender: "copilot" | "user";
  text: string;
  timestamp: string;
}

const AI_MODELS = [
  { id: "gpt-4o", name: "gpt-4o" },
  { id: "deepseek-r1", name: "deepseek-r1" },
  { id: "gemini-2.5-flash", name: "gemini-2.5-flash" },
];

export function AICopilot({ projectName, onClose }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated Copilot response tailored to NFT Art Engine
    setTimeout(() => {
      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: `Using [${selectedModel}], I analyzed your project "${projectName || "Collection"}". You can customize layer ordering, set trait weights, or preview composite outputs in real time.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, copilotMsg]);
    }, 600);
  };

  return (
    <div className="studio-panel h-full flex flex-col bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-800 dark:text-slate-100">
            AI Architect Copilot
          </h3>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Copilot"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {/* Welcome Banner Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-2">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            Copilot
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Hi! I am the Visual Art Engine Copilot. I can help configure your layers, adjust trait weights, optimize blend modes, or generate complex artwork collections. Try typing &quot;generate cyberpunk workflow&quot; or asking questions.
          </p>
        </div>

        {/* Message Transcript */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1 ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              {msg.sender === "user" ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3 text-indigo-500" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-orange-500" />
                  <span>Copilot</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>
            <div
              className={`p-3 rounded-xl max-w-[88%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form onSubmit={handleSend} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-3 shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe the workflow you want to build..."
            rows={2}
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
            {/* Model Selection Dropdown */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 rounded-md pl-2.5 pr-7 py-1 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Actions: Mic & Send */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-1.5 rounded-md border transition-colors ${
                  isRecording
                    ? "bg-red-50 dark:bg-red-950 text-red-600 border-red-200 dark:border-red-800 animate-pulse"
                    : "bg-slate-200/60 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300/60 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-1.5 bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-md border border-slate-300/60 dark:border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-300 dark:disabled:hover:bg-slate-800 transition-colors"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
