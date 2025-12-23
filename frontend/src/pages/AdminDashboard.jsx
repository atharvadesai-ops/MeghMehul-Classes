import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Users, BookOpen, MessageSquare, Bell, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [inquiriesRes, coursesRes, reviewsRes, noticesRes] = await Promise.all([
        axios.get(`${API}/inquiries`),
        axios.get(`${API}/courses`),
        axios.get(`${API}/reviews`),
        axios.get(`${API}/notices`)
      ]);

      setInquiries(inquiriesRes.data);
      setCourses(coursesRes.data);
      setReviews(reviewsRes.data);
      setNotices(noticesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const updateInquiryStatus = async (inquiryId, status) => {
    try {
      await axios.patch(`${API}/inquiries/${inquiryId}?status=${status}`);
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`${API}/courses/${courseId}`);
      toast.success('Course deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const deleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      await axios.delete(`${API}/notices/${noticeId}`);
      toast.success('Notice deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const tabs = [
    { id: 'inquiries', label: 'Inquiries', icon: Users, count: inquiries.length },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: reviews.length },
    { id: 'notices', label: 'Notices', icon: Bell, count: notices.length }
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Meghmehul Engineering Classes</p>
            </div>
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-sm px-4 py-2 font-medium transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
              className={`flex items-center gap-2 px-6 py-3 rounded-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                  : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-slate-600">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'inquiries' && (
              <div className="space-y-4" data-testid="inquiries-section">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Student Inquiries</h2>
                {inquiries.length === 0 ? (
                  <p className="text-slate-600">No inquiries yet.</p>
                ) : (
                  inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white p-6 border border-slate-200" data-testid={`inquiry-${inquiry.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{inquiry.name}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-sm text-xs font-mono font-bold ${
                          inquiry.status === 'new' ? 'bg-orange-100 text-orange-700' :
                          inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {inquiry.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                            {inquiry.phone}
                          </a>
                        </div>
                        {inquiry.email && (
                          <div>
                            <p className="text-sm text-slate-500">Email</p>
                            <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:text-blue-700">
                              {inquiry.email}
                            </a>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-slate-500">Course Interested</p>
                          <p className="text-slate-900 font-medium">{inquiry.course_interested}</p>
                        </div>
                      </div>
                      
                      {inquiry.message && (
                        <div className="mb-4">
                          <p className="text-sm text-slate-500 mb-1">Message</p>
                          <p className="text-slate-700">{inquiry.message}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}
                          data-testid={`mark-contacted-${inquiry.id}`}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm px-4 py-2 text-sm font-medium transition-colors"
                        >
                          <CheckCircle size={16} />
                          Mark Contacted
                        </button>
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'completed')}
                          data-testid={`mark-completed-${inquiry.id}`}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-sm px-4 py-2 text-sm font-medium transition-colors"
                        >
                          <CheckCircle size={16} />
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-4" data-testid="courses-section">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Courses</h2>
                {courses.length === 0 ? (
                  <p className="text-slate-600">No courses added yet.</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="bg-white p-6 border border-slate-200" data-testid={`course-${course.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{course.name}</h3>
                          <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-sm text-xs font-mono font-bold">
                              {course.stream}
                            </span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-sm text-xs font-mono font-bold">
                              {course.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          data-testid={`delete-course-${course.id}`}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-slate-700 mb-4">{course.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4" data-testid="reviews-section">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-slate-600">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 border border-slate-200" data-testid={`review-${review.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{review.name}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{review.course}</p>
                      <p className="text-slate-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'notices' && (
              <div className="space-y-4" data-testid="notices-section">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Notices</h2>
                {notices.length === 0 ? (
                  <p className="text-slate-600">No notices yet.</p>
                ) : (
                  notices.map((notice) => (
                    <div key={notice.id} className="bg-white p-6 border border-slate-200" data-testid={`notice-${notice.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{notice.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {new Date(notice.created_at).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNotice(notice.id)}
                          data-testid={`delete-notice-${notice.id}`}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-slate-700">{notice.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
