import React, { useState, useEffect } from 'react';
import { Lock, User, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';

const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // 1. ระบบจำ Session (Refresh แล้วไม่หลุด)
  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    
    const inputUser = username.toUpperCase();
    const inputPass = password.toUpperCase();

    const isAdmin = inputUser === 'ADMIN888' && inputPass === 'HAUS2026';
    const isStaff = staffList.includes(inputUser) && inputPass === '1234';

    if (isAdmin || isStaff) {
      localStorage.setItem('haus_user_session', inputUser);
      setLoggedInUser(inputUser);
      setIsLoggedIn(true);
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // --- หน้าจอ LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏮</div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 5px 0', color: '#000' }}>HAUS IZAKAYA</h1>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '30px', letterSpacing: '2px' }}>STOCK MANAGEMENT</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="USER" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #DDD', fontSize: '16px', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
                required
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <input 
                type="password" 
                placeholder="PASSWORD" 
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #DDD', fontSize: '16px', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
                required
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#000', color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
              LOGIN
            </button>
          </form>

          <p style={{ marginTop: '30px', fontSize: '10px', color: '#CCC', letterSpacing: '3px' }}>BY KUNAKORN</p>
        </div>
      </div>
    );
  }

  // --- หน้าจอหลักหลัง LOGIN สำเร็จ ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#FFF', padding: '30px', fontFamily: 'sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ marginBottom: '20px', color: '#FFB800' }}>
        <ShieldCheck size={64} />
      </div>
      
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>LOGIN สำเร็จ</h2>
      <p style={{ fontSize: '18px', color: '#AAA', marginBottom: '5px' }}>ยินดีต้อนรับคุณ: <span style={{ color: '#FFB800', fontWeight: 'bold' }}>{loggedInUser}</span></p>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '30px' }}>Deployment ID: {DEPLOYMENT_ID}</p>

      <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222', width: '100%', maxWidth: '300px', marginBottom: '40px' }}>
        <p style={{ fontSize: '12px', color: '#00FF00' }}>● ระบบจำ Session แล้ว</p>
        <p style={{ fontSize: '12px', color: '#888' }}>พี่ลอง Refresh หน้าจอได้เลยครับ ไม่หลุดแน่นอน</p>
      </div>

      <button 
        onClick={handleLogout}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', backgroundColor: 'transparent', color: '#FF4B4B', border: '2px solid #FF4B4B', borderRadius: '15px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        <LogOut size={18} /> ออกจากระบบ (LOGOUT)
      </button>
    </div>
  );
}
