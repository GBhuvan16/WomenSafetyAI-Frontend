import { useState } from "react";
import "./App.css";
import Map from "./Map";

let watchId = null;

// ✅ YOUR DEPLOYED BACKEND
const API = "https://womensafetyai-7.onrender.com";

const callEmergency = () => {
  window.open("tel:100");
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  // 🚨 SOS FUNCTION
  const handleSOS = () => {
    callEmergency();

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const link = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        const message = `🚨 EMERGENCY!\n📍 ${link}`;
        const phone = "917075526273";

        // ✅ SEND LOCATION TO BACKEND
        fetch(`${API}/location`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors", // ✅ IMPORTANT
          body: JSON.stringify({ lat, lng }),
        })
          .then(() => console.log("Location sent"))
          .catch(() => console.log("Location error"));

        // ✅ WHATSAPP SEND ONCE
        if (!sosSent) {
          window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
          );
          setSosSent(true);
        }
      },
      () => alert("❌ Location error"),
      { enableHighAccuracy: true }
    );
  };

  // 🛑 STOP SOS
  const stopSOS = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      setSosSent(false);
      alert("🛑 Tracking stopped");
    }
  };

  // 💬 SEND MESSAGE
  const sendToServer = async (msg) => {
    setMessages((prev) => [
      ...prev,
      { text: msg, type: "user" },
      { text: "⏳ Waiting...", type: "bot" },
    ]);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors", // ✅ IMPORTANT FIX
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.text();

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // remove loading
        return [...updated, { text: data, type: "bot" }];
      });

      const lower = msg.toLowerCase();

      if (
        data.toLowerCase().includes("sos") ||
        lower.includes("help") ||
        lower.includes("danger") ||
        lower.includes("emergency")
      ) {
        handleSOS();
      }
    } catch (error) {
      alert("❌ Backend not responding");

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { text: "Server error", type: "bot" }];
      });
    }
  };

  const sendMessage = () => {
    if (!input) return;
    sendToServer(input);
    setInput("");
  };

  // 🎤 VOICE
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Chrome");
      return;
    }

    const recognition = new SpeechRecognition();

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setListening(false);
      sendToServer(voiceText);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Voice error");
    };
  };

  return (
    
  <div className="container">
    
    {/* HEADER */}
    <div className="header">
      🚨 Smart Safety AI
      <div style={{ fontSize: "12px", opacity: 0.7 }}>
        Your personal safety companion
      </div>
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
    <Map />

    {/* BUTTONS */}
    <div className="buttonGroup">
      <button
        className={`voiceButton ${listening ? "listening" : ""}`}
        onClick={startListening}
      >
        🎤
      </button>

      <button className="stopButton" onClick={stopSOS}>
        🛑
      </button>
    </div>

    {/* FLOATING SOS */}
    <button className="floatingSOS" onClick={handleSOS}>
      🚨
    </button>

    {/* INPUT */}
    <div className="inputArea">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type or speak..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>

  );
}

export default App;