import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || '';

const defaultProfile = {
  full_name: '', gender: 'Pria', birth_date: '', marital_status: 'Lajang',
  religion: 'Islam', islam_branch: 'Sunni', religion_level: 'Moderat', ethnicity: '', hobbies: [],
  height_cm: '', weight_kg: '', wears_glasses: false, address_origin: '', address_current: '',
  siblings_count: '', family_condition: 'harmonis', health_history: [], health_notes: '',
  occupation: '', side_hustle: '', income_range: '', education_level: '',
  bahasa_indonesia: true, bahasa_inggris: false, bahasa_arab: false, bahasa_daerah: '', bahasa_lain: '',
  child_plan: 'Ingin punya anak', love_languages: [], smoke: false, alcohol: false,
  diet: 'Pemakan Segala', physical_activity: 'Sedang', sleep_habit: 'Tidak tentu', time_management: 'Fleksibel', shopping_habit: 'Sesuai kebutuhan',
  instagram: '', facebook: '', linkedin: '', tiktok: '', city: '', country: '', photo_url: ''
};

export default function ProfileForm({ token }){
  const [profile, setProfile] = useState(defaultProfile);
  const [status, setStatus] = useState(null);

  useEffect(()=>{
    async function load(){
      const res = await fetch(`${API}/api/me?token=${token}`);
      const data = await res.json();
      if(data.profile){
        const p = { ...defaultProfile, ...data.profile };
        setProfile(p);
      }
    }
    if(token) load();
  }, [token]);

  function update(key, value){ setProfile(prev => ({...prev, [key]: value})); }
  function toggleInArray(key, value){ setProfile(prev => ({...prev, [key]: prev[key]?.includes(value) ? prev[key].filter(v=>v!==value) : [...(prev[key]||[]), value]})); }

  async function save(e){
    e.preventDefault(); setStatus('');
    const res = await fetch(`${API}/api/profile?token=${token}`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(profile)});
    const data = await res.json();
    setStatus(res.ok ? 'Tersimpan' : (data.detail || 'Gagal menyimpan'));
  }

  return (
    <form onSubmit={save} className="grid md:grid-cols-2 gap-6">
      <section className="space-y-3">
        <h3 className="font-semibold text-gray-800">Data Diri</h3>
        <input className="w-full border-gray-300 rounded" placeholder="Nama lengkap" value={profile.full_name} onChange={e=>update('full_name', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <select value={profile.gender} onChange={e=>update('gender', e.target.value)} className="border-gray-300 rounded">
            <option>Pria</option><option>Wanita</option><option>Lainnya</option>
          </select>
          <input type="date" value={profile.birth_date} onChange={e=>update('birth_date', e.target.value)} className="border-gray-300 rounded" />
        </div>
        <select value={profile.marital_status} onChange={e=>update('marital_status', e.target.value)} className="border-gray-300 rounded w-full">
          <option>Lajang</option><option>Duda/Janda</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select value={profile.religion} onChange={e=>update('religion', e.target.value)} className="border-gray-300 rounded">
            <option>Islam</option><option>Katolik</option><option>Protestan</option><option>Hindu</option><option>Budha</option><option>Khonghucu</option><option>Lainnya</option><option>Agnostik</option>
          </select>
          {profile.religion==='Islam' && (
            <select value={profile.islam_branch} onChange={e=>update('islam_branch', e.target.value)} className="border-gray-300 rounded">
              <option>Sunni</option><option>Syiah</option>
            </select>
          )}
        </div>
        <select value={profile.religion_level} onChange={e=>update('religion_level', e.target.value)} className="border-gray-300 rounded w-full">
          <option>Tidak menjalankan</option><option>Moderat</option><option>Strict</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Suku" value={profile.ethnicity} onChange={e=>update('ethnicity', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Hobi (pisahkan dengan koma)" value={profile.hobbies?.join(', ')} onChange={e=>update('hobbies', e.target.value.split(',').map(v=>v.trim()).filter(Boolean))} className="border-gray-300 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Tinggi (cm)" value={profile.height_cm} onChange={e=>update('height_cm', e.target.value)} className="border-gray-300 rounded" />
          <input type="number" placeholder="Berat (kg)" value={profile.weight_kg} onChange={e=>update('weight_kg', e.target.value)} className="border-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={profile.wears_glasses} onChange={e=>update('wears_glasses', e.target.checked)} /><span>Berkacamata</span></div>
        <input placeholder="Alamat asli" value={profile.address_origin} onChange={e=>update('address_origin', e.target.value)} className="border-gray-300 rounded w-full" />
        <input placeholder="Alamat domisili" value={profile.address_current} onChange={e=>update('address_current', e.target.value)} className="border-gray-300 rounded w-full" />
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-gray-800">Keluarga & Kesehatan</h3>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Jumlah saudara" value={profile.siblings_count} onChange={e=>update('siblings_count', e.target.value)} className="border-gray-300 rounded" />
          <select value={profile.family_condition} onChange={e=>update('family_condition', e.target.value)} className="border-gray-300 rounded">
            <option>harmonis</option><option>tidak harmonis</option><option>orang tua bercerai</option><option>yatim</option><option>piatu</option>
          </select>
        </div>
        <label className="text-sm text-gray-700">Riwayat penyakit</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['tidak ada','diabetes','hipertensi','asma','jantung','gangguan mental','alergi','autoimun'].map(x=> (
            <label key={x} className="flex items-center gap-2"><input type="checkbox" checked={profile.health_history?.includes(x)} onChange={()=>toggleInArray('health_history', x)} />{x}</label>
          ))}
        </div>
        <textarea placeholder="Deskripsi kesehatan" value={profile.health_notes} onChange={e=>update('health_notes', e.target.value)} className="w-full border-gray-300 rounded" />
      </section>

      <section className="space-y-3 md:col-span-2">
        <h3 className="font-semibold text-gray-800">Pekerjaan, Pendidikan, Bahasa</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input placeholder="Pekerjaan" value={profile.occupation} onChange={e=>update('occupation', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Usaha sampingan" value={profile.side_hustle} onChange={e=>update('side_hustle', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Pendapatan/bulan" value={profile.income_range} onChange={e=>update('income_range', e.target.value)} className="border-gray-300 rounded" />
          <select value={profile.education_level} onChange={e=>update('education_level', e.target.value)} className="border-gray-300 rounded">
            {['SD','SMP','SMA/SMK','D3','S1','S2','S3'].map(x=> <option key={x}>{x}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.bahasa_indonesia} onChange={e=>update('bahasa_indonesia', e.target.checked)} /><span>Bahasa Indonesia</span></div>
          <div className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.bahasa_inggris} onChange={e=>update('bahasa_inggris', e.target.checked)} /><span>Bahasa Inggris</span></div>
          <div className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.bahasa_arab} onChange={e=>update('bahasa_arab', e.target.checked)} /><span>Bahasa Arab</span></div>
          <input placeholder="Bahasa daerah" value={profile.bahasa_daerah} onChange={e=>update('bahasa_daerah', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Bahasa lain" value={profile.bahasa_lain} onChange={e=>update('bahasa_lain', e.target.value)} className="border-gray-300 rounded" />
        </div>
      </section>

      <section className="space-y-3 md:col-span-2">
        <h3 className="font-semibold text-gray-800">Preferensi & Lifestyle</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <select value={profile.child_plan} onChange={e=>update('child_plan', e.target.value)} className="border-gray-300 rounded">
            {['Ingin punya anak','Tidak ingin punya anak','Sudah punya anak dan ingin tambah','Sudah punya anak dan tidak ingin tambah','Tidak yakin'].map(x=> <option key={x}>{x}</option>)}
          </select>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Love Language</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Words of Affirmation','Acts of Service','Receiving Gifts','Quality Time','Physical Touch'].map(x=> (
                <label key={x} className="flex items-center gap-2"><input type="checkbox" checked={profile.love_languages?.includes(x)} onChange={()=>toggleInArray('love_languages', x)} />{x}</label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={profile.smoke} onChange={e=>update('smoke', e.target.checked)} />Merokok</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={profile.alcohol} onChange={e=>update('alcohol', e.target.checked)} />Alkohol</label>
            <select value={profile.diet} onChange={e=>update('diet', e.target.value)} className="border-gray-300 rounded col-span-2">
              {['Vegetarian','Vegan','Pescatarian','Pemakan Segala'].map(x=> <option key={x}>{x}</option>)}
            </select>
            <select value={profile.physical_activity} onChange={e=>update('physical_activity', e.target.value)} className="border-gray-300 rounded">
              {['Aktif','Sedang','Tidak aktif'].map(x=> <option key={x}>{x}</option>)}
            </select>
            <select value={profile.sleep_habit} onChange={e=>update('sleep_habit', e.target.value)} className="border-gray-300 rounded">
              {['Pagi hari','Malam hari','Tidak tentu'].map(x=> <option key={x}>{x}</option>)}
            </select>
            <select value={profile.time_management} onChange={e=>update('time_management', e.target.value)} className="border-gray-300 rounded">
              {['Disiplin','Fleksibel','Santai'].map(x=> <option key={x}>{x}</option>)}
            </select>
            <select value={profile.shopping_habit} onChange={e=>update('shopping_habit', e.target.value)} className="border-gray-300 rounded">
              {['Hemat','Sesuai kebutuhan','Konsumtif'].map(x=> <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3 md:col-span-2">
        <h3 className="font-semibold text-gray-800">Sosial & Lokasi</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input placeholder="Instagram" value={profile.instagram} onChange={e=>update('instagram', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Facebook" value={profile.facebook} onChange={e=>update('facebook', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="LinkedIn" value={profile.linkedin} onChange={e=>update('linkedin', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="TikTok" value={profile.tiktok} onChange={e=>update('tiktok', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Kota" value={profile.city} onChange={e=>update('city', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="Negara" value={profile.country} onChange={e=>update('country', e.target.value)} className="border-gray-300 rounded" />
          <input placeholder="URL Foto" value={profile.photo_url} onChange={e=>update('photo_url', e.target.value)} className="border-gray-300 rounded col-span-3" />
        </div>
      </section>

      <div className="md:col-span-2 flex items-center justify-between">
        <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Simpan Profil</button>
        {status && <span className="text-sm text-gray-600">{status}</span>}
      </div>
    </form>
  );
}
