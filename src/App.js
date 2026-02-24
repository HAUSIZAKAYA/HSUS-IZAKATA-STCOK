import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('haus_session');
    if (saved) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    const staff = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    if ((staff.includes(user.toUpperCase()) && pass === '1234') || (user.toUpperCase() === 'ADMIN888' && pass === 'HAUS2026')) {
      localStorage.setItem('haus_session', user);
      setIsLoggedIn(true);
    } else { 
      alert('USER หรือ PASSWORD ไม่ถูกต้อง'); 
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        <h1 style={{ fontFamily: 'Noto Serif JP', fontSize: '30px', margin: '20px 0' }}>HAUS IZAKAYA</h1>
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <input placeholder="USER" value={user} onChange={(e) => setUser(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #000', textAlign: 'center', fontSize: '18px' }} />
          <input type="password" placeholder="PASSWORD" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #000', textAlign: 'center', fontSize: '18px' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px' }}>LOGIN</button>
        </div>
        <footer style={{ marginTop: '100px', color: '#bbb', letterSpacing: '4px', fontSize: '14px' }}>KUNAKORN</footer>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>ยินดีต้อนรับสู่ระบบสต็อก</h1>
      <p>คุณกำลังใช้งานในชื่อ: {user}</p>
      <button onClick={() => { localStorage.removeItem('haus_session'); setIsLoggedIn(false); }} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>LOGOUT</button>
    </div>
  );
}
