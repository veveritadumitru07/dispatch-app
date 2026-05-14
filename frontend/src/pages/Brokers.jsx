import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

const initialForm = {
  companyName: '', mcNumber: '', contactName: '',
  email: '', phone: '', paymentTermsDays: 30, rating: 5,
};

export default function Brokers() {
  const [brokers, setBrokers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/brokers');
      setBrokers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (b) => {
    setForm({
      companyName: b.companyName,
      mcNumber: b.mcNumber || '',
      contactName: b.contactName || '',
      email: b.email || '',
      phone: b.phone || '',
      paymentTermsDays: b.paymentTermsDays || 30,
      rating: b.rating || 5,
    });
    setEditingId(b.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      paymentTermsDays: Number(form.paymentTermsDays),
      rating: Number(form.rating),
    };
    try {
      if (editingId) await api.put(`/brokers/${editingId}`, payload);
      else await api.post('/brokers', payload);
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Eroare');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigur ștergi acest broker?')) return;
    await api.delete(`/brokers/${id}`);
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brokers</h1>
          <p className="text-gray-500 mt-1">Companii intermediare de marfă</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
          <Plus size={18} /> Add Broker
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Se încarcă...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brokers.length === 0 && (
            <p className="text-gray-500 col-span-3 text-center py-8">Niciun broker înregistrat</p>
          )}
          {brokers.map((b) => (
            <div key={b.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{b.companyName}</h3>
                  {b.mcNumber && <p className="text-xs text-gray-500 mt-1">{b.mcNumber}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800 p-1"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800 p-1"><Trash2 size={16} /></button>
                </div>
              </div>
              {b.contactName && <p className="text-sm text-gray-700 mb-1">{b.contactName}</p>}
              {b.email && <p className="text-xs text-gray-500 mb-1">{b.email}</p>}
              {b.phone && <p className="text-xs text-gray-500 mb-3">{b.phone}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">Net {b.paymentTermsDays} zile</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className={i <= (b.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editează broker' : 'Broker nou'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nume companie *</label>
                <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MC #</label>
                  <input value={form.mcNumber} onChange={(e) => setForm({ ...form, mcNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persoană contact</label>
                  <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Termen plată (zile)</label>
                  <input type="number" min="1" value={form.paymentTermsDays}
                    onChange={(e) => setForm({ ...form, paymentTermsDays: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Anulează</button>
                <button type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700">
                  {editingId ? 'Salvează' : 'Creează'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
