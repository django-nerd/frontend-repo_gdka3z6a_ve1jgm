import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || '';

function Card({ p, onLike }){
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
      <img src={p.photo_url || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80'} alt="foto" className="w-20 h-20 object-cover rounded-lg" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-800">{p.name}</h4>
          {p.verified && <span className="text-blue-600">✔</span>}
        </div>
        <p className="text-sm text-gray-600">{p.age ? `${p.age} th` : ''} • {p.city || '—'} • {p.religion} ({p.religion_level})</p>
        <p className="text-sm text-gray-600">{p.occupation || '—'} • {p.education_level || '—'}</p>
        <button onClick={()=>onLike(p)} className="mt-2 px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Like</button>
      </div>
    </div>
  );
}

export default function Search({ token }){
  const [filters, setFilters] = useState({ city:'', religion:'', religion_level:'', education_level:'', occupation:'', income_range:'', diet:'', age_min:'', age_max:'', verified_only:false });
  const [results, setResults] = useState([]);

  async function runSearch(){
    const params = new URLSearchParams({ token, ...Object.fromEntries(Object.entries(filters).filter(([,v])=> v!=='' && v!==false)) });
    const res = await fetch(`${API}/api/search?${params.toString()}`);
    const data = await res.json();
    setResults(data.results || []);
  }

  useEffect(()=>{ if(token) runSearch(); }, [token]);

  async function like(p){
    await fetch(`${API}/api/like?token=${token}`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ from_userauth_id:'', to_userauth_id: String(p.userauth_id) })});
    runSearch();
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:col-span-1">
        <h3 className="font-semibold text-gray-800 mb-3">Filter</h3>
        {['city','religion','religion_level','education_level','occupation','income_range','diet'].map(k => (
          <input key={k} placeholder={k.replace('_',' ')} value={filters[k]} onChange={e=>setFilters(prev=>({...prev, [k]: e.target.value}))} className="w-full mb-2 border-gray-300 rounded" />
        ))}
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="usia min" value={filters.age_min} onChange={e=>setFilters(prev=>({...prev, age_min: e.target.value}))} className="border-gray-300 rounded" />
          <input placeholder="usia max" value={filters.age_max} onChange={e=>setFilters(prev=>({...prev, age_max: e.target.value}))} className="border-gray-300 rounded" />
        </div>
        <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={filters.verified_only} onChange={e=>setFilters(prev=>({...prev, verified_only: e.target.checked}))} />Verified only</label>
        <button onClick={runSearch} className="mt-3 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Cari</button>
      </div>
      <div className="md:col-span-2 space-y-4">
        {results.length===0 ? (
          <p className="text-gray-500">Tidak ada hasil. Coba ubah filter.</p>
        ): results.map((r,i)=> <Card key={i} p={r} onLike={like} />)}
      </div>
    </div>
  );
}
