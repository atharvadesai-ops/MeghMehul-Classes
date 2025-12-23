import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingButtons } from '@/components/FloatingButtons';
import { motion } from 'framer-motion';
import { Target, Heart, Award, Users } from 'lucide-react';

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide quality engineering education that empowers students to achieve academic excellence and build successful careers.'
    },
    {
      icon: Heart,
      title: 'Personal Care',
      description: 'Individual attention to each student, understanding their unique learning needs and providing tailored guidance.'
    },
    {
      icon: Award,
      title: 'Quality Teaching',
      description: 'Experienced faculty members dedicated to delivering comprehensive knowledge through effective teaching methods.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive learning environment where students collaborate and grow together.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <FloatingButtons />

      <section className="relative py-20 bg-slate-900 text-white overflow-hidden" data-testid="about-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `repeating-linear-gradient(0deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2563EB 0px, #2563EB 1px, transparent 1px, transparent 20px)` 
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-blue-400 mb-4">About Us</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Transforming Engineering Education in Vasai
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              With over 15 years of excellence in engineering education, Meghmehul Engineering Classes has become a trusted name for quality coaching in Vasai West.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white" data-testid="about-content">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div {...fadeInUp}>
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <img
                  src="https://images.pexels.com/photos/6208725/pexels-photo-6208725.jpeg"
                  alt="Students studying together"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div {...fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Meghmehul Engineering Classes is a renowned coaching institute located in Vasai West, Maharashtra. Since our establishment, we have been dedicated to providing exceptional education for engineering students pursuing both degree and diploma programs.
                </p>
                <p>
                  Our institute is conveniently located opposite Vidhyavardhini Degree Engineering College, making it easily accessible for students across the region. With a 4.9-star Google rating, we take pride in the trust and satisfaction of our students and their families.
                </p>
                <p>
                  We offer comprehensive coaching for all engineering streams including Civil, Mechanical, EXTC, IT, and Computer Engineering. Our faculty comprises experienced educators who are passionate about student success and employ innovative teaching methodologies.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 text-center">
              Our Teaching Approach
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 text-slate-600 leading-relaxed">
              <p>
                At Meghmehul Engineering Classes, we believe in a holistic approach to education. Our teaching methodology combines traditional classroom instruction with modern educational tools to ensure comprehensive understanding of complex engineering concepts.
              </p>
              <p>
                We provide handwritten notes for all subjects, carefully prepared by our faculty to cover the entire syllabus in a structured manner. These notes serve as valuable study material that students can refer to throughout their academic journey.
              </p>
              <p>
                Personal guidance is at the heart of our teaching philosophy. We maintain small batch sizes to ensure that each student receives individual attention. Our faculty is always available for doubt-clearing sessions and personalized mentoring.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                data-testid={`value-card-${index}`}
                className="bg-slate-50 p-8 border-l-4 border-blue-600 hover:border-orange-500 transition-colors"
              >
                <value.icon className="w-12 h-12 text-blue-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Our Achievements
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '5000+', label: 'Students Taught' },
              { number: '4.9', label: 'Google Rating' },
              { number: '100%', label: 'Dedication' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                data-testid={`stat-${index}`}
                className="bg-white p-8 text-center border border-slate-200"
              >
                <div className="font-mono text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;