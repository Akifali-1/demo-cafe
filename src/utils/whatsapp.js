import { BRAND } from '../data/content.js';

export function buildWhatsAppUrl(message = '') {
  const phone = BRAND?.phoneRaw || '919876543210';
  const text = encodeURIComponent(message || BRAND?.whatsappDefaultMessage || 'Hi Demo Cafe!');
  return `https://wa.me/${phone}?text=${text}`;
}

