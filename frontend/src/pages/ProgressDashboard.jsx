// frontend/src/pages/ProgressDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { toast } from 'sonner';

const ProgressDashboard = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProgress();
  }, []);

  const fetchAllProgress = async () => {
    try {
      const res = await api.get('/progress/all');
      setProgress(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch progress');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Progress Dashboard</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Student</th>
              <th className="border p-2">Idea</th>
              <th className="border p-2">Stage</th>
              <th className="border p-2">Progress %</th>
              <th className="border p-2">Last Updated</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.studentId.name}</td>
                <td className="border p-2">{item.ideaId.title}</td>
                <td className="border p-2">{item.currentStage}</td>
                <td className="border p-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.progressPercent}%` }}></div>
                  </div>
                  {item.progressPercent}%
                </td>
                <td className="border p-2">{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="border p-2">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressDashboard;