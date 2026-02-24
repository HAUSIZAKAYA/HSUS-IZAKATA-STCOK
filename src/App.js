import React, { useState, useEffect } from 'react';

// --- หัวใจสำคัญ: การเชื่อมต่อระบบหลังบ้าน
const DEPLOYMENT_ID = "AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g";

export default function HausStockApp() {
  // 1. State สำหรับระบบ Login
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // 2. State สำหรับระบบสต็อก
  const [items, setItems] = useState([]); // เก็บรายการสินค้า
  const [loading, setLoading] = useState(false); // สถานะการโหลดข้อมูล
  const [searchTerm, setSearchTerm] = useState(''); // เก็บคำค้นหา
  const [updatingId, setUpdatingId] = useState(null); // เช็คว่าบรรทัดไหนกำลังอัปเดต

  // ตรวจสอบ Session เมื่อเปิดแอป
  useEffect(() => {
    const savedUser = localStorage.getItem('haus_user_session');
    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // 3. ฟังก์ชันดึงข้อมูลสต็อก (Fetch Data)
  const fetchStock = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec?action=getStocks`);
      const data = await resp.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // เรียกข้อมูลเมื่อ Login สำเร็จ
  useEffect(() => {
    if (isLoggedIn) fetchStock();
  }, [isLoggedIn]);

  // 4. ฟังก์ชันจัดการการ Login
  const handleLogin = () => {
    const staffList = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const u = user.trim().toUpperCase();
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
    setUser('');
    setPass('');
  };

  // 5. ฟังก์ชันอัปเดตสต็อก (Update Stock)
  const updateQty = async (id, newQty) => {
    if (newQty < 0) return;
    setUpdatingId(id);
    try {
      await fetch(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`, {
        method: 'POST',
        body: JSON.stringify({ action: 'update', id, qty: newQty })
      });
      // อัปเดตข้อมูลใน UI ทันที
      setItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
    } catch (err) {
      alert("อัปเดตไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setUpdatingId(null);
    }
  };

  // กรองข้อมูลตาม Search Term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- UI: หน้า LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ letterSpacing: '2px' }}>HAUS IZAKAYA</h1>
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <input placeholder="USER" value={user} onChange={(e) => setUser(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="PASSWORD" value={pass} onChange={(e) => setPass(e.target.value)} style={inputStyle} />
          <button onClick={handleLogin} style={buttonStyle}>LOGIN</button>
        </div>
      </div>
    );
  }

  // --- UI: หน้า Dashboard จัดการสต็อก ---
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>สต็อกสินค้า 🍶</h2>
        <button onClick={handleLogout} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Logout ({loggedInUser})</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="🔍 ค้นหาสินค้า..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={fetchStock} style={{ padding: '10px', cursor: 'pointer' }}>🔄</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>กำลังโหลดข้อมูล...</p>
      ) : (
        <div style={{ background: '#f9f9f9', borderRadius: '10px', overflow: 'hidden' }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>คงเหลือ: <span style={{ color: item.qty < 5 ? 'red' : 'green', fontWeight: 'bold' }}>{item.qty}</span> {item.unit}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={updatingId === item.id} style={qtyBtn}>-</button>
                <button onClick={() => updateQty(item.id, item.qty + 1)} disabled={updatingId === item.id} style={qtyBtn}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// สไตล์เสริม
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const qtyBtn = { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#fff' };
