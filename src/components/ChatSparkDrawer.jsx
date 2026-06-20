import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';

export default function ChatSparkDrawer() {
  const {
    language,
    isChatOpen, openChat, closeChat,
    chatMode, chatMessages, sendChatMessage, connectToRealAgent,
    dict
  } = useAppState();

  const [inputVal, setInputVal] = useState("");
  const [localTyping, setLocalTyping] = useState(false);
  
  const drawerRef = useRef(null);
  const fabRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto scroll chat list to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, localTyping]);

  // Click outside drawer to close
  useEffect(() => {
    if (!isChatOpen) return;
    const handleOutsideClick = (e) => {
      if (
        drawerRef.current && !drawerRef.current.contains(e.target) &&
        fabRef.current && !fabRef.current.contains(e.target) &&
        !e.target.closest('.leaflet-popup')
      ) {
        closeChat();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isChatOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    sendChatMessage(inputVal);
    setInputVal("");

    // Local typing drift simulation
    setLocalTyping(true);
    setTimeout(() => {
      setLocalTyping(false);
    }, 1000);
  };

  const handleQuickClick = (key, text) => {
    sendChatMessage(text);
    setLocalTyping(true);
    setTimeout(() => {
      setLocalTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div ref={fabRef} className="chat-fab-container">
        <button 
          onClick={isChatOpen ? closeChat : openChat} 
          className="chat-fab" 
          aria-label="Ask AI Assistant" 
          title="Ask AI Assistant"
        >
          <span className="material-symbols-outlined">smart_toy</span>
        </button>
      </div>

      {/* Chat drawer */}
      <aside 
        ref={drawerRef}
        className={`drawer-panel chat-drawer ${isChatOpen ? 'open' : ''}`}
      >
        <div className="drawer-header chat-header-gradient">
          <div className="chat-header-info">
            <span className="material-symbols-outlined" id="chatModeIcon">
              {chatMode === "AGENT" ? "support_agent" : "smart_toy"}
            </span>
            <div>
              <h3 className="chat-header-title" id="chatTitle">
                {chatMode === "AGENT" ? (language === "AR" ? "دعم AVEC المباشر" : "AVEC Support") : dict.chatTitle}
              </h3>
              <span className="chat-header-status" id="chatStatus">
                {chatMode === "AGENT" 
                  ? dict.chatStatusAgent 
                  : chatMode === "CONNECTING"
                    ? (language === "AR" ? "جاري الاتصال..." : "Connecting...")
                    : dict.chatStatusOnline
                }
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            {chatMode === "AI" && (
              <button onClick={connectToRealAgent} className="agent-connect-btn" id="btnConnectAgent" title="Connect to Live Agent">
                <span className="material-symbols-outlined">support_agent</span>
                <span id="txtTalkAgent">{dict.txtTalkAgent}</span>
              </button>
            )}
            {chatMode === "CONNECTING" && (
              <button className="agent-connect-btn connected" disabled>
                <span id="txtTalkAgent">{language === "AR" ? "جاري الاتصال..." : "Connecting..."}</span>
              </button>
            )}
            {chatMode === "AGENT" && (
              <button className="agent-connect-btn connected" disabled>
                <span className="material-symbols-outlined">check_circle</span>
                <span id="txtTalkAgent">{language === "AR" ? "متصل" : "Connected"}</span>
              </button>
            )}
            <button onClick={closeChat} className="icon-btn close-chat-btn" aria-label="Close support chat">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Messaging Box */}
        <div ref={scrollRef} className="chat-messages" id="chatMessages">
          {chatMessages.map(m => {
            if (m.sender === "system") {
              return (
                <div key={m.id} className="msg-bubble msg-system">
                  {m.text}
                </div>
              );
            }
            return (
              <div key={m.id} className={`msg-bubble msg-${m.sender}`}>
                {m.text}
              </div>
            );
          })}

          {/* Typing dots */}
          {localTyping && (
            <div className="msg-bubble msg-bot chat-loading-wrapper">
              <div className="chat-loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies chips */}
        {chatMode === "AI" && chatMessages.length > 0 && (
          <div className="chat-quick-replies" id="chatQuickReplies">
            <button 
              onClick={() => handleQuickClick('rates', dict.txtQ1)} 
              className="quick-reply-chip"
            >
              {dict.txtQ1}
            </button>
            <button 
              onClick={() => handleQuickClick('stops', dict.txtQ2)} 
              className="quick-reply-chip"
            >
              {dict.txtQ2}
            </button>
            <button 
              onClick={() => handleQuickClick('limit', dict.txtQ3)} 
              className="quick-reply-chip"
            >
              {dict.txtQ3}
            </button>
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleSubmit} className="chat-input-area" id="chatForm">
          <input 
            type="text" 
            className="chat-input" 
            id="chatInput" 
            placeholder={language === "AR" ? "اسأل عن الأسعار، المحطات..." : "Ask about fares, stops, ratings..."} 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            required
          />
          <button type="submit" className="chat-send-btn" aria-label="Send message">
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </aside>
    </>
  );
}
