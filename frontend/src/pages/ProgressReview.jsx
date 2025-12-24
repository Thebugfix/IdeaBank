// frontend/src/pages/ProgressReview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ProgressReview = () => {
  const { progressId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [formData, setFormData] = useState({ mentorRemark: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [progressId]);

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/progress/${progressId}`);
      setProgress(res.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch progress');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/progress/review/${progressId}`, formData);
      toast.success('Review submitted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back</span>
        </button>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">Mentor Review</p>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Progress Review
            </h1>
            <p className="text-gray-600 mt-2">
              Provide actionable feedback so students stay on course and unblock their next milestone.
            </p>
          </div>

          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Idea</span>
              <span className="text-sm font-semibold text-gray-900">{progress.ideaId?.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Stage</span>
              <span className="text-sm font-semibold text-gray-900">{progress.currentStage}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-1">Student Summary</span>
              <p className="text-gray-900 leading-relaxed">{progress.description}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-2">Progress</span>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all"
                    style={{ width: `${progress.progressPercent}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{progress.progressPercent}%</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="mentorRemark" className="block text-sm font-medium text-gray-700 mb-2">
                Mentor Remarks
              </label>
              <textarea
                id="mentorRemark"
                name="mentorRemark"
                value={formData.mentorRemark}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Highlight what went well, where to improve, or next steps to take."
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Review Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
              >
                <option value="">Select Status</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressReview;