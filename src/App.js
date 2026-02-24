import React, { useState, useEffect } from 'react';
import { Plus, Minus, Loader2, Save, Package, Search, RefreshCw } from 'lucide-react';

// URL ของคุณที่ส่งมาให้
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  // 1. ดึงข้อมูลเริ่มต้น (Initial Fetch)
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. ฟังก์ชันอัปเดตจำนวนและ Auto-save
  const updateQty = async (id, type, delta) => {
    if (isSaving) return; // ป้องกันการกดรัวขณะบันทึก

    // อัปเดต UI ทันที (Optimistic UI)
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newBoxQty = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        const newPieceQty = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        return { ...item, boxQty: newBoxQty, pieceQty: newPieceQty };
      }
      return item;
    });
    setItems(updatedItems);

    // ส่งข้อมูลไปบันทึกที่ Google Sheets
    const targetItem = updatedItems.find(i => i.id === id);
    syncToBackend(targetItem);
  };

  const syncToBackend = async (item) => {
    setIsSaving(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // สำคัญสำหรับ Google Apps Script Web App
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      // หน่วงเวลาเล็กน้อยให้ User เห็นสถานะการเซฟ
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  // 3. Logic การกรองข้อมูล
  const categories = ['All', ...new Set(items.map(i => i.category))];
  const filteredItems = items.filter(item => {
    const matchesCat = category === 'All' || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-zinc-500 font-bold tracking-widest uppercase">Haus Stock Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-10 shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-zinc-900 text-white p-6 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black italic tracking-tighter text-orange-500">HAUS IZAKAYA</h1>
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-1 text-orange-400 text-[10px] font-bold animate-pulse">
                <RefreshCw size={12} className="animate-spin" /> SYNCING
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                <Save size={12} /> CLOUD SAVED
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search stock..."
            className="w-full bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Category Tabs */}
      <nav className="flex overflow-x-auto p-4 gap-2 bg-zinc-50 border-b sticky top-[138px] z-10 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-[11px] font-black tracking-widest transition-all ${
              category === cat ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-zinc-400 border border-zinc-200'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Item List */}
      <main className="p-4 space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase">{item.category}</span>
                <h3 className="font-bold text-zinc-800 text-lg leading-tight">{item.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-400 font-bold">TOTAL</p>
                <p className="text-xl font-black text-zinc-900">
                  {(item.boxQty * (item.perBox || 0)) + item.pieceQty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Box Stepper */}
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 mb-2 uppercase flex items-center gap-1">
                  <Package size={12} /> Boxes
                </p>
                <div className="flex items-center justify-between">
                  <button onClick={() => updateQty(item.id, 'box', -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-95 transition-all"><Minus size={16} /></button>
                  <span className="font-black text-lg">{item.boxQty}</span>
                  <button onClick={() => updateQty(item.id, 'box', 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-95 transition-all"><Plus size={16} /></button>
                </div>
              </div>

              {/* Piece Stepper */}
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 mb-2 uppercase flex items-center gap-1">
                   Pieces
                </p>
                <div className="flex items-center justify-between">
                  <button onClick={() => updateQty(item.id, 'piece', -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-95 transition-all"><Minus size={16} /></button>
                  <span className="font-black text-lg">{item.pieceQty}</span>
                  <button onClick={() => updateQty(item.id, 'piece', 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500 active:scale-95 transition-all"><Plus size={16} /></button>
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
