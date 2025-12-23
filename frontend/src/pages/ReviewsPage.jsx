import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingButtons } from '@/components/FloatingButtons';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Quote } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const defaultReviews = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Gr8 teachers n good studies environment. The faculty is very supportive and explains every concept clearly.',
      course: 'Civil Engineering'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Great experience with the staff. They provide excellent handwritten notes and personal attention to each student.',
      course: 'Computer Engineering'
    },
    {
      id: '3',
      name: 'Amit Patel',
      rating: 5,
      comment: 'Highly recommend for anyone looking to enhance their skills! Best coaching classes in Vasai area.',
      course: 'Mechanical Engineering'
    },
    {
      id: '4',
      name: 'Sneha Desai',
      rating: 5,
      comment: 'The teaching methodology is excellent. I improved my grades significantly after joining these classes.',
      course: 'IT Engineering'
    },
    {
      id: '5',
      name: 'Rohit Mehta',
      rating: 4,
      comment: 'Very good coaching center with experienced teachers. The notes provided are comprehensive and helpful.',
      course: 'EXTC Engineering'
    },
    {
      id: '6',
      name: 'Kavita Singh',
      rating: 5,
      comment: 'Best decision to join Meghmehul Classes. The personal guidance helped me understand difficult subjects easily.',
      course: 'Civil Engineering'
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews`);
      if (response.data && response.data.length > 0) {
        setReviews(response.data);
      } else {
        setReviews(defaultReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(defaultReviews);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <FloatingButtons />

      <section className="relative py-20 bg-slate-900 text-white overflow-hidden" data-testid="reviews-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `repeating-linear-gradient(0deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px)` 
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-blue-400 mb-4">Student Reviews</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              What Our Students Say
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-sm">
                <Star size={20} fill="currentColor" />
                <span className="font-mono font-bold text-lg">4.9</span>
              </div>
              <p className="text-lg text-slate-300">
                Based on Google Reviews
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-slate-50" data-testid="reviews-content">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-12" data-testid="loading-state">
              <div className="text-slate-600">Loading reviews...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`review-card-${index}`}
                  className="bg-white p-6 border border-slate-100 shadow-sm relative"
                >
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-blue-50" />
                  
                  <div className="relative z-10">
                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                      "{review.comment}"
                    </p>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="font-bold text-slate-900 mb-1">{review.name}</div>
                      <div className="text-sm text-blue-600 font-medium">{review.course}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-12" data-testid="no-reviews">
              <p className="text-slate-600">No reviews available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Join Our Success Stories
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Become part of our community of successful students
            </p>
            <a
              href="/contact"
              data-testid="join-now-btn"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-8 py-3 font-medium transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              Get Started Today
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReviewsPage;