import { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, Truck, Users, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/summary')
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Se încarcă...</div>;
  if (!summary) return <div className="text-red-500">Eroare la încărcare</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Privire de ansamblu asupra operațiunilor</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Gross" value={`$${summary.totals.gross.toLocaleString()}`} color="bg-green-500" />
        <StatCard icon={TrendingUp} label="Avg RPM" value={`$${summary.totals.avgRpm}`} color="bg-blue-500" />
        <StatCard icon={Truck} label="Mile totale" value={summary.totals.miles.toLocaleString()} color="bg-orange-500" />
        <StatCard icon={DollarSign} label="Comision" value={`$${summary.totals.commission.toLocaleString()}`} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statusul curselor</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total cursuri</span>
              <span className="text-xl font-bold text-gray-900">{summary.counts.totalLoads}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Booked</span>
              <span className="text-xl font-bold text-blue-900">{summary.counts.booked}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-700">In Transit</span>
              <span className="text-xl font-bold text-yellow-900">{summary.counts.inTransit}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Delivered</span>
              <span className="text-xl font-bold text-green-900">{summary.counts.delivered}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Șoferi</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Total șoferi</span>
              <span className="text-xl font-bold text-gray-900">{summary.drivers.total}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Available</span>
              <span className="text-xl font-bold text-green-900">{summary.drivers.available}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-700">On Load</span>
              <span className="text-xl font-bold text-yellow-900">{summary.drivers.onLoad}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Home Time</span>
              <span className="text-xl font-bold text-blue-900">{summary.drivers.homeTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
