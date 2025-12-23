import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingButtons } from '@/components/FloatingButtons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Clock, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_interested: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.course_interested) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API}/inquiries`, formData);
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        course_interested: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const courses = [
    'Civil Engineering - Degree',
    'Civil Engineering - Diploma',
    'Mechanical Engineering - Degree',
    'Mechanical Engineering - Diploma',
    'Computer Engineering - Degree',
    'IT Engineering - Degree',
    'EXTC Engineering - Degree'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <FloatingButtons />

      <section className="relative py-20 bg-slate-900 text-white overflow-hidden" data-testid="contact-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `repeating-linear-gradient(0deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px)` 
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-blue-400 mb-4">Contact Us</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Visit us or send us a message. We're here to help you start your engineering journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-slate-50" data-testid="contact-content">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    data-testid="input-name"
                    className="w-full h-12 rounded-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white px-4"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    data-testid="input-phone"
                    className="w-full h-12 rounded-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white px-4"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    data-testid="input-email"
                    className="w-full h-12 rounded-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white px-4"
                  />
                </div>

                <div>
                  <label htmlFor="course_interested" className="block text-sm font-medium text-slate-700 mb-2">
                    Course Interested <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="course_interested"
                    name="course_interested"
                    value={formData.course_interested}
                    onChange={handleChange}
                    data-testid="select-course"
                    className="w-full h-12 rounded-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white px-4"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    data-testid="textarea-message"
                    rows="4"
                    className="w-full rounded-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white px-4 py-3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="submit-btn"
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-sm px-8 py-3 font-medium transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting...' : (
                    <>
                      <Send size={20} />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Visit Us</h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-white p-6 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-white" size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Address</h3>
                      <p className="text-slate-600 leading-relaxed">
                        SHOP NO 7, Laxmi Palace, Vasai Rd W, opposite Vidhyavardhini Degree Engineering College, Gurunanak Nagar, Vasai West, Maharashtra 401202
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-sm flex items-center justify-center flex-shrink-0">
                      <Phone className="text-white" size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
                      <a href="tel:+918983692788" className="text-blue-600 hover:text-blue-700 font-medium" data-testid="contact-phone-link">
                        089836 92788
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
                      <Clock className="text-white" size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Business Hours</h3>
                      <p className="text-slate-600">Open · Closes 8 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aspect-video rounded-sm overflow-hidden border border-slate-200" data-testid="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5!2d72.8!3d19.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI0JzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meghmehul Engineering Classes Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;