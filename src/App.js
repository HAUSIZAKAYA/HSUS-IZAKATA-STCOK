import React, { useState, useEffect } from 'react';
const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";
export default function HausStockApp() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
 // 1. ระบบจำการล็อกอิน (Session Persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);
 const handleLogin = () => {
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const isAdmin = user === 'ADMIN888' && pass === 'HAUS2026';
    const isStaff = staffList.includes(user) && pass === '1234';
 if (isAdmin || isStaff) {
      localStorage.setItem('haus_user_session', user);
      setLoggedInUser(user);
      setIsLoggedIn(true);
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้อง');
    }
  };
const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
  };
// --- หน้าจอ LOGIN (แบบคลีน) ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px' }}>HAUS IZAKAYA</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>STOCK MANAGEMENT</p>
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <input 
            type="text"
            placeholder="USER"
            value={user}
            onChange={(e) => setUser(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #000', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box' }}
          />
          <input 
            type="password"
            placeholder="••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #000', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box' }}
          />
          <button 
            onClick={handleLogin}
            style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer' }}
          >
            LOGIN
          </button>
        </div>
        <p style={{ marginTop: '50px', color: '#ccc', fontSize: '12px' }}>KUNAKORN</p>
      </div>
    );
  }
  // --- หน้าจอหลัง LOGIN สำเร็จ ---
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2 style={{ color: '#2ecc71' }}>✅ LOGIN สำเร็จ</h2>
      <p style={{ fontSize: '20px', margin: '10px 0' }}>คุณ: <strong>{loggedInUser}</strong></p>
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px', fontSize: '14px', color: '#666' }}>
        <p>สถานะ: ระบบจำ Session แล้ว</p>
        <p>ID: {DEPLOYMENT_ID}</p>
      </div>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 25px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        LOGOUT (ออกจากระบบ)
      </button>
    </div>
  );
}
