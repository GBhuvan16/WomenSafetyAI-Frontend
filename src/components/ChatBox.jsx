function ChatBox({ chat }) {
  return (
    <div className="chatbox">
      {chat.map((msg, index) => (
        <div key={index} className={msg.sender}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default ChatBox;