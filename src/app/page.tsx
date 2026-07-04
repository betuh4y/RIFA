export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px', textAlign: 'center' }}>
      <h1>🐱 Rifa da Ava — API Pix</h1>
      <p style={{ marginTop: '12px', color: '#555' }}>Servidor rodando corretamente.</p>
      <ul style={{ listStyle: 'none', marginTop: '24px', fontSize: '14px', color: '#333' }}>
        <li>✅ <code>POST /api/criar-pix</code></li>
        <li style={{ marginTop: '8px' }}>✅ <code>GET /api/status-pix?id=XXX</code></li>
      </ul>
      <p style={{ marginTop: '24px' }}>
        <a href="/rifa.html" style={{ color: '#e11d48', fontWeight: 'bold', fontSize: '16px' }}>
          🎟️ Acessar a Rifa →
        </a>
      </p>
    </main>
  );
}
