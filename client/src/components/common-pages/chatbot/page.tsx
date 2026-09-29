"use client";
import { notFound } from "next/navigation";

// import { useState, useRef, useEffect } from "react";
// import { Send, Sparkles, ChevronRight, Zap, Navigation, FileText } from "lucide-react";
// import {sendUserInputToLLM} from "../../../../api/llm/sendinguserinput";

// /* ── Types ─────────────────────────────────────────── */
// type Message = {
//     id: number;
//     role: "user" | "assistant";
//     content: string;
//     time: string;
// };

// /* ── Static seed messages ───────────────────────────── */
// const SEED_MESSAGES: Message[] = [
//     {
//         id: 1,
//         role: "assistant",
//         content: "Hey! I'm your Athlantic assistant. I can navigate the app, fill forms, or answer any questions you have. What can I help you with?",
//         time: "",
//     },
// ];

// const SUGGESTIONS = [
//     { label: "Take me to tasks", icon: Navigation },
//     { label: "How do I upload a video?", icon: FileText },
//     { label: "Create a new contest", icon: Zap },
//     { label: "Show my profile", icon: ChevronRight },
// ];

// function now() {
//     return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// export default function AgentChatPage() {
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
//     const [showSuggestions, setShowSuggestions] = useState(true);
//     const bottomRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     useEffect(() => {
//         // runs only on client, no SSR mismatch
//         setMessages((prev) =>
//             prev.map((m) => ({ ...m, time: m.time || now() }))
//         );
//     }, []);

//     useEffect(() => {
//         inputRef.current?.focus();
//     }, []);

//     function handleSend(text?: string) {
//         const val = (text ?? input).trim();

//         if (!val) return;
//         sendUserInputToLLM(input).then((res)=>{
//             if(res){
//                 // console.log("LLM Response in frontend:- ", res.response);
//                 setMessages((prev) => [
//                     ...prev,
//                     { id: Date.now(), role: "assistant", content: res.response, time: now() },
//                 ]);
//             }
//             else{
//                 // console.log("No response from LLM");
//                 alert("No response from LLM");
//             }
//         })

        
//         setInput("");
//         setShowSuggestions(false);
//         setMessages((prev) => [
//             ...prev,
//             { id: Date.now(), role: "user", content: val, time: now() },
//         ]);
//     }

//     return (
//         <div className="min-h-dvh bg-[#F5F4F0] font-['DM_Sans',sans-serif] flex flex-col">
//             <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');`}</style>

//             {/* ── Top bar ── */}
//             <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shrink-0">
//                 <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center">
//                         <Sparkles size={14} className="text-lime-400" />
//                     </div>
//                     <div>
//                         <p className="font-semibold text-stone-900 text-sm leading-none">Athlantic Assistant</p>
//                         <p className="text-xs text-stone-400 mt-0.5 leading-none">AI · Actions require your confirmation</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="w-2 h-2 rounded-full bg-lime-400" />
//                     <span className="text-xs text-stone-400 font-medium">Online</span>
//                 </div>
//             </header>

//             {/* ── Main content ── */}
//             <div className="flex flex-1 overflow-hidden max-w-3xl w-full mx-auto px-4 py-6 flex-col gap-4">


//                 {/* ── Messages ── */}
//                 <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">

//                     {messages.map((m) =>
//                         m.role === "assistant" ? (
//                             /* assistant */
//                             <div key={m.id} className="flex items-start gap-3 max-w-[80%]">
//                                 <div className="w-7 h-7 rounded-xl bg-stone-900 flex items-center justify-center shrink-0 mt-0.5">
//                                     <Sparkles size={11} className="text-lime-400" />
//                                 </div>
//                                 <div>
//                                     <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3">
//                                         <p className="text-lg text-stone-700 leading-relaxed">{m.content}</p>
//                                     </div>
//                                     <p className="text-[14px] text-gray-600 mt-1.5 ml-1">{m.time}</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             /* user */
//                             <div key={m.id} className="flex items-start gap-3 max-w-[80%] self-end flex-row-reverse">
//                                 <div className="w-7 h-7 rounded-xl bg-lime-400 flex items-center justify-center shrink-0 mt-0.5">
//                                     <span className="text-[10px] font-bold text-stone-900">Y</span>
//                                 </div>
//                                 <div>
//                                     <div className="bg-stone-900 rounded-2xl rounded-tr-sm px-4 py-3">
//                                         <p className="text-lg text-white leading-relaxed">{m.content}</p>
//                                     </div>
//                                     <p className="text-[14px] text-gray-600 mt-1.5 mr-1 text-right">{m.time}</p>
//                                 </div>
//                             </div>
//                         )
//                     )}

//                     <div ref={bottomRef} />
//                 </div>

//                 {/* ── Suggestions ── */}
//                 {showSuggestions && (
//                     <div className="shrink-0">
//                         <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium mb-2 ml-1">Try asking</p>
//                         <div className="grid grid-cols-2 gap-2">
//                             {SUGGESTIONS.map(({ label, icon: Icon }) => (
//                                 <button
//                                     key={label}
//                                     onClick={() => handleSend(label)}
//                                     className="flex items-center gap-2.5 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 rounded-xl px-4 py-3 text-left transition-colors group"
//                                 >
//                                     <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center shrink-0 transition-colors">
//                                         <Icon size={12} className="text-stone-500" />
//                                     </div>
//                                     <span className="text-xs font-medium text-stone-700">{label}</span>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Input ── */}
//                 <div className="shrink-0 bg-white border border-stone-200 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-stone-400 transition-colors">
//                     <input
//                         ref={inputRef}
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                         placeholder="Ask me anything — navigate, fill forms, or get help…"
//                         className="flex-1 bg-transparent text-sm text-stone-700 placeholder-stone-300 outline-none font-['DM_Mono',monospace]"
//                     />
//                     <button
//                         onClick={() => handleSend()}
//                         disabled={!input.trim()}
//                         className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center shrink-0 disabled:opacity-25 hover:bg-stone-700 transition-colors"
//                     >
//                         <Send size={13} className="text-white" />
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );
// }
export default function ChatbotPage() {
  return (
      <div>
        notfound()
      </div>
  );
}