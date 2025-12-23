import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingButtons } from '@/components/FloatingButtons';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen, Award, MapPin, Phone, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: Users,
      title: 'Experienced Faculty',
      description: 'Learn from industry experts with years of teaching experience'
    },
    {
      icon: BookOpen,
      title: 'Handwritten Notes',
      description: 'Comprehensive notes for all engineering subjects'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Track record of student success and excellent grades'
    },
    {
      icon: Zap,
      title: 'Personal Guidance',
      description: 'Individual attention and doubt-clearing sessions'
    }
  ];

  const streams = [
    { name: 'Civil Engineering', code: 'CE' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'EXTC Engineering', code: 'EXTC' },
    { name: 'IT Engineering', code: 'IT' },
    { name: 'Computer Engineering', code: 'CS' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <FloatingButtons />

      <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `repeating-linear-gradient(0deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px)` 
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-sm mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.3)]">
                <Star size={16} fill="currentColor" />
                <span className="font-mono font-bold text-sm">4.9 GOOGLE RATING</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-none mb-6">
                One of the Best
                <br />
                <span className="text-blue-600">Engineering</span>
                <br />
                Classes in Vasai
              </h1>

              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Quality teaching, handwritten notes, and personal guidance for all engineering streams. Prepare for success with Meghmehul Engineering Classes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  data-testid="hero-enroll-btn"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-8 py-3 font-medium transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                >
                  Enroll Now
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="tel:+918983692788"
                  data-testid="hero-call-btn"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 rounded-sm px-8 py-3 font-medium transition-colors"
                >
                  <Phone size={20} />
                  Call Now
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="text-slate-600">Vasai West, Maharashtra</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-slate-200 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <img
                  src="https://images.unsplash.com/photo-1758685848261-16a5a9e68811"
                  alt="Engineering students solving problems at chalkboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className="font-mono text-xs uppercase tracking-widest mb-1">Since 2010</div>
                <div className="text-2xl font-bold">15+ Years</div>
                <div className="text-sm">Teaching Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-blue-600 mb-3">Why Choose Us</div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Excellence in Engineering Education</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                data-testid={`feature-card-${index}`}
                className="bg-slate-50 p-8 border-l-4 border-orange-500 hover:border-blue-600 transition-colors group"
              >
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50" data-testid="streams-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-blue-600 mb-3">Courses Offered</div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">All Engineering Streams</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Degree and Diploma coaching for all engineering disciplines</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {streams.map((stream, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                data-testid={`stream-card-${index}`}
                className="bg-white border border-slate-200 p-6 hover:border-blue-500 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors" />
                <div className="relative">
                  <div className="font-mono font-bold text-2xl text-blue-600 mb-2">{stream.code}</div>
                  <div className="text-sm text-slate-700 font-medium">{stream.name}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <Link
              to="/courses"
              data-testid="view-all-courses-btn"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-8 py-3 font-medium transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              View All Courses
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-blue-600 text-white" data-testid="cta-section">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Excel in Your Engineering Career?</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">Join hundreds of successful students who have achieved their academic goals with us</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                data-testid="cta-enroll-btn"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-8 py-3 font-medium transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                Get Started Today
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+918983692788"
                data-testid="cta-call-btn"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 rounded-sm px-8 py-3 font-medium transition-colors"
              >
                <Phone size={20} />
                089836 92788
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;