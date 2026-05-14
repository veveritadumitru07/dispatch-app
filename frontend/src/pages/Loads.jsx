import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const STATUS_COLORS = {
  booked: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const initialForm = {
  pickupLocation: '',
  deliveryLocation: '',
  pickupDate: '',
  deliveryDate: '',
  miles: '',
  rate: '',
  commissionPercent: 6,
  status: 'booked',
  brokerId: '',
  driverId: '',
  notes: '',
};

export default function Loads() {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const url = filter ? `/loads?status=${filter}` : '/loads';
      const [l, d, b] = await Promise.all([
        api.get(url),
        api.get('/drivers'),
        api.get('/brokers'),
      ]);
      setLoads(l.data);
      setDrivers(d.data);
      setBrokers(b.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filter]);

  const openCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (load) => {
    setForm({
      pickupLocation: load.pickupLocation,
      deliveryLocation: load.deliveryLocation,
      pickupDate: load.pickupDate?.split('T')[0] || '',
      deliveryDate: load.deliveryDate?.split('T')[0] || '',
      miles: load.miles,
      rate: load.rate,
      commissionPercent: load.commissionPercent,
      status: load.status,
      brokerId: load.brokerId || '',
      driverId: load.driverId || '',
      notes: load.notes || '',
    });
    setEditingId(load.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      miles: Number(form.miles),
      rate: Number(form.rate),
      commissionPercent: Number(form.commissionPercent),
      brokerId: form.brokerId ? Number(form.brokerId) : undefined,
      driverId: form.driverId ? Number(form.driverId) : undefined,
    };
    try {
      if (editingId) {
        await api.put(`/loads/${editingId}`, payload);
      } else {
        await api.post('/loads', payload);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Eroare la salvare');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigur ștergi această cursă?')) return;
    await api.delete(`/loads/${id}`);
    loadData();
  };

  const rpm = form.miles > 0 ? (Number(form.rate) / Number(form.miles)).toFixed(2) : '0.00';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loads</h1>
          <p className="text-gray-500 mt-1">Gestionarea curselor active</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
          <Plus size={18} /> Add Load
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {['', 'booked', 'in_transit', 'delivered', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === s ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}>
            {s === '' ? 'Toate' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Route</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Pickup</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Miles</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Rate</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">RPM</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Driver</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan="8" className="text-center py-8 text-gray-500">Se încarcă...</td></tr>
            )}
            {!loading && loads.length === 0 && (
              <tr><td colSpan="8" className="text-center py-8 text-gray-500">Nu există curse</td></tr>
            )}
            {loads.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{l.pickupLocation}</div>
                  <div className="text-gray-500">→ {l.deliveryLocation}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{new Date(l.pickupDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Number(l.miles).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">${Number(l.rate).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">${(Number(l.rate) / Number(l.miles)).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {l.driver ? `${l.driver.firstName} ${l.driver.lastName}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[l.status]}`}>
                    {l.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(l)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editează cursă' : 'Cursă nouă'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <input type="text" required value={form.pickupLocation}
                    onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                    placeholder="Ex: Chicago, IL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
                  <input type="text" required value={form.deliveryLocation}
                    onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })}
                    placeholder="Ex: Dallas, TX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                  <input type="date" required value={form.pickupDate}
                    onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <input type="date" required value={form.deliveryDate}
                    onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miles</label>
                  <input type="number" step="0.1" min="0.1" required value={form.miles}
                    onChange={(e) => setForm({ ...form, miles: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($)</label>
                  <input type="number" step="0.01" min="0" required value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comision (%)</label>
                  <input type="number" step="0.1" min="0" max="50" value={form.commissionPercent}
                    onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RPM (auto)</label>
                  <input type="text" disabled value={`$${rpm}`}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Broker</label>
                  <select value={form.brokerId} onChange={(e) => setForm({ ...form, brokerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="">— Selectează —</option>
                    {brokers.map((b) => <option key={b.id} value={b.id}>{b.companyName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                  <select value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="">— Selectează —</option>
                    {drivers
                      .filter((d) => d.status === 'available' || d.id === Number(form.driverId))
                      .map((d) => <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.truckNumber})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="booked">Booked</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notițe</label>
                <textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
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
