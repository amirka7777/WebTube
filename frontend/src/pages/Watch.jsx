import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function Watch({ token, user, onLogout, setUser }) {
  const [activeTab, setActiveTab] = useState('chat'); 
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chat`);
      setMessages(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке чата:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/chat`,
        { text: newMessageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, response.data]);
      setNewMessageText('');
    } catch (err) {
      alert('Не удалось отправить сообщение');
    }
  };

  const handleEditName = async () => {
    const newName = prompt('Введите новое имя в чате:', user?.chat_name || user?.first_name);
    if (!newName || !newName.trim()) return;

    try {
      const response = await axios.put(
        `${API_URL}/api/user/update-chat-name`,
        { chatName: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      fetchMessages(); 
    } catch (err) {
      alert('Не удалось обновить имя');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>БЮРО 1440</div>
        <div style={styles.headerRight}>
          {token && user ? (
            <>
              <span style={styles.username}>{user.first_name || 'Имя пользователя'}</span>
              <button onClick={onLogout} style={styles.logoutBtn}>Выйти</button>
            </>
          ) : (
            <span onClick={() => navigate('/auth')} style={styles.loginLink}>Регистрация</span>
          )}
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.playerContainer}>
          <video 
            src={`${API_URL}/api/video/stream`} 
            controls 
            style={styles.videoPlayer}
          />
        </div>

        <div style={styles.sidebar}>
          <div style={styles.sidebarTabs}>
            <span style={{...styles.sidebarTab, ...(activeTab === 'chat' ? styles.activeSidebarTab : {})}} onClick={() => setActiveTab('chat')}>Чат</span>
            <span style={{...styles.sidebarTab, ...(activeTab === 'qa' ? styles.activeSidebarTab : {})}} onClick={() => setActiveTab('qa')}>Вопрос / ответ</span>
          </div>

          {activeTab === 'chat' ? (
            <div style={styles.chatSection}>
              <div style={styles.messagesList}>
                {messages.map((msg) => (
                  <div key={msg.id} style={styles.messageCard}>
                    <div>
                      <div style={styles.messageUser}>{msg.user}</div>
                      <div style={styles.messageText}>{msg.text}</div>
                    </div>
                    <div style={styles.likesBlock}><span>♥</span> {msg.likes}</div>
                  </div>
                ))}
              </div>

              <div style={styles.sidebarFooter}>
                {token && user ? (
                  <form onSubmit={handleSendMessage} style={styles.sendForm}>
                    <textarea 
                      placeholder="Текст"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      style={styles.chatTextarea}
                    />
                    <button type="submit" style={styles.sendBtn}>Отправить</button>
                    <div style={styles.chatNameRow}>
                      <span>Имя: {user.chat_name || user.first_name}</span>
                      <span onClick={handleEditName} style={styles.editLink}>Ред.</span>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => navigate('/auth')} style={styles.guestBanner}>
                    Хотите отправить сообщение?<br />Кликните сюда
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.qaPlaceholder}>Раздел вопросов пока пуст.</div>
          )}
        </div>
      </main>
    </div>
  );
}


const styles = { };

export default Watch;