import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Checkout from './components/Checkout';
import ProfileForm from './components/ProfileForm';
import Search from './components/Search';
import Matches from './components/Matches';
import Admin from './components/Admin';

function Layout({ children, authed, verified }){
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar authed={authed} verified={verified} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Harmoni — Serius, aman, dan transparan.</footer>
    </div>
  );
}

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [verified, setVerified] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(()=>{
    async function fetchMe(){
      if(!token) return;
      const res = await fetch(`${API}/api/me?token=${token}`);
      const data = await res.json();
      setVerified(data?.user?.verified || false);
    }
    fetchMe();
  }, [token]);

  function onPaid(t){ localStorage.setItem('token', t); setToken(t); }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout authed={!!token} verified={verified}>
          <Hero />
          <section id="fitur" className="grid md:grid-cols-3 gap-6 mt-10">
            {[{t:'Profil lengkap',d:'Isi profil secara jujur dan mendalam untuk menemukan kecocokan nilai.'},{t:'Filter serius',d:'Cari berdasarkan usia, agama, pendidikan, pekerjaan, dan gaya hidup.'},{t:'Chat aman',d:'Chat hanya aktif jika saling like (match).'}].map((f,i)=>(
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-lg font-semibold text-gray-800">{f.t}</div>
                <div className="text-gray-600 mt-1 text-sm">{f.d}</div>
              </div>
            ))}
          </section>
        </Layout>} />
        <Route path="/checkout" element={<Layout authed={!!token} verified={verified}><Checkout onPaid={onPaid} /></Layout>} />
        <Route path="/dashboard" element={<Layout authed={!!token} verified={verified}>{token ? <ProfileForm token={token} /> : <p>Silakan daftar dulu.</p>}</Layout>} />
        <Route path="/search" element={<Layout authed={!!token} verified={verified}>{token ? <Search token={token} /> : <p>Silakan daftar dulu.</p>}</Layout>} />
        <Route path="/matches" element={<Layout authed={!!token} verified={verified}>{token ? <Matches token={token} /> : <p>Silakan daftar dulu.</p>}</Layout>} />
        <Route path="/admin" element={<Layout authed={!!token} verified={verified}><Admin /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
