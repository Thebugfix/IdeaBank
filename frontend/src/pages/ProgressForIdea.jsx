// frontend/src/pages/ProgressForIdea.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { toast } from 'sonner';

const ProgressForIdea = () => {
  const { ideaId } = useParams();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [ideaId]);

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/progress/idea/${ideaId}`);
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
        <h1 className="text-3xl font-bold mb-6">Progress for Idea</h1>
        <div className="space-y-4">
          {progress.map((item) => (
            <div key={item._id} className="p-4 border rounded">
              <p>Stage: {item.currentStage}</p>
              <p>Description: {item.description}</p>
              <p>Progress: {item.progressPercent}%</p>
              <p>Status: {item.status}</p>
              <p>Mentor Remark: {item.mentorRemark}</p>
              <p>Last Updated: {new Date(item.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressForIdea;