import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function Admin(){
  const [token, setToken] = useState('admin-secret');
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState(null);

  async function load(){
    const res = await fetch(`${API}/api/admin/profiles?token=${token}`);
    const data = await res.json();
    if(res.ok) setProfiles(data.profiles || []);
    const rs = await fetch(`${API}/api/admin/stats?token=${token}`);
    const ds = await rs.json();
    if(rs.ok) setStats(ds);
  }
  async function verify(u){
    await fetch(`${API}/api/admin/verify/${u}?token=${token}`, {method:'POST'});
    load();
  }
  async function remove(u){
    await fetch(`${API}/api/admin/user/${u}?token=${token}`, {method:'DELETE'});
    load();
  }
  useEffect(()=>{ load(); }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <input value={token} onChange={e=>setToken(e.target.value)} className="border-gray-300 rounded" placeholder="Admin token" />
        <button onClick={load} className="px-4 py-2 rounded bg-blue-600 text-white">Muat</button>
        {stats && (
          <div className="text-sm text-gray-700 ml-auto">
            Total: {stats.total_users} • Match: {stats.total_matches} • Verified: {stats.verified_users} • Aktif: {stats.active_users}
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {profiles.map(p => (
          <div key={p._id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <img src={p.photo_url || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80'} className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <div className="font-semibold text-gray-800">{p.full_name || '—'}</div>
                <div className="text-sm text-gray-600">{p.city || '—'} • {p.religion} ({p.religion_level})</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>verify(p.userauth_id)} className="px-3 py-1.5 rounded bg-blue-600 text-white">Verified</button>
              <button onClick={()=>remove(p.userauth_id)} className="px-3 py-1.5 rounded bg-red-600 text-white">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
