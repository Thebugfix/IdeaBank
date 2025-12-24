// frontend/src/pages/UpdateProgress.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const UpdateProgress = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentStage: '',
    description: '',
    progressPercent: 0
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/progress/update', { ...formData, ideaId });
      toast.success('Progress updated!');
      navigate(`/view-idea/${ideaId}`);
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/idea/${ideaId}`)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back</span>
        </button>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">Progress Tracking</p>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Update Progress
            </h1>
            <p className="text-gray-600 mt-2">
              Share what you have completed so mentors and admins can follow your momentum.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentStage" className="block text-sm font-medium text-gray-700 mb-2">
                Current Stage
              </label>
              <div className="relative">
                <select
                  id="currentStage"
                  name="currentStage"
                  value={formData.currentStage}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                >
                  <option value="">Select Stage</option>
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Completed">Completed</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Progress Summary
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Highlight milestones, blockers, or anything notable since your last update..."
              />
              <p className="text-xs text-gray-500 mt-1">Be as specific as possible to help mentors provide better guidance.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="progressPercent" className="text-sm font-medium text-gray-700">
                  Completion Percentage
                </label>
                <span className="text-sm font-semibold text-gray-900">{formData.progressPercent}%</span>
              </div>
              <input
                id="progressPercent"
                type="range"
                name="progressPercent"
                value={formData.progressPercent}
                onChange={handleChange}
                required
                min={0}
                max={100}
                className="w-full accent-gray-900"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Just getting started</span>
                <span>Almost there</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Saving...' : 'Submit Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgress;