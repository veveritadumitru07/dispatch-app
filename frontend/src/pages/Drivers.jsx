import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Phone, Mail, Truck as TruckIcon } from 'lucide-react';

const STATUS_LABELS = {
  available: { label: 'Available', color: 'border-green-300 bg-green-50', badge: 'bg-green-500' },
  on_load: { label: 'On Load', color: 'border-yellow-300 bg-yellow-50', badge: 'bg-yellow-500' },
  home_time: { label: 'Home Time', color: 'border-blue-300 bg-blue-50', badge: 'bg-blue-500' },
  inactive: { label: 'Inactive', color: 'border-gray-300 bg-gray-50', badge: 'bg-gray-500' },
};

const initialForm = {
  firstName: '', lastName: '', phone: '', email: '',
  truckNumber: '', licenseNumber: '', status: 'available',
};

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/drivers');
      setDrivers(data);
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

  const openEdit = (d) => {
    setForm({
      firstName: d.firstName, lastName: d.lastName,
      phone: d.phone || '', email: d.email || '',
      truckNumber: d.truckNumber || '', licenseNumber: d.licenseNumber || '',
      status: d.status,
    });
    setEditingId(d.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/drivers/${editingId}`, form);
      else await api.post('/drivers', form);
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Eroare');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigur ștergi acest șofer?')) return;
    await api.delete(`/drivers/${id}`);
    loadData();
  };

  const grouped = Object.keys(STATUS_LABELS).reduce((acc, status) => {
    acc[status] = drivers.filter((d) => d.status === status);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-500 mt-1">Gestionarea șoferilor și statusurilor</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
          <Plus size={18} /> Add Driver
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Se încarcă...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATUS_LABELS).map(([status, meta]) => (
            <div key={status} className={`rounded-xl border-2 ${meta.color} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{meta.label}</h3>
                <span className={`${meta.badge} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                  {grouped[status].length}
                </span>
              </div>
              <div className="space-y-3">
                {grouped[status].length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Niciun șofer</p>
                )}
                {grouped[status].map((d) => (
                  <div key={d.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{d.firstName} {d.lastName}</p>
                        {d.truckNumber && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <TruckIcon size={12} /> {d.truckNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(d)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {d.phone && (
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Phone size={11} /> {d.phone}
                      </p>
                    )}
                    {d.email && (
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1 truncate">
                        <Mail size={11} /> {d.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editează șofer' : 'Șofer nou'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prenume *</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume *</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Truck #</label>
                  <input value={form.truckNumber} onChange={(e) => setForm({ ...form, truckNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License #</label>
                  <input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="available">Available</option>
                    <option value="on_load">On Load</option>
                    <option value="home_time">Home Time</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
