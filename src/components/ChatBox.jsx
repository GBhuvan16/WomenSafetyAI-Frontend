function ChatBox({ chat }) {
  return (
    <div className="chatbox">
      {chat.length === 0 ? (
        <div className="emptyState">👋 Start a conversation!</div>
      ) : (
        chat.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
}

export default ChatBox;