import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function Auth({ onLogin }) {
  const [activeTab, setActiveTab] = useState('register');
  

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (activeTab === 'register') {
       
        const response = await axios.post(`${API_URL}/api/auth/register`, {
          email,
          firstName,
          lastName
        });
        
        
        onLogin(response.data.token, response.data.user);
        navigate('/watch');
      } else {
       
        const response = await axios.post(`${API_URL}/api/auth/code`, {
          email
        });
        
        onLogin(response.data.token, response.data.user);
        navigate('/watch');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Произошла ошибка при подключении к серверу');
      }
    }
  };

  return (
    <div style={styles.container}>
      {}
      <div style={styles.logo}>YADRO</div>

      {}
      <div style={styles.tabContainer}>
        <span 
          style={{
            ...styles.tab, 
            ...(activeTab === 'register' ? styles.activeTab : {})
          }}
          onClick={() => { setActiveTab('register'); setError(''); setMessage(''); }}
        >
          Регистрация
        </span>
        <span 
          style={{
            ...styles.tab, 
            ...(activeTab === 'code' ? styles.activeTab : {})
          }}
          onClick={() => { setActiveTab('code'); setError(''); setMessage(''); }}
        >
          Код доступа
        </span>
      </div>

      {/* Карточка формы */}
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}
          {message && <div style={styles.successAlert}>{message}</div>}

          {activeTab === 'register' ? (
            <>
              <div style={styles.sectionTitle}>Данные для авторизации</div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Электронная почта</label>
                <div style={styles.inputWrapper}>
                  <input 
                    type="email" 
                    required
                    placeholder="my_email@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                  <span style={styles.asterisk}>*</span>
                </div>
              </div>

              <div style={styles.sectionTitle}>Прочие данные</div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Фамилия</label>
                <div style={styles.inputWrapper}>
                  <input 
                    type="text" 
                    required
                    placeholder="Ваша фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={styles.input}
                  />
                  <span style={styles.asterisk}>*</span>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Имя</label>
                <div style={styles.inputWrapper}>
                  <input 
                    type="text" 
                    required
                    placeholder="Ваше имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={styles.input}
                  />
                  <span style={styles.asterisk}>*</span>
                </div>
              </div>

              <button type="submit" style={styles.button}>Отправить</button>
              <div style={styles.footerText}>* поле, обязательное для заполнения</div>
            </>
          ) : (
            <>
              <div style={styles.infoText}>Укажите электронную почту для восстановления кода</div>
              <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                  <input 
                    type="email" 
                    required
                    placeholder="mail@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" style={styles.button}>Отправить код</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}


const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '20px',
  },
  logo: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '2px'
  },
  tabContainer: {
    display: 'flex',
    gap: '30px',
    marginBottom: '24px',
  },
  tab: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    paddingBottom: '6px',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#ffffff',
    fontWeight: '500',
    borderBottom: '2px solid #ffffff',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '440px',
    padding: '32px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    color: '#1a1a1a',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    marginTop: '8px',
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#4a4a4a',
    fontSize: '13px',
    marginBottom: '6px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#f0f2f8',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#333333',
    outline: 'none',
  },
  asterisk: {
    position: 'absolute',
    right: '16px',
    color: '#b0b8c9',
    fontSize: '16px',
  },
  button: {
    background: '#1d2cb4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.2s ease',
  },
  footerText: {
    color: '#8a92a6',
    fontSize: '12px',
    marginTop: '12px',
    textAlign: 'left',
  },
  infoText: {
    color: '#4a4a4a',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  errorAlert: {
    background: '#ffe3e3',
    color: '#ea0000',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  successAlert: {
    background: '#e3ffea',
    color: '#008a11',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center',
  }
};

export default Auth;