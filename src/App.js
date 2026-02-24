import React, { useState, useEffect } from 'react';

const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";

export default function HausStockApp() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // 1. ระบบจำการล็อกอิน (Session)
  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const u = user.toUpperCase();
    const p = pass.toUpperCase();

    const isAdmin = u === 'ADMIN888' && p === 'HAUS2026';
    const isStaff = staffList.includes(u) && p === '1234';

    if (isAdmin || isStaff) {
      localStorage.setItem('haus_user_session', u);
      setLoggedInUser(u);
      setIsLoggedIn(true);
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่ต้มจืด!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
  };

  // --- 2. หน้าจอ LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px' }}>🏮</div>
          <h1 style={{ margin: '10px 0', fontSize: '24px', fontWeight: '900' }}>HAUS IZAKAYA</h1>
          <p style={{ color: '#888', fontSize: '10px', letterSpacing: '4px' }}>STOCK MANAGEMENT</p>
        </div>

        <div style={{ width: '100%', maxWidth: '320px' }}>
          <input 
            type="text" placeholder="USER" value={user}
            onChange={(e) => setUser(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <input 
            type="password" placeholder="PASSWORD" value={pass}
            onChange={(e) => setPass(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <button 
            onClick={handleLogin}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            LOGIN
          </button>
        </div>
        <p style={{ marginTop: '40px', fontSize: '10px', color: '#ccc' }}>BY KUNAKORN</p>
      </div>
    );
  }

  // --- 3. หน้าจอหลัก (หลัง LOGIN สำเร็จ) ---
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '50px' }}>✅</div>
      <h2>LOGIN สำเร็จ</h2>
      <p>ยินดีต้อนรับคุณ: <strong>{loggedInUser}</strong></p>
      <div style={{ margin: '30px auto', padding: '20px', border: '1px dashed #ccc', borderRadius: '15px', maxWidth: '300px' }}>
        <p style={{ fontSize: '12px', color: '#888' }}>Deployment ID: {DEPLOYMENT_ID}</p>
      </div>
      <button 
        onClick={handleLogout}
        style={{ padding: '12px 25px', borderRadius: '10px', border: '1px solid #ff4444', color: '#ff4444', backgroundColor: 'transparent', fontWeight: 'bold' }}
      >
        LOGOUT
      </button>
    </div>
  );
}
