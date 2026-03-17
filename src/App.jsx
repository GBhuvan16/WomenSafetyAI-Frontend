import { useState } from "react";
import "./App.css";
import MapComponent from "./Map";

function App() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { text: input, type: "user" };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.text();

      const botMsg = { text: data, type: "bot" };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const link = `https://maps.google.com/?q=${lat},${lng}`;

      const message = `🚨 EMERGENCY! I need help .I'm in danger🆘.\nMy location: ${link}`;

      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);

    });
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        🚨 SAFETY AI ASSISTANT
      </div>

      {/* CHAT */}
      <div className="chatbox">
        {messages.map((msg, i) => (
          <div key={i} className={msg.type}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* MAP */}
      <MapComponent />

      {/* SOS BUTTON */}
      <button className="sosButton" onClick={handleSOS}>
        🚨 SOS
      </button>

      {/* INPUT */}
      <div className="inputArea">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}

export default App;