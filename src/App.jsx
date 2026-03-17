import { useState } from "react";
import "./App.css";
import MapComponent from "./Map";
import { sendMessage } from "./services/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(input);
      const botMsg = { text: data, type: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Could not reach server. Try again.", type: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const link = `https://maps.google.com/?q=${lat},${lng}`;
        const message = `🚨 EMERGENCY! I need help. I'm in danger 🆘.\nMy location: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
      },
      (err) => {
        alert("Location access denied. Please enable location permissions.");
        console.error("Geolocation error:", err);
      }
    );
  };

  return (
    <div className="container">
      <div className="header">🚨 SAFETY AI ASSISTANT</div>

      <div className="chatbox">
        {messages.length === 0 && (
          <div className="emptyState">
            👋 Hi! How can I help you stay safe today?
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={msg.type}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="bot">...</div>}
      </div>

      <MapComponent />

      <button className="sosButton" onClick={handleSOS}>
        🚨 SOS — Send Emergency Alert
      </button>

      <div className="inputArea">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;