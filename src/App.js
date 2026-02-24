import React, { useState, useEffect } from 'react';
import { Plus, Minus, Loader2, Save, Package, Search } from 'lucide-react';

// URL ของคุณที่ส่งมาให้
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  // --- 1. การดึงข้อมูล (Fetch Data) ---
  const fetchItems = async () => {
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- 2. การอัปเดตจำนวน (Update & Auto-save) ---
  const updateQty = async (id, type, delta) => {
    if (isSaving) return;

    // อัปเดต UI ทันที (Optimistic Update)
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
    await syncToGoogleSheets(targetItem);
  };

  const syncToGoogleSheets = async (item) => {
    setIsSaving(true);
    try {
      // ใช้ฟอร์ม Data เพื่อส่งไปยัง doPost ของ Google Script
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // สำคัญ: Google Script doPost ไม่รองรับ CORS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      // หน่วงเวลาให้ User เห็นสถานะการ Sync เล็กน้อย
      setTimeout(() => setIsSaving(false), 700);
    }
  };

  // --- 3. การกรองข้อมูล (Filter & Search) ---
  const categories = ['All', ...new Set(items.map(i => i.category))];
  
  const filteredItems = items.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-500 mx-auto mb-2" size={40} />
          <p className="text-gray-600 font-medium">กำลังโหลดสต็อก HAUS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 shadow-xl">
      {/* Header Section */}
      <header className="bg-[#1a1a1a] text-white p-5 sticky top-0 z-20 border-b-4 border-orange-500">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black uppercase tracking-tighter">Haus Izakaya Stock</h1>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isSaving ? 'bg-orange-500 animate-pulse' : 'bg-green-600'}`}>
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? 'SYNCING' : 'CLOUD SYNCED'}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            className="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="flex overflow-x-auto p-3 gap-2 bg-white border-b sticky top-[124px] z-10 shadow-sm">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === cat ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Stock Items List */}
      <main className="p-4 space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-transform active:scale-[0.98]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{item.category}</span>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
              </div>
              <div className="bg-gray-50 px-3 py-1 rounded-lg text-right border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Pieces</p>
                <p className="text-lg font-black text-gray-800">
                  {(item.boxQty * (item.perBox || 0)) + item.pieceQty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Box Stepper */}
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase">Boxes (ลัง)</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => updateQty(item.id, 'box', -1)} className="p-2 bg-white rounded-lg shadow-sm hover:text-orange-500"><Minus size={18} /></button>
                  <span className="font-bold text-lg">{item.boxQty}</span>
                  <button onClick={() => updateQty(item.id, 'box', 1)} className="p-2 bg-white rounded-lg shadow-sm hover:text-orange-500"><Plus size={18} /></button>
                </div>
              </div>

              {/* Piece Stepper */}
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase">Pieces (ชิ้น)</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => updateQty(item.id, 'piece', -1)} className="p-2 bg-white rounded-lg shadow-sm hover:text-orange-500"><Minus size={18} /></button>
                  <span className="font-bold text-lg">{item.pieceQty}</span>
                  <button onClick={() => updateQty(item.id, 'piece', 1)} className="p-2 bg-white rounded-lg shadow-sm hover:text-orange-500"><Plus size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>ไม่พบรายการสินค้าที่ค้นหา...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
