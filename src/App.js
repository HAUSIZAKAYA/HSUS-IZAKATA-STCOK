import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, Search, Save, RefreshCw, LogOut, Loader2 } from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. ระบบจำ Login (Session)
  useEffect(() => {
    const saved = localStorage.getItem('haus_session');
    if (saved) {
      setUser(saved);
      setIsLoggedIn(true);
      fetchStock();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const staff = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const u = user.toUpperCase();
    const p = pass.toUpperCase();

    if ((staff.includes(u) && p === '1234') || (u === 'ADMIN888' && p === 'HAUS2026')) {
      localStorage.setItem('haus_session', u);
      setIsLoggedIn(true);
      fetchStock();
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่!');
    }
  };

  // 2. ดึงข้อมูล Stock
  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch Error");
    } finally {
      setLoading(false);
    }
  };

  // 3. อัปเดตจำนวน & Sync
  const updateQty = async (id, type, delta) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newBox = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        const newPiece = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        return { ...item, boxQty: newBox, pieceQty: newPiece };
      }
      return item;
    });
    setItems(updated);
    
    // ยิงขึ้น Cloud ทันที
    setIsSaving(true);
    const target = updated.find(i => i.id === id);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(target)
      });
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 font-sans">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏮</div>
          <h1 className="text-2xl font-black italic tracking-tighter">HAUS IZAKAYA</h1>
          <p className="text-[10px] text-zinc-400 tracking-[4px]">STOCK MANAGEMENT</p>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <input className="w-full p-4 border rounded-xl text-center uppercase" placeholder="USER" value={user} onChange={e => setUser(e.target.value)} required />
          <input className="w-full p-4 border rounded-xl text-center uppercase" type="password" placeholder="PASSWORD" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="w-full p-4 bg-black text-white rounded-xl font-bold">LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans">
      <header className="bg-black text-white p-6 sticky top-0 z-20 border-b-2 border-orange-500">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-black italic">HAUS STOCK</h1>
          <div className="flex items-center gap-2 text-[10px]">
             {isSaving ? <RefreshCw className="animate-spin text-orange-500" size={12}/> : <Save className="text-green-500" size={12}/>}
             <span>{isSaving ? 'SYNCING...' : 'CLOUD SYNCED'}</span>
          </div>
        </div>
        <input className="w-full bg-zinc-800 p-2 rounded-lg text-sm text-white" placeholder="ค้นหาสินค้า..." onChange={e => setSearchTerm(e.target.value)} />
      </header>

      <main className="p-4 space-y-4">
        {loading ? <div className="text-center py-20 text-zinc-400 animate-pulse">กำลังโหลดข้อมูล...</div> : 
          items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{item.category}</span>
                  <h3 className="font-bold text-zinc-800">{item.name}</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-zinc-400 font-bold uppercase">Total</p>
                   <p className="text-xl font-black italic">{(item.boxQty * (item.perBox || 0)) + item.pieceQty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-bold mb-2">BOX (ลัง)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, 'box', -1)} className="p-2 bg-white rounded-lg shadow-sm"><Minus size={14}/></button>
                    <span className="font-bold text-lg">{item.boxQty}</span>
                    <button onClick={() => updateQty(item.id, 'box', 1)} className="p-2 bg-white rounded-lg shadow-sm"><Plus size={14}/></button>
                  </div>
                </div>
                <div className="bg-zinc-50 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-bold mb-2">PIECE (ชิ้น)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, 'piece', -1)} className="p-2 bg-white rounded-lg shadow-sm"><Minus size={14}/></button>
                    <span className="font-bold text-lg">{item.pieceQty}</span>
                    <button onClick={() => updateQty(item.id, 'piece', 1)} className="p-2 bg-white rounded-lg shadow-sm"><Plus size={14}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </main>

      <footer className="fixed bottom-0 w-full p-4 bg-white border-t flex justify-center">
        <button onClick={() => { localStorage.removeItem('haus_session'); window.location.reload(); }} className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
          <LogOut size={14}/> Logout
        </button>
      </footer>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, Search, Save, RefreshCw, LogOut, Loader2 } from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. ระบบจำ Login (Session)
  useEffect(() => {
    const saved = localStorage.getItem('haus_session');
    if (saved) {
      setUser(saved);
      setIsLoggedIn(true);
      fetchStock();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const staff = ['NAVIN', 'JIDAPA', 'THANATORN', 'BEW', 'STAMP', 'NON', 'SURA', 'DAO', 'DUEN', 'YAN'];
    const u = user.toUpperCase();
    const p = pass.toUpperCase();

    if ((staff.includes(u) && p === '1234') || (u === 'ADMIN888' && p === 'HAUS2026')) {
      localStorage.setItem('haus_session', u);
      setIsLoggedIn(true);
      fetchStock();
    } else {
      alert('USER หรือ PASSWORD ไม่ถูกต้องครับพี่!');
    }
  };

  // 2. ดึงข้อมูล Stock
  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch Error");
    } finally {
      setLoading(false);
    }
  };

  // 3. อัปเดตจำนวน & Sync
  const updateQty = async (id, type, delta) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newBox = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        const newPiece = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        return { ...item, boxQty: newBox, pieceQty: newPiece };
      }
      return item;
    });
    setItems(updated);
    
    // ยิงขึ้น Cloud ทันที
    setIsSaving(true);
    const target = updated.find(i => i.id === id);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(target)
      });
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 font-sans">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏮</div>
          <h1 className="text-2xl font-black italic tracking-tighter">HAUS IZAKAYA</h1>
          <p className="text-[10px] text-zinc-400 tracking-[4px]">STOCK MANAGEMENT</p>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <input className="w-full p-4 border rounded-xl text-center uppercase" placeholder="USER" value={user} onChange={e => setUser(e.target.value)} required />
          <input className="w-full p-4 border rounded-xl text-center uppercase" type="password" placeholder="PASSWORD" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="w-full p-4 bg-black text-white rounded-xl font-bold">LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 font-sans">
      <header className="bg-black text-white p-6 sticky top-0 z-20 border-b-2 border-orange-500">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-black italic">HAUS STOCK</h1>
          <div className="flex items-center gap-2 text-[10px]">
             {isSaving ? <RefreshCw className="animate-spin text-orange-500" size={12}/> : <Save className="text-green-500" size={12}/>}
             <span>{isSaving ? 'SYNCING...' : 'CLOUD SYNCED'}</span>
          </div>
        </div>
        <input className="w-full bg-zinc-800 p-2 rounded-lg text-sm text-white" placeholder="ค้นหาสินค้า..." onChange={e => setSearchTerm(e.target.value)} />
      </header>

      <main className="p-4 space-y-4">
        {loading ? <div className="text-center py-20 text-zinc-400 animate-pulse">กำลังโหลดข้อมูล...</div> : 
          items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{item.category}</span>
                  <h3 className="font-bold text-zinc-800">{item.name}</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-zinc-400 font-bold uppercase">Total</p>
                   <p className="text-xl font-black italic">{(item.boxQty * (item.perBox || 0)) + item.pieceQty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-bold mb-2">BOX (ลัง)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, 'box', -1)} className="p-2 bg-white rounded-lg shadow-sm"><Minus size={14}/></button>
                    <span className="font-bold text-lg">{item.boxQty}</span>
                    <button onClick={() => updateQty(item.id, 'box', 1)} className="p-2 bg-white rounded-lg shadow-sm"><Plus size={14}/></button>
                  </div>
                </div>
                <div className="bg-zinc-50 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-bold mb-2">PIECE (ชิ้น)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, 'piece', -1)} className="p-2 bg-white rounded-lg shadow-sm"><Minus size={14}/></button>
                    <span className="font-bold text-lg">{item.pieceQty}</span>
                    <button onClick={() => updateQty(item.id, 'piece', 1)} className="p-2 bg-white rounded-lg shadow-sm"><Plus size={14}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </main>

      <footer className="fixed bottom-0 w-full p-4 bg-white border-t flex justify-center">
        <button onClick={() => { localStorage.removeItem('haus_session'); window.location.reload(); }} className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
          <LogOut size={14}/> Logout
        </button>
      </footer>
    </div>
  );
                                                              }
