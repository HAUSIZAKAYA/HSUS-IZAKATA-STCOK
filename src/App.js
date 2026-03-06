import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('MAIN');
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  // ข้อมูลบัญชี 4 คอลัมน์ (ตามกฎราชินีสรุปยอด)
  const [logs] = useState([
    { recorder: "ADMIN_HAUS", item: "Sample Item", status: "Checked", date: "06/03" }
  ]);

  const handleLogin = (u, p) => {
    if (!u || !p) return alert("กรุณากรอก USERNAME และ PASSWORD");
    // ตั้งค่า User ตามที่พิมพ์จริงเท่านั้น ไม่มีการมโนชื่ออื่น
    setUser(u.toUpperCase());
    setIsLogin(true);
  };

  if (!isLogin) return (
    <div style={styles.loginPage}>
      <h1 style={styles.goldText}>HAUS IZAKAYA</h1>
      <div style={styles.form}>
        <input style={styles.input} placeholder="USERNAME" onChange={e => setUser(e.target.value)} />
        <input style={styles.input} type="password" placeholder="PASSWORD" id="pass" />
        <button style={styles.loginBtn} onClick={() => handleLogin(user, document.getElementById('pass').value)}>ENTER SYSTEM</button>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.goldText}>HAUS IZAKAYA</div>
        <div style={styles.userInfo}>👤 USER: {user}</div>
      </header>

      {view === 'MAIN' && (
        <div style={styles.menuGrid}>
          <button onClick={() => setView('BAR')} style={styles.menuBtn}>🍺 สต็อกบาร์</button>
          <button onClick={() => setView('KITCHEN')} style={styles.menuBtn}>🍳 สต็อกครัว</button>
          <button onClick={() => setView('SUMMARY')} style={styles.goldBtn}>📊 วิว สต็อกซิสเต็ม</button>
          <button onClick={() => setIsLogin(false)} style={styles.logout}>LOGOUT</button>
        </div>
      )}

      {view === 'SUMMARY' && (
        <div style={styles.content}>
          <button onClick={() => setView('MAIN')} style={styles.backBtn}>← กลับหน้าหลัก</button>
          <h2 style={styles.goldText}>บัญชีสรุปยอด</h2>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>คนลง</th>
                  <th style={styles.th}>รายการ</th>
                  <th style={styles.th}>สรุป</th>
                  <th style={styles.th}>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>{log.recorder}</td>
                    <td style={styles.td}>{log.item}</td>
                    <td style={styles.td}>{log.status}</td>
                    <td style={styles.td}>{log.date}</td>
                  </tr>
                ))}
                <tr style={styles.tr}>
                  <td style={styles.td}>{user}</td>
                  <td style={{...styles.td, color: '#888'}}>กำลังบันทึก...</td>
                  <td style={styles.td}>-</td>
                  <td style={styles.td}>06/03</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222', alignItems: 'center' },
  userInfo: { fontSize: '12px', color: '#666' },
  goldText: { color: '#E6C068', fontWeight: 'bold', letterSpacing: '1px' },
  loginPage: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '260px' },
  input: { padding: '12px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '6px', textAlign: 'center' },
  loginBtn: { padding: '12px', backgroundColor: '#E6C068', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  menuGrid: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' },
  menuBtn: { padding: '20px', backgroundColor: '#151515', color: '#E6C068', border: '1px solid #333', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold' },
  goldBtn: { padding: '20px', backgroundColor: 'transparent', color: '#E6C068', border: '2px solid #E6C068', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold' },
  logout: { marginTop: '20px', background: 'none', border: 'none', color: '#444', textDecoration: 'underline' },
  content: { padding: '15px' },
  backBtn: { background: 'none', border: 'none', color: '#666', marginBottom: '10px' },
  tableWrap: { border: '1px solid #222', borderRadius: '8px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { backgroundColor: '#111', padding: '10px', color: '#666', textAlign: 'left', fontWeight: 'normal' },
  td: { padding: '12px 10px', borderBottom: '1px solid #111' },
  tr: { backgroundColor: '#0d0d0d' }
};
