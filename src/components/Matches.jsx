import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function Matches({ token }){
  const [matches, setMatches] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  async function loadMatches(){
    const res = await fetch(`${API}/api/matches?token=${token}`);
    const data = await res.json();
    setMatches(data.matches || []);
  }
  async function loadMessages(id){
    setActive(id);
    const res = await fetch(`${API}/api/chat/${id}?token=${token}`);
    const data = await res.json();
    setMessages(data.messages || []);
  }
  async function send(){
    if(!text) return;
    await fetch(`${API}/api/chat/send?token=${token}`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({match_id: active, text})});
    setText('');
    loadMessages(active);
  }

  useEffect(()=>{ if(token) loadMatches(); }, [token]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Match</h3>
        <div className="space-y-2">
          {matches.map(m => (
            <button key={m._id} onClick={()=>loadMessages(m._id)} className={`w-full text-left px-3 py-2 rounded border ${active===m._id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} hover:bg-gray-50`}>
              {m.userauth_a.slice(-4)} ↔ {m.userauth_b.slice(-4)}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-[420px]">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map(msg => (
            <div key={msg._id} className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-sm">
              <div className="text-gray-500">{msg.from_userauth_id.slice(-6)}</div>
              <div className="text-gray-800">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border-gray-300 rounded" placeholder="Tulis pesan..." />
          <button onClick={send} className="px-4 rounded bg-blue-600 text-white">Kirim</button>
        </div>
      </div>
    </div>
  );
}
