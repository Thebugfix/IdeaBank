// frontend/src/pages/DashboardMentor.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // FIXED
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import api from '../api/api';
import { Filter, Activity } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const DashboardMentor = () => {
  const { user } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pendingProgress, setPendingProgress] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIdeas();
  }, [filter]); // ← Re-fetch when filter changes

  useEffect(() => {
    fetchPendingProgress();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data);
    } catch (error) {
      toast.error('Failed to fetch ideas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingProgress = async () => {
    try {
      const res = await api.get('/progress/pending');
      setPendingProgress(res.data);
    } catch (error) {
      toast.error('Failed to load progress updates');
    } finally {
      setProgressLoading(false);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === 'pending') return idea.status === 'pending';
    if (filter === 'approved') return idea.status === 'approved';
    return true;
  });

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: 'Playfair Display, serif' }}
              data-testid="mentor-dashboard-title"
            >
              Mentor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <Filter size={20} className="text-gray-600" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="mentor-filter-all"
            >
              All Ideas
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="mentor-filter-pending"
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="mentor-filter-approved"
            >
              Approved
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="mentor-ideas-grid">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600">No ideas found for this filter.</p>
            </div>
          )}

          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Progress Reviews</p>
                <h2 className="text-2xl font-semibold text-gray-900">Updates Needing Attention</h2>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Activity size={18} />
                <span>{pendingProgress.length} pending</span>
              </div>
            </div>

            {progressLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            ) : pendingProgress.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                No progress updates are waiting for review right now.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProgress.map((progress) => (
                  <div
                    key={progress._id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{progress.ideaId?.title}</p>
                      <h3 className="text-lg font-semibold text-gray-900">{progress.currentStage}</h3>
                      <p className="text-gray-600 line-clamp-2">{progress.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          Student: {progress.studentId?.name}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {progress.progressPercent}% complete
                        </span>
                        <span>
                          Updated {new Date(progress.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                        Pending
                      </span>
                      <button
                        onClick={() => navigate(`/progress/review/${progress._id}`)}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMentor;