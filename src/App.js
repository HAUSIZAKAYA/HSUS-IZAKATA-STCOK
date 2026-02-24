import React, { useState, useEffect } from 'react';

const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  
  // สถานะสำหรับหน้า Stock
  const [stock, setStock] = useState([
    { id: 1, name: 'เบียร์อาซาฮี', qty: 24 },
    { id: 2, name: 'แซลมอน (กก.)', qty: 5 }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const u = user.toUpperCase();
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

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser(''); setPass('');
  };

  // --- 1. หน้าจอ LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        <h1 style={{ fontFamily: 'Noto Serif JP', fontSize: '30px', marginBottom: '30px' }}>HAUS IZAKAYA</h1>
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <input placeholder="USER" value={user} onChange={(e) => setUser(e.target.value.toUpperCase())} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #000', textAlign: 'center' }} />
          <input type="password" placeholder="PASSWORD" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #000', textAlign: 'center' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
        </div>
        <footer style={{ marginTop: '100px', color: '#bbb', fontSize: '12px', letterSpacing: '2px' }}>KUNAKORN</footer>
      </div>
    );
  }

  // --- 2. หน้าจอ STOCK UPDATE (หลัง Login) ---
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>คลังสินค้า: {loggedInUser}</h3>
        <button onClick={handleLogout} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>LOGOUT</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {stock.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <span>{item.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button style={{ padding: '5px 10px' }}>-</button>
              <strong style={{ fontSize: '18px' }}>{item.qty}</strong>
              <button style={{ padding: '5px 10px' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <button style={{ width: '100%', padding: '15px', marginTop: '30px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
        บันทึกข้อมูลเข้า Google Sheets
      </button>
    </div>
  );
}
