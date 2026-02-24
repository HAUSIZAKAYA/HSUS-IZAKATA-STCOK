import React, { useState, useEffect } from 'react'; // แก้ไข Import เป็นตัวพิมพ์เล็ก

// รหัสเชื่อมต่อระบบหลังบ้าน
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
    const u = user.trim().toUpperCase(); // เพิ่ม .trim() เพื่อตัดช่องว่างที่อาจติดมา
    
    // ตรวจสอบ Admin และ Staff
    const isAdmin = u === 'ADMIN888' && pass === 'HAUS2026';
    const isStaff = staffList.includes(u) && pass === '1234';

    if (isAdmin || isStaff) {
      localStorage.setItem('haus_user_session', u);
      setLoggedInUser(u);
      setIsLoggedIn(true);
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้อง');
    }
  };

  // ฟังก์ชันเสริม: กด Enter เพื่อ Login
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
  };

  // --- ส่วนหน้าจอ LOGIN (UI) ---
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        
        <h1 style={{ fontFamily: 'Noto Serif JP', fontSize: '30px', margin: '20px 0' }}>HAUS IZAKAYA</h1>
        
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <input 
            placeholder="USER" 
            value={user} 
            onChange={(e) => setUser(e.target.value.toUpperCase())} 
            onKeyDown={handleKeyDown}
            style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #000', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box' }} 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            onKeyDown={handleKeyDown}
            style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #000', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box' }} 
          />
          <button 
            onClick={handleLogin} 
            style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
          >
            LOGIN
          </button>
        </div>
        
        <footer style={{ marginTop: '100px', color: '#bbb', letterSpacing: '4px', fontSize: '14px' }}>KUNAKORN</footer>
      </div>
    );
  }

  // --- ส่วนหน้าจอเมื่อเข้าสู่ระบบสำเร็จ ---
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: 'green' }}>LOGIN สำเร็จ</h2>
      <p style={{ fontSize: '18px' }}>ยินดีต้อนรับคุณ: <strong>{loggedInUser}</strong></p>
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>ID: {DEPLOYMENT_ID}</div>
      <button 
        onClick={handleLogout} 
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        LOGOUT
      </button>
    </div>
  );
}
