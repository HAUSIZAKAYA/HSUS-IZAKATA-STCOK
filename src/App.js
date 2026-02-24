import React, { useState, useEffect } from 'react';

const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";
const SCRIPT_URL = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;

export default function HausStockApp() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  
  // States สำหรับระบบสต็อก
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
      fetchStock(); // ดึงข้อมูลทันทีถ้าล็อกอินอยู่แล้ว
    }
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error("โหลดข้อมูลไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const u = user.toUpperCase();
    const p = pass.toUpperCase();
    if ((u === 'ADMIN888' && p === 'HAUS2026') || (staffList.includes(u) && p === '1234')) {
      localStorage.setItem('haus_user_session', u);
      setLoggedInUser(u);
      setIsLoggedIn(true);
      fetchStock();
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser(''); setPass('');
  };

  // ฟังก์ชันอัปเดตสต็อก (Auto-save)
  const updateQty = async (id, type, delta) => {
    if (isSaving) return;
    
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newBox = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        const newPiece = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        return { ...item, boxQty: newBox, pieceQty: newPiece };
      }
      return item;
    });
    setItems(updatedItems);

    // ส่งข้อมูลบันทึกไป Google Sheets
    setIsSaving(true);
    const targetItem = updatedItems.find(i => i.id === id);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(targetItem)
      });
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px' }}>🏮</div>
          <h1 style={{ fontWeight: '900' }}>HAUS IZAKAYA</h1>
        </div>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '320px' }}>
          <input placeholder="USER" value={user} onChange={(e) => setUser(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="PASSWORD" value={pass} onChange={(e) => setPass(e.target.value)} style={inputStyle} required />
          <button type="submit" style={btnPrimary}>LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#000', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top' }}>
        <span style={{ fontWeight: '900', fontSize: '14px' }}>🏮 HAUS STOCK</span>
        <button onClick={handleLogout} style={{ color: '#ff4444', background: 'none', border: 'none', fontSize: '12px' }}>LOGOUT</button>
      </header>

      {/* Stock List */}
      <main style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <span>พนักงาน: <strong>{loggedInUser}</strong></span>
          <span style={{ fontSize: '10px', color: isSaving ? 'orange' : 'green' }}>{isSaving ? '● บันทึกข้อมูล...' : '● เชื่อมต่อคลาวด์'}</span>
        </div>

        {loading ? <p>กำลังโหลดสต็อก...</p> : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {items.map(item => (
              <div key={item.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <strong style={{ fontSize: '18px' }}>{item.name}</strong>
                  <span style={{ color: '#888', fontSize: '12px' }}>ยอดรวม: { (item.boxQty * (item.perBox || 0)) + item.pieceQty }</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* ลัง (Box) */}
                  <div style={stepperBox}>
                    <span style={{ fontSize: '10px' }}>ลัง (Box)</span>
                    <div style={stepperUI}>
                      <button onClick={() => updateQty(item.id, 'box', -1)} style={stepBtn}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.boxQty}</span>
                      <button onClick={() => updateQty(item.id, 'box', 1)} style={stepBtn}>+</button>
                    </div>
                  </div>
                  {/* ชิ้น (Piece) */}
                  <div style={stepperBox}>
                    <span style={{ fontSize: '10px' }}>ชิ้น (Piece)</span>
                    <div style={stepperUI}>
                      <button onClick={() => updateQty(item.id, 'piece', -1)} style={stepBtn}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.pieceQty}</span>
                      <button onClick={() => updateQty(item.id, 'piece', 1)} style={stepBtn}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Styles ---
const inputStyle = { width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #eee', boxSizing: 'border-box' };
const btnPrimary = { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' };
const stepperBox = { backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '10px', textAlign: 'center' };
const stepperUI = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' };
const stepBtn = { width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' };
