import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const STATUS_COLORS = {
  booked: '#3b82f6',
  in_transit: '#eab308',
  delivered: '#22c55e',
  cancelled: '#9ca3af',
};

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [byStatus, setByStatus] = useState([]);
  const [topBrokers, setTopBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/summary'),
      api.get('/reports/loads-by-status'),
      api.get('/reports/top-brokers'),
    ])
      .then(([s, b, t]) => {
        setSummary(s.data);
        setByStatus(b.data);
        setTopBrokers(t.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Se încarcă rapoartele...</div>;
  if (!summary) return <div className="text-red-500">Eroare la încărcare</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapoarte</h1>
      <p className="text-gray-500 mb-8">Analiza performanței operaționale</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Gross (livrate)</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${summary.totals.gross.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Mile parcurse</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totals.miles.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">RPM mediu</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">${summary.totals.avgRpm}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Comision total</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">${summary.totals.commission.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribuția curselor după status</h2>
          {byStatus.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Nu există date</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                  {byStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#9ca3af'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 brokeri după gross</h2>
          {topBrokers.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Nu există date</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBrokers} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Bar dataKey="gross" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalii top brokeri</h2>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-2 text-sm font-semibold text-gray-600">Companie</th>
              <th className="text-right py-2 text-sm font-semibold text-gray-600">Curse</th>
              <th className="text-right py-2 text-sm font-semibold text-gray-600">Gross total</th>
            </tr>
          </thead>
          <tbody>
            {topBrokers.map((b, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 text-sm font-medium text-gray-900">{b.name}</td>
                <td className="py-3 text-sm text-right text-gray-700">{b.count}</td>
                <td className="py-3 text-sm text-right font-semibold text-gray-900">${b.gross.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
