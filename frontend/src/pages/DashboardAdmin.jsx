import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; 
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import api from '../api/api'; 
import { Filter, Activity, BarChart3 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const DashboardAdmin = () => {
  const { user } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [progress, setProgress] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIdeas();
  }, [filter]); // ← Re-fetch when filter changes

  useEffect(() => {
    fetchProgress();
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

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress/all');
      setProgress(res.data);
    } catch (error) {
      toast.error('Failed to fetch progress updates');
    } finally {
      setProgressLoading(false);
    }
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (filter === 'all') return true;
      return idea.status === filter;
    });
  }, [ideas, filter]);

  const stats = useMemo(() => {
    return {
      total: ideas.length,
      pending: ideas.filter(i => i.status === 'pending').length,
      approved: ideas.filter(i => i.status === 'approved').length,
      rejected: ideas.filter(i => i.status === 'rejected').length,
      progressTotal: progress.length,
      needsAttention: progress.filter(p => p.status === 'Needs Improvement').length,
      pendingReviews: progress.filter(p => p.status === 'Pending').length,
    };
  }, [ideas, progress]);

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'Reviewed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Needs Improvement':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

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
              data-testid="admin-dashboard-title"
            >
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-total">
              <div className="text-sm text-gray-600 mb-1">Total Ideas</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-pending">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-approved">
              <div className="text-sm text-gray-600 mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-rejected">
              <div className="text-sm text-gray-600 mb-1">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Progress Updates</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.progressTotal}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
                <BarChart3 size={22} />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Pending Review</p>
                <p className="text-3xl font-semibold text-amber-600">{stats.pendingReviews}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Activity size={22} />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Needs Improvement</p>
                <p className="text-3xl font-semibold text-rose-600">{stats.needsAttention}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                !
              </div>
            </div>
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
              data-testid="admin-filter-all"
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-pending"
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-approved"
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rejected'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-rejected"
            >
              Rejected
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="admin-ideas-grid">
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
                <p className="text-sm uppercase tracking-wide text-gray-500">Idea Progress</p>
                <h2 className="text-2xl font-semibold text-gray-900">Student Momentum</h2>
              </div>
              <button
                onClick={() => navigate('/progress/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                View Full Dashboard
              </button>
            </div>

            {progressLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            ) : progress.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
                No progress updates have been submitted yet.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-6 px-6 py-4 text-xs font-semibold text-gray-500 tracking-wide uppercase border-b border-gray-200">
                  <span>Student</span>
                  <span>Idea</span>
                  <span>Stage</span>
                  <span>Progress</span>
                  <span>Updated</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {progress.slice(0, 6).map((entry) => (
                    <div
                      key={entry._id}
                      className="px-6 py-4 flex flex-col md:grid md:grid-cols-6 md:items-center gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{entry.studentId?.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{entry.ideaId?.title || '—'}</p>
                      </div>
                      <div className="text-sm text-gray-600">{entry.currentStage}</div>
                      <div className="flex items-center space-x-3">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-900 rounded-full"
                            style={{ width: `${entry.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{entry.progressPercent}%</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(entry.status)}`}
                        >
                          {entry.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAdmin;