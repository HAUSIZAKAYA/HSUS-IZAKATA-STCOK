import React, { useState, useEffect } from 'react';

// --- รหัสเชื่อมต่อเดิมของพี่ ตรวจสอบแล้วว่าถูกต้อง ---
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
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
  };

  // --- 2. ส่วนแสดงผลหน้าจอ LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🏮</div>
          <h1 style={{ fontFamily: 'Noto Serif JP', margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '2px', color: '#000' }}>HAUS IZAKAYA</h1>
          <p style={{ margin: 0, fontSize: '10px', color: '#888', letterSpacing: '4px' }}>STOCK MANAGEMENT</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '320px' }}>
          <input 
            type="text" 
            placeholder="USER"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #000', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box', backgroundColor: '#fff', outline: 'none' }}
            required
          />
          <input 
            type="password" 
            placeholder="••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '12px', border: '1px solid #000', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box', backgroundColor: '#fff', outline: 'none' }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            LOGIN
          </button>
        </form>

        <p style={{ marginTop: '100px', fontSize: '12px', color: '#bbb', letterSpacing: '4px' }}>KUNAKORN</p>
      </div>
    );
  }

  // --- 3. ส่วนแสดงผลหน้าจอ Dashboard (หลัง Login) ---
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '50px', marginBottom: '15px' }}>✅</div>
      <h2 style={{ margin: '0 0 10px 0', fontWeight: '900' }}>LOGIN สำเร็จ</h2>
      <p style={{ color: '#666', margin: 0 }}>ยินดีต้อนรับคุณ: <strong style={{ color: '#000' }}>{loggedInUser}</strong></p>
      
      <div style={{ margin: '30px auto', padding: '25px', border: '1px dashed #ddd', borderRadius: '20px', width: '100%', maxWidth: '320px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
        <p style={{ fontSize: '12px', color: '#00c853', fontWeight: 'bold', margin: '0 0 10px 0' }}>● ระบบจำ Session เรียบร้อย</p>
        <p style={{ fontSize: '11px', color: '#999', margin: '0 0 15px 0', lineHeight: '1.5' }}>พี่ลอง Refresh หน้าจอได้เลยครับ ข้อมูลไม่หลุดแน่นอน</p>
        <div style={{ fontSize: '9px', color: '#ccc', wordBreak: 'break-all', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
          Deployment ID: {DEPLOYMENT_ID}
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{ marginTop: 'auto', padding: '15px 30px', borderRadius: '12px', border: '1px solid #ff5252', backgroundColor: 'transparent', color: '#ff5252', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
      >
        LOGOUT (ออกจากระบบ)
      </button>
    </div>
  );
}
