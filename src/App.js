import React, { useState, useEffect } from 'react';

const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";

export default function HausStockApp() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // 1. ตรวจสอบ Session เมื่อเปิดแอป
  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault(); // กันหน้าจอรีเฟรชเอง
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    
    const isAdmin = user === 'ADMIN888' && pass === 'HAUS2026';
    const isStaff = staffList.includes(user) && pass === '1234';

    if (isAdmin || isStaff) {
      localStorage.setItem('haus_user_session', user);
      setLoggedInUser(user);
      setIsLoggedIn(true);
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
  };

  // --- 2. หน้าจอ LOGIN (ถ้ายังไม่ล็อกอิน) ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🏮</div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>HAUS IZAKAYA</h1>
          <p style={{ margin: 0, fontSize: '10px', color: '#888', letterSpacing: '4px' }}>STOCK MANAGEMENT</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '320px' }}>
          <input 
            type="text" 
            placeholder="USER"
            value={user}
            onChange={(e) => setUser(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #eee', fontSize: '16px', textAlign: 'center', boxSizing: 'border-box', backgroundColor: '#f9f9f9' }}
            required
          />
          <input 
            type="password" 
            placeholder="••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '12px', border: '1px solid #eee', fontSize: '16px', textAlign: 'center', boxSizing: 'border-box', backgroundColor: '#f9f9f9' }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            LOGIN
          </button>
        </form>

        <p style={{ marginTop: '40px', fontSize: '10px', color: '#ccc', letterSpacing: '2px' }}>BY KUNAKORN</p>
      </div>
    );
  }

  // --- 3. หน้าจอหลัก (หลัง LOGIN สำเร็จ) ---
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd' }}>
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
      <h2 style={{ margin: '0 0 10px 0' }}>LOGIN สำเร็จ</h2>
      <p style={{ color: '#666' }}>ยินดีต้อนรับคุณ: <strong style={{ color: '#000' }}>{loggedInUser}</strong></p>
      
      <div style={{ margin: '30px auto', padding: '20px', border: '1px dashed #ccc', borderRadius: '15px', maxWidth: '300px', backgroundColor: '#fff' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px 0' }}>สถานะ: ระบบจำ Session แล้ว</p>
        <p style={{ fontSize: '10px', color: '#aaa', wordBreak: 'break-all' }}>Deployment ID: {DEPLOYMENT_ID}</p>
      </div>

      <button 
        onClick={handleLogout}
        style={{ marginTop: '20px', padding: '12px 25px', borderRadius: '10px', border: '1px solid #ff4444', backgroundColor: 'transparent', color: '#ff4444', fontWeight: 'bold', cursor: 'pointer' }}
      >
        LOGOUT (ออกจากระบบ)
      </button>
    </div>
  );
}
