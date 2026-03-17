import { useState } from "react";
import { sendMessage } from "../services/api";

function InputBox({ setChat }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    const response = await sendMessage(message);

    const botMsg = { sender: "bot", text: response };
    setChat((prev) => [...prev, botMsg]);

    setMessage("");
  };

  return (
    <div className="inputArea">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputBox;