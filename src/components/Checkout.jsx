import { useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function Checkout({ onPaid }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  async function startCheckout(e){
    e.preventDefault();
    setLoading(true); setError(null);
    try{
      const res = await fetch(`${API}/api/checkout`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email})});
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail || 'Gagal membuat sesi');
      setSessionId(data.session_id);
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  async function confirm(){
    if(!sessionId) return;
    setLoading(true); setError(null);
    try{
      const res = await fetch(`${API}/api/confirm`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({session_id: sessionId})});
      const data = await res.json();
      if(!res.ok) throw new Error(data.detail || 'Gagal konfirmasi');
      onPaid(data.token);
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-sm border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800">Pendaftaran Berbayar</h2>
      <p className="text-gray-600 text-sm mt-1">Bayar sekali untuk akses penuh ke fitur.</p>
      <form className="mt-4 space-y-3" onSubmit={startCheckout}>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button disabled={loading} className="w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Memproses...' : 'Bayar via Stripe'}
        </button>
      </form>
      {sessionId && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Simulasi Stripe: klik konfirmasi untuk menyelesaikan pembayaran.</p>
          <button onClick={confirm} className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Konfirmasi Pembayaran</button>
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
