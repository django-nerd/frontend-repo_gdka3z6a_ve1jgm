import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ authed, verified }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <div className="w-full sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-xl text-gray-800">Harmoni</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className={`hover:text-blue-600 ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}>Beranda</Link>
          <Link to="/checkout" className={`hover:text-blue-600 ${isActive('/checkout') ? 'text-blue-600' : 'text-gray-600'}`}>Daftar</Link>
          {authed && (
            <>
              <Link to="/dashboard" className={`hover:text-blue-600 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'}`}>Profil</Link>
              <Link to="/search" className={`hover:text-blue-600 ${isActive('/search') ? 'text-blue-600' : 'text-gray-600'}`}>Cari</Link>
              <Link to="/matches" className={`hover:text-blue-600 ${isActive('/matches') ? 'text-blue-600' : 'text-gray-600'}`}>Match & Chat</Link>
            </>
          )}
          <Link to="/admin" className={`hover:text-blue-600 ${isActive('/admin') ? 'text-blue-600' : 'text-gray-600'}`}>Admin</Link>
          {authed ? (
            <span className="inline-flex items-center gap-2 ml-2">
              <span className="text-gray-700">Akun</span>
              {verified && <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">Verified</span>}
            </span>
          ) : (
            <span className="text-gray-500">Guest</span>
          )}
        </div>
      </div>
    </div>
  );
}
