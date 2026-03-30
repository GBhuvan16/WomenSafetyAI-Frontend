import { useState } from "react";
import "./App.css";
import Map from "./Map";

let watchId = null;

// ✅ CHANGE 1: Use deployed backend (NOT localhost)
const API = "https://womensafetyai-7.onrender.com";

// 📞 Call Police
const callEmergency = () => {
  window.open("tel:100");
};

function App() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  
  const handleSOS = () => {

    callEmergency();

    watchId = navigator.geolocation.watchPosition(
      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const link = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        const message = `🚨 EMERGENCY!\n📍 ${link}`;

        const phone = "917075526273";

        // ✅ CHANGE 2: Send to backend FIRST
        fetch(`${API}/location`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ lat, lng })
        })
        .then(() => console.log("Location sent"))
        .catch(() => console.log("Location error"));

        // ✅ THEN open WhatsApp
        if (!window.sosSent) {
          window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
          );
          window.sosSent = true;
        }

      },
      () => alert("❌ Location error"),
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  };

  // 🛑 STOP SOS
  const stopSOS = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      window.sosSent = false;
      alert("🛑 Tracking stopped");
    }
  };

  // 💬 SEND MESSAGE
  const sendToServer = async (msg) => {

    console.log("Sending:", msg); // ✅ DEBUG

    setMessages(prev => [...prev, { text: msg, type: "user" }]);

    // ✅ CHANGE 3: Show loading (for Render delay)
    setMessages(prev => [...prev, { text: "⏳ Waiting for server...", type: "bot" }]);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg })
      });

      console.log("Response received"); // ✅ DEBUG

      const data = await res.text();

      console.log("Data:", data); // ✅ DEBUG

      setMessages(prev => [...prev, { text: data, type: "bot" }]);

      const lowerMsg = msg.toLowerCase();

      if (
        data.toLowerCase().includes("sos") ||
        lowerMsg.includes("help") ||
        lowerMsg.includes("danger") ||
        lowerMsg.includes("sos") ||
        lowerMsg.includes("emergency")
      ) {
        handleSOS();
      }

    } catch (error) {
      console.log("ERROR:", error); // ✅ DEBUG
      alert("❌ Backend not responding");
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

      <div className="header">
        🚨 Smart Safety AI
      </div>

      <div className="chatbox">
        {messages.map((msg, i) => (
          <div key={i} className={msg.type}>
            {msg.text}
          </div>
        ))}
      </div>

      <Map />

      <div className="buttonGroup">

        <button className="sosButton" onClick={handleSOS}>
          🚨
        </button>

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