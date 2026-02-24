const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
    setItems([]);
  };

  // ==========================================
  // 3. FETCH & AUTO-SAVE SYSTEM (ระบบดึงข้อมูลและบันทึกอัตโนมัติ)
  // ==========================================
  const fetchStock = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}?action=getStocks`);
      const data = await resp.json();
      // สมมติว่า API ส่งข้อมูลมาเป็น Array ของ Object
      // ถ้า API ยังไม่มีฟิลด์ boxQty, pieceQty, category ระบบจะสร้างค่าเริ่มต้นให้
      const formattedData = data.map(item => ({
        ...item,
        boxQty: item.boxQty || 0,
        pieceQty: item.pieceQty || 0,
        category: item.category || (item.name.includes('เหล้า') || item.name.includes('เบียร์') ? 'บาร์น้ำ' : 'ครัว')
      }));
      setItems(formattedData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchStock();
  }, [isLoggedIn]);

  // ฟังก์ชัน Auto-Save เมื่อกดบวก/ลบ
  const updateQty = async (id, type, operation) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const itemIndex = newItems.findIndex(i => i.id === id);
      if (itemIndex === -1) return prevItems;

      const item = newItems[itemIndex];
      let newValue = type === 'box' ? item.boxQty : item.pieceQty;

      if (operation === 'add') newValue += 1;
      if (operation === 'sub' && newValue > 0) newValue -= 1;

      if (type === 'box') item.boxQty = newValue;
      if (type === 'piece') item.pieceQty = newValue;

      // เรียก Auto-Save ไปยัง Google Sheets
      triggerAutoSave(id, item.boxQty, item.pieceQty);

      return newItems;
    });
  };

  const triggerAutoSave = async (id, boxQty, pieceQty) => {
    setSavingId(id);
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'update', 
          id: id, 
          boxQty: boxQty, 
          pieceQty: pieceQty,
          updatedBy: loggedInUser 
        })
      });
    } catch (err) {
      console.error("Auto-Save Error:", err);
    } finally {
      setTimeout(() => setSavingId(null), 1000); // แสดงสถานะ "บันทึกแล้ว" 1 วินาที
    }
  };

  // ==========================================
  // 4. UI: LOGIN SCREEN (หน้าล็อกอิน)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        
        <h1 style={{ fontFamily: '"Noto Serif JP", serif', fontSize: '32px', letterSpacing: '2px', marginBottom: '40px', color: '#111' }}>
          HAUS IZAKAYA
        </h1>
        
        <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
          <input 
            placeholder="USER" 
            value={user} 
            // บังคับพิมพ์ใหญ่เสมอ
            onChange={(e) => setUser(e.target.value.toUpperCase())} 
            style={inputStyle} 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            style={inputStyle} 
          />
          <button onClick={handleLogin} style={buttonStyle}>LOGIN</button>
        </div>
        
        {/* เครดิตผู้สร้าง */}
        <footer style={{ marginTop: 'auto', paddingTop: '50px', color: '#aaa', letterSpacing: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          CREATED BY KUNAKORN
        </footer>
      </div>
    );
  }

  // ==========================================
  // 5. UI: DASHBOARD SCREEN (หน้าจัดการสต๊อก)
  // ==========================================
  const filteredItems = items.filter(item => 
    item.category === activeTab && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#111' }}>HAUS STOCK</h2>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>พนักงาน: <strong>{loggedInUser}</strong></div>
        </div>
        <button onClick={handleLogout} style={{ color: '#fff', backgroundColor: '#e53935', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          LOGOUT
        </button>
      </div>

      {/* Tabs (ครัว / บาร์น้ำ) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setActiveTab('ครัว')} style={activeTab === 'ครัว' ? activeTabStyle : inactiveTabStyle}>🍳 สต๊อกครัว</button>
        <button onClick={() => setActiveTab('บาร์น้ำ')} style={activeTab === 'บาร์น้ำ' ? activeTabStyle : inactiveTabStyle}>🍹 สต๊อกบาร์น้ำ</button>
      </div>

      {/* Search & Refresh */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder={`🔍 ค้นหาสินค้าใน${activeTab}...`} 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }}
        />
        <button onClick={fetchStock} style={{ padding: '0 15px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', fontSize: '18px' }}>
          🔄
        </button>
      </div>

      {/* Item List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>กำลังโหลดข้อมูล 209 รายการ... ⏳</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
              
              {/* ชื่อสินค้า และ สถานะ Auto-Save */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>{item.name}</div>
                {savingId === item.id && <span style={{ fontSize: '12px', color: '#4caf50', fontWeight: 'bold' }}>✓ บันทึกแล้ว</span>}
              </div>

              {/* Stepper ลัง และ เศษ */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                
                {/* กล่องจัดการ "ลัง" */}
                <div style={stepperContainer}>
                  <div style={stepperLabel}>📦 ลัง (Box)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => updateQty(item.id, 'box', 'sub')} style={qtyBtn}>-</button>
                    <span style={qtyNumber}>{item.boxQty}</span>
                    <button onClick={() => updateQty(item.id, 'box', 'add')} style={qtyBtn}>+</button>
                  </div>
                </div>

                {/* กล่องจัดการ "เศษ" */}
                <div style={stepperContainer}>
                  <div style={stepperLabel}>🍾 เศษ (Piece)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => updateQty(item.id, 'piece', 'sub')} style={qtyBtn}>-</button>
                    <span style={qtyNumber}>{item.pieceQty}</span>
                    <button onClick={() => updateQty(item.id, 'piece', 'add')} style={qtyBtn}>+</button>
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
             <div style={{ textAlign: 'center', color: '#999', padding: '30px' }}>ไม่พบรายการสินค้าในหมวดหมู่นี้</div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. STYLES (การตกแต่ง UI)
// ==========================================
const inputStyle = { 
  width: '100%', 
  padding: '16px', 
  marginBottom: '15px', 
  borderRadius: '10px', 
  border: '1px solid #ccc', 
  boxSizing: 'border-box', 
  fontSize: '16px', 
  textAlign: 'center',
  outline: 'none',
  backgroundColor: '#fafafa',
  transition: 'border 0.3s'
};

const buttonStyle = { 
  width: '100%', 
  padding: '16px', 
  backgroundColor: '#111', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  fontWeight: 'bold', 
  fontSize: '16px',
  letterSpacing: '1px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const activeTabStyle = {
  flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer'
};

const inactiveTabStyle = {
  flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#666', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer'
};

const stepperContainer = {
  flex: 1, backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #eee'
};

const stepperLabel = {
  fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: 'bold'
};

const qtyBtn = { 
  width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: '#fff', fontSize: '18px', fontWeight: 'bold', color: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const qtyNumber = {
  fontSize: '18px', fontWeight: 'bold', width: '24px', textAlign: 'center', color: '#111'
};
```const handleLogout = () => {
    localStorage.removeItem('haus_user_session');
    setIsLoggedIn(false);
    setUser('');
    setPass('');
    setItems([]);
  };

  // ==========================================
  // 3. FETCH & AUTO-SAVE SYSTEM (ระบบดึงข้อมูลและบันทึกอัตโนมัติ)
  // ==========================================
  const fetchStock = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}?action=getStocks`);
      const data = await resp.json();
      // สมมติว่า API ส่งข้อมูลมาเป็น Array ของ Object
      // ถ้า API ยังไม่มีฟิลด์ boxQty, pieceQty, category ระบบจะสร้างค่าเริ่มต้นให้
      const formattedData = data.map(item => ({
        ...item,
        boxQty: item.boxQty || 0,
        pieceQty: item.pieceQty || 0,
        category: item.category || (item.name.includes('เหล้า') || item.name.includes('เบียร์') ? 'บาร์น้ำ' : 'ครัว')
      }));
      setItems(formattedData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchStock();
  }, [isLoggedIn]);

  // ฟังก์ชัน Auto-Save เมื่อกดบวก/ลบ
  const updateQty = async (id, type, operation) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const itemIndex = newItems.findIndex(i => i.id === id);
      if (itemIndex === -1) return prevItems;

      const item = newItems[itemIndex];
      let newValue = type === 'box' ? item.boxQty : item.pieceQty;

      if (operation === 'add') newValue += 1;
      if (operation === 'sub' && newValue > 0) newValue -= 1;

      if (type === 'box') item.boxQty = newValue;
      if (type === 'piece') item.pieceQty = newValue;

      // เรียก Auto-Save ไปยัง Google Sheets
      triggerAutoSave(id, item.boxQty, item.pieceQty);

      return newItems;
    });
  };

  const triggerAutoSave = async (id, boxQty, pieceQty) => {
    setSavingId(id);
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'update', 
          id: id, 
          boxQty: boxQty, 
          pieceQty: pieceQty,
          updatedBy: loggedInUser 
        })
      });
    } catch (err) {
      console.error("Auto-Save Error:", err);
    } finally {
      setTimeout(() => setSavingId(null), 1000); // แสดงสถานะ "บันทึกแล้ว" 1 วินาที
    }
  };

  // ==========================================
  // 4. UI: LOGIN SCREEN (หน้าล็อกอิน)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap');`}</style>
        
        <h1 style={{ fontFamily: '"Noto Serif JP", serif', fontSize: '32px', letterSpacing: '2px', marginBottom: '40px', color: '#111' }}>
          HAUS IZAKAYA
        </h1>
        
        <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
          <input 
            placeholder="USER" 
            value={user} 
            // บังคับพิมพ์ใหญ่เสมอ
            onChange={(e) => setUser(e.target.value.toUpperCase())} 
            style={inputStyle} 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            style={inputStyle} 
          />
          <button onClick={handleLogin} style={buttonStyle}>LOGIN</button>
        </div>
        
        {/* เครดิตผู้สร้าง */}
        <footer style={{ marginTop: 'auto', paddingTop: '50px', color: '#aaa', letterSpacing: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          CREATED BY KUNAKORN
        </footer>
      </div>
    );
  }

  // ==========================================
  // 5. UI: DASHBOARD SCREEN (หน้าจัดการสต๊อก)
  // ==========================================
  const filteredItems = items.filter(item => 
    item.category === activeTab && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#111' }}>HAUS STOCK</h2>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>พนักงาน: <strong>{loggedInUser}</strong></div>
        </div>
        <button onClick={handleLogout} style={{ color: '#fff', backgroundColor: '#e53935', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          LOGOUT
        </button>
      </div>

      {/* Tabs (ครัว / บาร์น้ำ) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setActiveTab('ครัว')} style={activeTab === 'ครัว' ? activeTabStyle : inactiveTabStyle}>🍳 สต๊อกครัว</button>
        <button onClick={() => setActiveTab('บาร์น้ำ')} style={activeTab === 'บาร์น้ำ' ? activeTabStyle : inactiveTabStyle}>🍹 สต๊อกบาร์น้ำ</button>
      </div>

      {/* Search & Refresh */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder={`🔍 ค้นหาสินค้าใน${activeTab}...`} 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }}
        />
        <button onClick={fetchStock} style={{ padding: '0 15px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', fontSize: '18px' }}>
          🔄
        </button>
      </div>

      {/* Item List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>กำลังโหลดข้อมูล 209 รายการ... ⏳</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
              
              {/* ชื่อสินค้า และ สถานะ Auto-Save */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>{item.name}</div>
                {savingId === item.id && <span style={{ fontSize: '12px', color: '#4caf50', fontWeight: 'bold' }}>✓ บันทึกแล้ว</span>}
              </div>

              {/* Stepper ลัง และ เศษ */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                
                {/* กล่องจัดการ "ลัง" */}
                <div style={stepperContainer}>
                  <div style={stepperLabel}>📦 ลัง (Box)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => updateQty(item.id, 'box', 'sub')} style={qtyBtn}>-</button>
                    <span style={qtyNumber}>{item.boxQty}</span>
                    <button onClick={() => updateQty(item.id, 'box', 'add')} style={qtyBtn}>+</button>
                  </div>
                </div>

                {/* กล่องจัดการ "เศษ" */}
                <div style={stepperContainer}>
                  <div style={stepperLabel}>🍾 เศษ (Piece)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => updateQty(item.id, 'piece', 'sub')} style={qtyBtn}>-</button>
                    <span style={qtyNumber}>{item.pieceQty}</span>
                    <button onClick={() => updateQty(item.id, 'piece', 'add')} style={qtyBtn}>+</button>
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
             <div style={{ textAlign: 'center', color: '#999', padding: '30px' }}>ไม่พบรายการสินค้าในหมวดหมู่นี้</div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. STYLES (การตกแต่ง UI)
// ==========================================
const inputStyle = { 
  width: '100%', 
  padding: '16px', 
  marginBottom: '15px', 
  borderRadius: '10px', 
  border: '1px solid #ccc', 
  boxSizing: 'border-box', 
  fontSize: '16px', 
  textAlign: 'center',
  outline: 'none',
  backgroundColor: '#fafafa',
  transition: 'border 0.3s'
};

const buttonStyle = { 
  width: '100%', 
  padding: '16px', 
  backgroundColor: '#111', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  fontWeight: 'bold', 
  fontSize: '16px',
  letterSpacing: '1px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const activeTabStyle = {
  flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#111', color: '#fff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer'
};

const inactiveTabStyle = {
  flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#666', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer'
};

const stepperContainer = {
  flex: 1, backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #eee'
};

const stepperLabel = {
  fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: 'bold'
};

const qtyBtn = { 
  width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: '#fff', fontSize: '18px', fontWeight: 'bold', color: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const qtyNumber = {
  fontSize: '18px', fontWeight: 'bold', width: '24px', textAlign: 'center', color: '#111'
};
```
