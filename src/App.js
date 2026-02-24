impor React, { useState, useEffect } fro'react';
impor{ Plus, Minus, Loader2, Save, Package, Search, AlertCircle } fro'lucide-react';

// URL ของคุณที่ได้จาก Google Apps Script
constSCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

functionApp() {
  cons[items, setItems] = useState([]);
  cons[loading, setLoading] = useState(true);
  cons[isSaving, setIsSaving] = useState(false);
  cons[searchTerm, setSearchTerm] = useState('');
  cons[category, setCategory] = useState('All');

  // 1. ดึงข้อมูลจาก Cloud (GET)
  constfetchItems = asyncl() => {
    tr{
      setLoading(true);
      constresponse = awaitfetch(SCRIPT_URL);
      constdata = awaitresponse.json();
      setItems(data);
    } catc(error) {
      console.error("Fetch Error:", error);
    } finall{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. ฟังก์ชันอัปเดตจำนวนและ Auto-save (POST)
  cons updateQty = asyn(id, type, delta) => {
    i(isSaving) retur; // ป้องกันการกดซ้ำขณะกำลัง Sync

    // อัปเดต State ใน React ทันทีเพื่อให้ User รู้สึกว่าแอปเร็ว
    constupdatedItems = items.map(item => {
      (item.id === id) {
        cons newBoxQty = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        consnewPieceQty = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        retur{ ...item, boxQty: newBoxQty, pieceQty: newPieceQty };
      }
      returnitem;
    });
    setItems(updatedItems);

    // ค้นหาข้อมูลตัวที่จะส่งไปเซฟ
    consttargetItem = updatedItems.find(i => i.id === id);
    awaitsyncToGoogleSheets(targetItem);
  };

  cons syncToGoogleSheets = asyn (itemData) => {
    setIsSaving(true);
    tr{
      awaifetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // สำคัญมากสำหรับ Google Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
    } catc(error) {
      console.error("Sync Error:", error);
    } finall{
      // หน่วงเวลาเล็กน้อยให้สถานะโชว์ที่หน้าจอ
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  // 3. ระบบ Filter และ Search
  constcategories = ['All', ...Set(items.map(i => i.category))];
  constilteredItems = items.filter(item => {
    contmatchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    constmatchesCategory = category === 'All' || item.category === category;
    returnmatchesSearch && matchesCategory;
  });

  i(loading) {
    retu(
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="tracking-widest font-bold">HAUS STOCK LOADING...</p>
      </div>
    );
  }

  retu(
    <div className="max-w-md mx-auto bg-zinc-50 min-h-screen pb-10 shadow-2xl">
      {/* Header Section */}
      <header className="bg-zinc-950 text-white p-6 sticky top-0 z-20 border-b-2 border-orange-500">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black italic tracking-tighter">HAUS IZAKAYA</h1>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${isSaving ? 'bg-orange-500/20 text-orange-500 animate-pulse' : 'bg-green-500/20 text-green-500'}`}>
            {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? 'SYNCING...' : 'CLOUD SYNCED'}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full bg-zinc-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="flex overflow-x-auto p-4 gap-2 bg-white border-b sticky top-[124px] z-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === cat ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Stock Cards */}
      <main className="p-4 space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-sm transition-transform active:scale-[0.98]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{item.category}</span>
                <h3 className="font-bold text-zinc-800 text-lg leading-tight">{item.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-400 font-bold">TOTAL</p>
                <p className="text-xl font-black text-zinc-900">
                  { (item.boxQty * (item.perBox || 0)) + item.pieceQty }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Box Stepper */}
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-1 mb-2 text-zinc-400">
                  <Package size={14} />
                  <span className="text-[10px] font-bold uppercase">ลัง (Box)</span>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => updateQty(item.id, 'box', -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500"><Minus size={16} /></button>
                  <span className="font-black text-lg">{item.boxQty}</span>
                  <button onClick={() => updateQty(item.id, 'box', 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500"><Plus size={16} /></button>
                </div>
              </div>

              {/* Piece Stepper */}
              <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-1 mb-2 text-zinc-400">
                  <div className="w-3.5 h-3.5 bg-zinc-300 rounded-sm" />
                  <span className="text-[10px] font-bold uppercase">ชิ้น (Piece)</span>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => updateQty(item.id, 'piece', -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500"><Minus size={16} /></button>
                  <span className="font-black text-lg">{item.pieceQty}</span>
                  <button onClick={() => updateQty(item.id, 'piece', 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-orange-500"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

exportdefaul App;
