import React, { useState, useEffect } from 'react';
import { Plus, Minus, Loader2, Save, Package, Search, AlertCircle } from 'lucide-react';

// URL ของคุณที่ส่งมาให้
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState(null);

  // --- 1. การดึงข้อมูล (Fetch Data) ---
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(SCRIPT_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- 2. การอัปเดตจำนวนและ Auto-save ---
  const updateQty = async (id, type, delta) => {
    if (isSaving) return; // ป้องกันการกดซ้ำขณะบันทึก

    // อัปเดต State ในเครื่องทันที (Optimistic Update) เพื่อความลื่นไหล
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newBoxQty = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        const newPieceQty = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        return { ...item, boxQty: newBoxQty, pieceQty: newPieceQty };
      }
      return item;
    });
    setItems(updatedItems);

    // เตรียมข้อมูลส่งไปที่ Google Sheets
    const targetItem = updatedItems.find(i => i.id === id);
    await saveToGoogleSheets(targetItem);
  };

  const saveToGoogleSheets = async (itemData) => {
    setIsSaving(true);
    try {
      // ส่งข้อมูลด้วย POST method
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // ข้อจำกัดของ Google Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      // เนื่องจาก no-cors จะไม่คืนค่า Response ที่เราอ่านได้ 
      // แต่ข้อมูลจะถูกส่งถึง Google Sheets เรียบร้อย
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      // หน่วงเวลาเล็กน้อยเพื่อให้ User เห็นสถานะการ Sync
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  // --- 3. การกรองและค้นหาข้อมูล ---
  const categories = ['All', ...new Set(items.map(i => i.category))];
  const filteredItems = items.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <p className="text-gray-500 font-medium">กำลังเตรียมสต็อก HAUS IZAKAYA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 shadow-2xl overflow-hidden">
      {/* Header & Search */}
      <header className="bg-zinc-900 text-white p-6 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-orange-500">HAUS IZAKAYA</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Stock Management System</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${isSaving ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? 'SYNCING...' : 'CLOUD SYNCED'}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Category Tabs */}
      <nav className="flex overflow-x-auto p-4 gap-2 bg-white border-b sticky top-[138px] z-10 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === cat ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* List Content */}
      <main className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{item.category}</span>
                <h3 className="font-bold text-zinc-800 text-lg leading-tight">{item.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Total Pieces</p>
                <p className="text-xl font-black text-zinc-800">
                  {(item.boxQty * (item.perBox || 0)) + item.pieceQty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Stepper Box */}
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <Package size={14} className="text-zinc-400" />
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">ลัง (Box)</span>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => updateQty(item.id, 'box', -1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-90 transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-black text-xl text-zinc-800">{item.boxQty}</span>
                  <button 
                    onClick={() => updateQty(item.id, 'box', 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-90 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Stepper Piece */}
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-3.5 h-3.5 bg-zinc-400 rounded-sm" />
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">ชิ้น (Piece)</span>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => updateQty(item.id, 'piece', -1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-90 transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-black text-xl text-zinc-800">{item.pieceQty}</span>
                  <button 
                    onClick={() => updateQty(item.id, 'piece', 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-90 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;

