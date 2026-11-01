import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { API_BASE } from '../config';

const COLORS = ['#22d3a5', '#f97316', '#a78bfa', '#3b82f6', '#ec4899', '#eab308'];

export default function NgoAllocationCharts() {
  const [data, setData] = useState({ totalMoney: 0, totalMeals: 0, allocationSummary: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/money/analytics`)
      .then(res => res.json())
      .then(json => {
        if (json && !json.message) {
          setData(json);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching money analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>Loading analytics...</div>;
  }

  const { totalMoney = 0, totalMeals = 0, allocationSummary = [] } = data || {};

  // Custom Tooltip for the requirements: "₹200 → 10 meals → Shelter A"
  // Since we aggregate total meals, we can show "Total Funded: ₹X -> Y meals -> Shelter A"
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Calculate approximate money based on ₹20 per meal
      const money = data.meals * 20; 
      return (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>
            ₹{money.toLocaleString()} → {data.meals.toLocaleString()} meals → {data.ngoName}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: '"Lora", serif', color: 'var(--text)', marginBottom: 8 }}>Where Your Money Goes</h2>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Total Money Donated</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>₹{totalMoney.toLocaleString()}</div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Total Meals Funded</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent2)' }}>{totalMeals.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, width: '100%' }}>
        {/* Pie Chart: Percentage of meals per NGO */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16, textAlign: 'center', color: 'var(--text)' }}>Meal Distribution by NGO</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={allocationSummary} 
                  dataKey="meals" 
                  nameKey="ngoName" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={90} 
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {allocationSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Meals delivered per NGO */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 16, textAlign: 'center', color: 'var(--text)' }}>Total Meals Delivered</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="ngoName" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(214,130,40,0.05)' }} />
                <Bar dataKey="meals" radius={[6, 6, 0, 0]}>
                  {allocationSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
