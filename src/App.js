import React, { useState, useEffect } from 'react';

const DEPLOYMENT_ID = "AKfvcbyssXPamv24PHisb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const staff = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const inputUser = user.toUpperCase();
    if ((staff.includes(inputUser) && pass === '1234') || (inputUser === 'ADMIN888' && pass === 'HAUS2026')) {
      localStorage.setItem('haus_user_session', inputUser);
      setLoggedInUser(inputUser);
      setIsLoggedIn(true);
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setLoggedInUser('');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        <h1 style={{ fontFamily: 'Noto Serif JP', fontSize: '30px', margin: '20px 0' }}>HAUS IZAKAYA</h1>
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <input placeholder="USER" value={user} onChange={(e) => setUser(e.target.value.toUpperCase())} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #000', textAlign: 'center', fontSize: '18px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="PASSWORD" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #000', textAlign: 'center', fontSize: '18px', boxSizing: 'border-box' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>LOGIN</button>
        </div>
        <footer style={{ marginTop: '100px', color: '#bbb', letterSpacing: '4px', fontSize: '14px' }}>KUNAKORN</footer>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: 'green' }}>LOGIN สำเร็จ</h2>
      <p>ยินดีต้อนรับคุณ: <strong>{loggedInUser}</strong></p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}>LOGOUT</button>
    </div>
  );
}

