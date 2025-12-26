import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingButtons } from '@/components/FloatingButtons';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { BookOpen, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const defaultCourses = useMemo(() => [
    {
      id: '1',
      name: 'Civil Engineering - Degree',
      stream: 'Civil',
      type: 'Degree',
      description: 'Complete coaching for civil engineering degree students covering all subjects',
      duration: 'Semester-wise',
      features: ['Structural Analysis', 'Surveying', 'Building Materials', 'Environmental Engineering']
    },
    {
      id: '2',
      name: 'Civil Engineering - Diploma',
      stream: 'Civil',
      type: 'Diploma',
      description: 'Comprehensive diploma course covering fundamental civil engineering concepts',
      duration: 'Semester-wise',
      features: ['Construction Technology', 'Surveying Basics', 'Building Drawing', 'Estimating']
    },
    {
      id: '3',
      name: 'Mechanical Engineering - Degree',
      stream: 'Mechanical',
      type: 'Degree',
      description: 'In-depth mechanical engineering coaching for degree students',
      duration: 'Semester-wise',
      features: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing']
    },
    {
      id: '4',
      name: 'Mechanical Engineering - Diploma',
      stream: 'Mechanical',
      type: 'Diploma',
      description: 'Foundational mechanical engineering course for diploma students',
      duration: 'Semester-wise',
      features: ['Workshop Practice', 'Engineering Mechanics', 'Material Science', 'CAD']
    },
    {
      id: '5',
      name: 'Computer Engineering - Degree',
      stream: 'Computer',
      type: 'Degree',
      description: 'Complete computer engineering degree program coaching',
      duration: 'Semester-wise',
      features: ['Data Structures', 'Algorithms', 'DBMS', 'Web Technologies']
    },
    {
      id: '6',
      name: 'IT Engineering - Degree',
      stream: 'IT',
      type: 'Degree',
      description: 'Information Technology degree coaching covering all core subjects',
      duration: 'Semester-wise',
      features: ['Programming', 'Networks', 'Software Engineering', 'Cloud Computing']
    },
    {
      id: '7',
      name: 'EXTC Engineering - Degree',
      stream: 'EXTC',
      type: 'Degree',
      description: 'Electronics and Telecommunication engineering degree coaching',
      duration: 'Semester-wise',
      features: ['Digital Electronics', 'Signals & Systems', 'Communication', 'Microprocessors']
    }
  ], []);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/courses`, { timeout: 5000 });
      if (response.data && response.data.length > 0) {
        setCourses(response.data);
      } else {
        setCourses(defaultCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  }, [defaultCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const streams = ['All', 'Civil', 'Mechanical', 'Computer', 'IT', 'EXTC'];

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(course => course.stream === filter);

  return (
    <div className="min-h-screen">
      <Header />
      <FloatingButtons />

      <section className="relative py-20 bg-slate-900 text-white overflow-hidden" data-testid="courses-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `repeating-linear-gradient(0deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px)` 
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-blue-400 mb-4">Our Courses</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Engineering Programs
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Comprehensive coaching for all engineering streams - Degree and Diploma programs
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-slate-50" data-testid="courses-content">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeInUp} className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {streams.map((stream) => (
                <button
                  key={stream}
                  onClick={() => setFilter(stream)}
                  data-testid={`filter-${stream.toLowerCase()}`}
                  className={`px-6 py-2.5 rounded-sm font-medium transition-all ${
                    filter === stream
                      ? 'bg-orange-500 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                      : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12" data-testid="loading-state">
              <div className="text-slate-600">Loading courses...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`course-card-${index}`}
                  className="bg-white border border-slate-200 hover:border-blue-500 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-xs font-mono font-bold">
                    {course.stream}
                  </div>

                  <div className="p-6 pt-12">
                    <div className="flex items-center gap-2 text-orange-500 mb-3">
                      <BookOpen size={20} strokeWidth={1.5} />
                      <span className="text-sm font-medium">{course.type}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">{course.name}</h3>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">{course.description}</p>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-500">Key Topics</div>
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/contact"
                      data-testid={`enroll-btn-${index}`}
                      className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-6 py-2.5 font-medium transition-colors"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-12" data-testid="no-courses">
              <p className="text-slate-600">No courses found for the selected stream.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoursesPage;