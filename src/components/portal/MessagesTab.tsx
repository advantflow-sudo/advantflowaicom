import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { MessageCircle, Send, Loader2, Search, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface Conversation {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  message_count?: number;
}

interface ChatMessage {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

export const MessagesTab = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations with last message preview
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const { data: convos } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (convos) {
        // Fetch last message for each conversation
        const enriched = await Promise.all(
          convos.map(async (c) => {
            const { data: msgs } = await supabase
              .from("chat_messages")
              .select("message, created_at")
              .eq("conversation_id", c.id)
              .order("created_at", { ascending: false })
              .limit(1);

            const { count } = await supabase
              .from("chat_messages")
              .select("*", { count: "exact", head: true })
              .eq("conversation_id", c.id);

            return {
              ...c,
              last_message: msgs?.[0]?.message || "",
              message_count: count || 0,
            };
          })
        );
        setConversations(enriched);
      }
      setLoading(false);
    };
    fetchConversations();

    const channel = supabase
      .channel("messages-tab-convos")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selected) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", selected)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const channel = supabase
      .channel(`messages-tab-${selected}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `conversation_id=eq.${selected}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!input.trim() || !selected || sending) return;
    setSending(true);
    await supabase.from("chat_messages").insert({
      conversation_id: selected,
      sender_type: "agent",
      sender_id: user?.id,
      message: input,
    });
    setInput("");
    setSending(false);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.visitor_name?.toLowerCase().includes(q)) ||
      (c.visitor_email?.toLowerCase().includes(q)) ||
      (c.last_message?.toLowerCase().includes(q))
    );
  });

  const getSenderLabel = (type: string) => {
    if (type === "visitor") return "Customer";
    if (type === "ai") return "AI Bot";
    return "You";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[600px]">
      {/* Conversation list */}
      <div className="card-enhanced rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Conversations</h3>
            <Badge variant="outline" className="text-xs">{conversations.length}</Badge>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 max-h-[500px]">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet.</p>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`w-full text-left p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                  selected === c.id ? "bg-secondary" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate">
                    {c.visitor_name || "Anonymous Visitor"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(c.updated_at), "dd MMM")}
                  </span>
                </div>
                {c.visitor_email && (
                  <p className="text-xs text-muted-foreground mb-1 truncate">{c.visitor_email}</p>
                )}
                {c.last_message && (
                  <p className="text-xs text-muted-foreground truncate">{c.last_message.slice(0, 60)}...</p>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      c.status === "open"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{c.message_count} msgs</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat view */}
      <div className="md:col-span-2 card-enhanced rounded-2xl flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose from the list to view messages</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {conversations.find((c) => c.id === selected)?.visitor_name || "Anonymous Visitor"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {conversations.find((c) => c.id === selected)?.visitor_email || "No email provided"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === "agent" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.sender_type === "ai" && <Bot className="w-3 h-3 text-primary" />}
                      {msg.sender_type === "visitor" && <User className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-[10px] text-muted-foreground">{getSenderLabel(msg.sender_type)}</span>
                      <span className="text-[10px] text-muted-foreground/50">
                        {format(new Date(msg.created_at), "HH:mm")}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-xl text-sm ${
                        msg.sender_type === "agent"
                          ? "bg-primary text-primary-foreground"
                          : msg.sender_type === "ai"
                          ? "bg-accent/10 text-foreground border border-accent/20"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {msg.sender_type === "ai" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0">
                          <ReactMarkdown>{msg.message}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.message
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type a reply..."
                className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button size="sm" onClick={sendReply} disabled={!input.trim() || sending}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
