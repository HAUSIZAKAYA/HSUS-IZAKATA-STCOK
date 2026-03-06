import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('MAIN');
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  // ข้อมูลบัญชีสรุปยอด (คนลง, รายการ, สรุป, วันที่)
  const [summaryData] = useState([
    { name: "ADMIN_HAUS", item: "ตัวอย่าง: Asahi", status: "+12", date: "06/03" }
  ]);

  const handleLogin = (u, p) => {
    if (!u || !p) return alert("กรุณากรอก Username และ Password");
    setUser(u.toUpperCase()); // ใช้ชื่อตามที่พิมพ์จริง
    setIsLogin(true);
  };

  if (!isLogin) return (
    <div style={styles.loginContainer}>
      <h1 style={styles.goldText}>HAUS IZAKAYA</h1>
      <div style={styles.form}>
        <input style={styles.input} placeholder="USERNAME" onChange={e => setUser(e.target.value)} />
        <input style={styles.input} type="password" placeholder="PASSWORD" id="p" />
        <button style={styles.loginBtn} onClick={() => handleLogin(user, document.getElementById('p').value)}>LOGIN</button>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.goldText}>HAUS IZAKAYA</div>
        <div style={styles.userBadge}>👤 {user}</div>
      </header>

      {view === 'MAIN' && (
        <div style={styles.menuBox}>
          <button onClick={() => setView('BAR')} style={styles.btn}>🍺 สต็อกบาร์</button>
          <button onClick={() => setView('KITCHEN')} style={styles.btn}>🍳 สต็อกครัว</button>
          <button onClick={() => setView('SUMMARY')} style={styles.btnGold}>📊 วิว สต็อกซิสเต็ม</button>
          <button onClick={() => setIsLogin(false)} style={styles.logout}>ออกจากระบบ</button>
        </div>
      )}

      {view === 'SUMMARY' && (
        <div style={styles.content}>
          <button onClick={() => setView('MAIN')} style={styles.back}>← กลับ</button>
          <h2 style={styles.goldText}>👑 ราชินีสรุปยอด</h2>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.th}>
                  <th>คนลง</th><th>รายการ</th><th>สรุป</th><th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((d, i) => (
                  <tr key={i} style={styles.tr}>
                    <td>{d.name}</td><td>{d.item}</td><td>{d.status}</td><td>{d.date}</td>
                  </tr>
                ))}
                <tr style={styles.tr}>
                  <td>{user}</td><td style={{color:'#444'}}>...</td><td>-</td><td>06/03</td>
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
  goldText: { color: '#E6C068', fontWeight: 'bold', fontSize: '18px' },
  userBadge: { fontSize: '12px', color: '#666' },
  loginContainer: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '260px' },
  input: { padding: '14px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', textAlign: 'center' },
  loginBtn: { padding: '14px', backgroundColor: '#E6C068', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  menuBox: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' },
  btn: { padding: '20px', backgroundColor: '#151515', color: '#E6C068', border: '1px solid #333', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold' },
  btnGold: { padding: '20px', backgroundColor: 'transparent', color: '#E6C068', border: '2px solid #E6C068', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold' },
  logout: { marginTop: '20px', color: '#444', background: 'none', border: 'none', textDecoration: 'underline' },
  content: { padding: '15px' },
  back: { color: '#666', background: 'none', border: 'none', marginBottom: '10px' },
  tableWrap: { border: '1px solid #222', borderRadius: '8px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { backgroundColor: '#111', color: '#666', textAlign: 'left' },
  tr: { borderBottom: '1px solid #111' },
  td: { padding: '12px 8px' }
};
