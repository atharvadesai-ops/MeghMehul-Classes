import { Phone, MessageCircle } from 'lucide-react';

export const FloatingButtons = () => {
  const phoneNumber = '918983692788';
  const whatsappMessage = encodeURIComponent('Hi, I would like to inquire about engineering classes.');

  return (
    <div className="floating-buttons">
      <a
        href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="floating-whatsapp-btn"
        className="floating-btn whatsapp"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="text-white" size={24} strokeWidth={2} />
      </a>
      <a
        href="tel:+918983692788"
        data-testid="floating-call-btn"
        className="floating-btn phone"
        aria-label="Call Now"
      >
        <Phone className="text-white" size={24} strokeWidth={2} />
      </a>
    </div>
  );
};