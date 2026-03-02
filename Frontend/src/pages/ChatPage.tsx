import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<"english" | "hindi">("english");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= FIXED STREAM FUNCTION ================= */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "ai", content: "" },
    ]);

    try {
      const formData = new FormData();
      formData.append("message", userMessage);
      formData.append("language", language);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let aiText = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Proper SSE splitting
        const events = chunk.split("\n\n");

        for (let event of events) {
          if (!event.startsWith("data:")) continue;

          const data = event.replace("data:", "").trim();

          if (data === "[DONE]") {
            setLoading(false);
            return;
          }

          aiText += data;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "ai",
              content: aiText,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      setLoading(false);
    }
  };

  /* ================= SMART AUDIO ================= */
  const speak = (text: string) => {
    window.speechSynthesis.cancel();

    const cleaned = text.replace(/[*#_`~]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleaned);

    const voices = window.speechSynthesis.getVoices();

    const selectedVoice =
      language === "hindi"
        ? voices.find((v) => v.lang.includes("hi"))
        : voices.find((v) => v.lang.includes("en"));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = language === "hindi" ? "hi-IN" : "en-US";

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => window.speechSynthesis.pause();
  const resume = () => window.speechSynthesis.resume();
  const stop = () => window.speechSynthesis.cancel();

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  /* ================= UI ================= */
  return (
    <div
      style={{
        background: "#0b0f1a",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* LANGUAGE SELECTOR */}
      <div style={{ padding: "15px", borderBottom: "1px solid #222" }}>
        <label style={{ marginRight: "10px" }}>Language:</label>
        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "english" | "hindi")
          }
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            background: "#1f2437",
            color: "white",
            border: "none",
          }}
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background:
                  msg.role === "user" ? "#ff7a00" : "#1f2437",
                padding: "14px 18px",
                borderRadius: "18px",
                maxWidth: "65%",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {msg.content}

              {msg.role === "ai" && msg.content && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button onClick={() => speak(msg.content)}>🔊</button>
                  <button onClick={pause}>⏸</button>
                  <button onClick={resume}>▶</button>
                  <button onClick={stop}>❌</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ opacity: 0.6 }}>AI is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div
        style={{
          padding: "15px",
          borderTop: "1px solid #222",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: "#1f2437",
            color: "white",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#ff7a00",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;