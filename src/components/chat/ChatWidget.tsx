import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { LeadCapturePanel } from "@/components/chat/LeadCapturePanel";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const SIGNUP_MARKER = "[SHOW_SIGNUP_BUTTON]";

const SUGGESTION_CHIPS = [
  "What are your prices?",
  "How does it work?",
  "Book a demo",
];

const cleanContent = (text: string) => text.replace(/\[SHOW_SIGNUP_BUTTON\]/g, "").trim();

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Poll for admin replies (visitor is anonymous; no public realtime access)
  useEffect(() => {
    const convId = conversationIdRef.current;
    if (!convId) return;
    const seenIds = new Set<string>();
    let cancelled = false;

    const poll = async () => {
      const { data } = await supabase.rpc("get_visitor_chat_messages", { _conversation_id: convId });
      if (cancelled || !data) return;
      const newAgent = (data as any[]).filter(
        (m) => m.sender_type === "agent" && !seenIds.has(m.id)
      );
      newAgent.forEach((m) => seenIds.add(m.id));
      if (newAgent.length > 0) {
        setMessages((prev) => [
          ...prev,
          ...newAgent.map((m) => ({ role: "assistant" as const, content: m.message })),
        ]);
        if (!isOpen) setUnreadCount((c) => c + newAgent.length);
      }
      // Mark all existing as seen on first run
      (data as any[]).forEach((m) => seenIds.add(m.id));
    };

    // Seed seen IDs without surfacing
    supabase.rpc("get_visitor_chat_messages", { _conversation_id: convId }).then(({ data }) => {
      (data as any[] | null)?.forEach((m: any) => seenIds.add(m.id));
    });

    const interval = setInterval(poll, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [conversationIdRef.current, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.some((m) => m.role === "assistant" && m.content.includes(SIGNUP_MARKER))) {
      setShowSignup(true);
    }
  }, [messages]);

  const ensureConversation = useCallback(async () => {
    if (conversationIdRef.current) return conversationIdRef.current;
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ status: "open" })
      .select("id")
      .single();
    if (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }
    conversationIdRef.current = data.id;
    return data.id;
  }, []);

  const saveMessage = useCallback(async (conversationId: string, message: string, senderType: "visitor" | "ai") => {
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      message,
      sender_type: senderType,
    });
  }, []);

  const sendText = async (text: string, currentMessages: Message[] = messages) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...currentMessages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    const convId = await ensureConversation();
    if (convId) await saveMessage(convId, userMsg.content, "visitor");

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to connect");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (convId && assistantSoFar) {
        await saveMessage(convId, cleanContent(assistantSoFar), "ai");
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again or contact us at info@advantflowai.com." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    setIsOpen(false);
    navigate("/auth");
  };

  const handleToggle = () => {
    if (!isOpen) {
      setHasBeenOpened(true);
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Pulse ring — only before first open */}
      {!hasBeenOpened && !isOpen && (
        <span className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full pointer-events-none">
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
          <span className="absolute -inset-1 rounded-full bg-primary/20 animate-pulse" />
        </span>
      )}

      <motion.button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform"
        whileTap={{ scale: 0.95 }}
      >
        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-scale-in shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[380px] max-h-[80vh] sm:max-h-[520px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-accent flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-primary-foreground text-sm">AdvantFlow AI</h3>
                <p className="text-primary-foreground/70 text-xs">Ask me anything — I'm here to help</p>
              </div>
            </div>

            {/* Lead capture form */}
            {showLeadForm && (
              <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[380px]">
                <LeadCapturePanel />
              </div>
            )}

            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[340px] ${showLeadForm ? "hidden" : ""}`}
            >
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-4">
                  <Bot className="w-10 h-10 mx-auto text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">
                    Hey! 👋 I'm here to help you get more customers. Ask me anything about Advant Flow AI.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => sendText(chip, [])}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                        <ReactMarkdown>{cleanContent(msg.content)}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-secondary px-3 py-2 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Signup CTA */}
            {showSignup && (
              <div className="px-3 pb-2">
                <Button
                  onClick={handleSignup}
                  variant="hero"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Your Free Trial
                </Button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText(input)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button size="sm" onClick={() => sendText(input)} disabled={!input.trim() || isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
