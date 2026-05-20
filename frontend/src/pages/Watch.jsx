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


const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 40px 40px 40px',
  },
  header: {
    height: '90px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '2px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  username: {
    fontSize: '15px',
    color: '#ffffff',
    marginRight: '4px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1.5px solid #ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
  },
  avatarClickable: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1.5px solid #ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
    cursor: 'pointer',
  },
  loginLink: {
    fontSize: '15px',
    cursor: 'pointer',
    color: '#ffffff',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    marginLeft: '8px',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    gap: '0px',
    alignItems: 'stretch',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
  },
  playerContainer: {
    flex: 7,
    background: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
  sidebar: {
    flex: 3,
    background: '#151515',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #252525',
  },
  sidebarTabs: {
    display: 'flex',
    gap: '20px',
    padding: '20px 20px 10px 20px',
    borderBottom: '1px solid #222222',
  },
  sidebarTab: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    paddingBottom: '8px',
    borderBottom: '2px solid transparent',
  },
  activeSidebarTab: {
    color: '#ffffff',
    borderBottom: '2px solid #1d2cb4',
  },
  chatSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    maxHeight: '45vh',
  },
  messageCard: {
    background: '#202020',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  messageUser: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
  },
  messageText: {
    fontSize: '15px',
    color: '#ffffff',
  },
  likesBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    marginTop: '2px',
  },
  heartIcon: {
    fontSize: '14px',
    cursor: 'pointer',
  },
  likesCount: {},
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #222222',
    background: '#1a1a1a',
  },
  guestBanner: {
    width: '100%',
    background: '#1d2cb4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  sendForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  chatTextarea: {
    width: '85%',
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '16px',
    padding: '12px 36px 12px 12px',
    fontSize: '14px',
    outline: 'none',
    resize: 'none',
  },
  emojiIcon: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    color: '#aaaaaa',
    cursor: 'pointer',
    fontSize: '16px',
  },
  sendBtn: {
    width: '100%',
    background: '#1d2cb4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  chatNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '4px',
  },
  editLink: {
    color: '#1d2cb4',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  qaPlaceholder: {
    padding: '20px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
  }
};

export default Watch;