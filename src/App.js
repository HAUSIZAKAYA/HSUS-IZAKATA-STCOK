// Source - https://stackoverflow.com/q/73177643

// Posted by ines, modified by community. See post 'Timeline' for change history

// Retrieved 2026-02-25, License - CC BY-SA 4.0



const [notes, setNotes] = useState([
  {
  noteId: nanoid(),
  text: 'This is my 1st note!',
  date: '30/07/2022'
  },
  {
    noteId: nanoid(),
    text: 'This is my 2nd note!',
    date: '30/07/2022'
  }
])

// 1st time the app runs
useEffect(() => {
  const savedNotes = JSON.parse(localStorage.getItem('react-notes'))
  console.log('refresh page call:',savedNotes)

  if(savedNotes) {
    setNotes(savedNotes)
  }
}, [])

//every time a new note is added
useEffect(() => {
  localStorage.setItem('react-notes', JSON.stringify(notes));
  console.log('new note call:', notes)
}, [notes])
; Source - https://stackoverflow.com/a/73177691

; Posted by Youssouf Oumar, modified by community. See post 'Timeline' for change history

; Retrieved 2026-02-25, License - CC BY-SA 4.0



useEffect(() => {
  localStorage.setItem('react-notes', JSON.stringify(notes));
  console.log('new note call:', notes)
}, [notes])
// Source - https://stackoverflow.com/a/73177691

// Posted by Youssouf Oumar, modified by community. See post 'Timeline' for change history

// Retrieved 2026-02-25, License - CC BY-SA 4.0



const [notes, setNotes] = useState(
  !localStorage.getItem("react-notes")
    ? [
        {
          noteId: nanoid(),
          text: "This is my 1st note!",
          date: "30/07/2022",
        },
        {
          noteId: nanoid(),
          text: "This is my 2nd note!",
          date: "30/07/2022",
        },
      ]
    : JSON.parse(localStorage.getItem("react-notes"))
);

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Loader2, Save, Package, Search, AlertCircle, RefreshCw, Send, Camera, BarChart3, History, LayoutGrid, Copy } from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyssXPamv24PHsb-0l82fgMo5jvujkvyhXFucifYP1H9qaOWFMjE7iZ2OesPFjFJOKZ5g/exec";

export default function HausCloudApp() {
  const [tab, setTab] = useState('stock'); // สลับเป็นหน้านี้ให้พี่ก่อนเลย
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [messages, setMessages] = useState([]); // สำหรับหน้าแชท

  // --- 1. ดึงข้อมูลจาก Cloud (Google Sheets) ---
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // --- 2. อัปเดตจำนวน & ซิงค์กลับ Cloud ---
  const updateQty = async (id, type, delta) => {
    if (isSaving) return;
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newBoxQty = type === 'box' ? Math.max(0, item.boxQty + delta) : item.boxQty;
        const newPieceQty = type === 'piece' ? Math.max(0, item.pieceQty + delta) : item.pieceQty;
        return { ...item, boxQty: newBoxQty, pieceQty: newPieceQty };
      }
      return item;
    });
    setItems(updatedItems);
    const targetItem = updatedItems.find(i => i.id === id);
    syncToGoogleSheets(targetItem);
  };

  const syncToGoogleSheets = async (itemData) => {
    setIsSaving(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  const categories = ['All', ...new Set(items.map(i => i.category))];
  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) && (category === 'All' || i.category === category)
  );

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-amber-500 font-black italic">
      <Loader2 className="animate-spin mb-4" size={40} /> HAUS CLOUD LOADING...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans">
      {/* 🌌 Dotted Glow Background */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#fbbf24 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
      </div>

      <header className="relative z-10 p-5 bg-black/60 border-b border-white/5 backdrop-blur-xl sticky top-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-black italic text-amber-500 tracking-tighter">HAUS IZAKAYA</h1>
            <div className={`flex items-center gap-1.5 text-[9px] font-bold ${isSaving ? 'text-amber-500' : 'text-green-500'}`}>
              {isSaving ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
              {isSaving ? 'SYNCING TO CLOUD...' : 'CLOUD READY'}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchItems} className="p-2 text-zinc-500"><RefreshCw size={18}/></button>
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs">🏮</div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-600" size={16} />
          <input className="w-full bg-zinc-900 border-none rounded-xl py-2 pl-10 text-sm" placeholder="ค้นหาสต็อก..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </header>

      <main className="relative z-10 flex-1 p-4 overflow-y-auto pb-44">
        {/* Category Nav */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${category === cat ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-500'}`}>{cat}</button>
          ))}
        </div>

        {/* Stock List (Artifact Cards) */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-zinc-900/80 border border-white/5 p-5 rounded-[2.5rem] shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{item.category}</span>
                  <h3 className="font-bold text-zinc-200 text-lg leading-tight">{item.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">TOTAL</p>
                  <p className="text-2xl font-black text-white italic">{ (item.boxQty * (item.perBox || 0)) + item.pieceQty }</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Box Control */}
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 mb-2 uppercase font-bold">Box (ลัง)</p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => updateQty(item.id, 'box', -1)} className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-xl active:bg-amber-500"><Minus size={14}/></button>
                    <span className="font-black text-lg">{item.boxQty}</span>
                    <button onClick={() => updateQty(item.id, 'box', 1)} className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-xl active:bg-amber-500"><Plus size={14}/></button>
                  </div>
                </div>
                {/* Piece Control */}
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 mb-2 uppercase font-bold">Piece (ชิ้น)</p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => updateQty(item.id, 'piece', -1)} className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-xl active:bg-amber-500"><Minus size={14}/></button>
                    <span className="font-black text-lg">{item.pieceQty}</span>
                    <button onClick={() => updateQty(item.id, 'piece', 1)} className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-xl active:bg-amber-500"><Plus size={14}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Tab Switcher */}
      <footer className="fixed bottom-0 w-full p-6 z-20 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="flex justify-around bg-zinc-900/90 border border-white/5 py-4 px-8 rounded-full backdrop-blur-2xl">
          <button onClick={() => setTab('chat')} className={tab === 'chat' ? 'text-amber-500' : 'text-zinc-600'}><History size={22}/></button>
          <button onClick={() => setTab('stock')} className={tab === 'stock' ? 'text-amber-500' : 'text-zinc-600'}><LayoutGrid size={22}/></button>
          <button className="text-zinc-600"><BarChart3 size={22}/></button>
        </div>
      </footer>
    </div>
  );
}

