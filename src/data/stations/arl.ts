import type { Station } from '@/types';

export const arlStations: Station[] = [
  { id: 'arl-suvarnabhumi', code: 'A1', slug: 'suvarnabhumi', name: { th: 'สุวรรณภูมิ', en: 'Suvarnabhumi' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.6900, lng: 100.7501 }, isInterchange: false },
  { id: 'arl-lat-krabang', code: 'A2', slug: 'lat-krabang', name: { th: 'ลาดกระบัง', en: 'Lat Krabang' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7280, lng: 100.7437 }, isInterchange: false },
  { id: 'arl-ban-thap-chang', code: 'A3', slug: 'ban-thap-chang', name: { th: 'บ้านทับช้าง', en: 'Ban Thap Chang' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7370, lng: 100.7213 }, isInterchange: false },
  { id: 'arl-hua-mak', code: 'A4', slug: 'hua-mak', name: { th: 'หัวหมาก', en: 'Hua Mak' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7380, lng: 100.6453 }, isInterchange: false },
  { id: 'arl-ramkhamhaeng', code: 'A5', slug: 'ramkhamhaeng', name: { th: 'รามคำแหง', en: 'Ramkhamhaeng' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7577, lng: 100.6234 }, isInterchange: false },
  { id: 'arl-makkasan', code: 'A6', slug: 'makkasan', name: { th: 'มักกะสัน', en: 'Makkasan' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7510, lng: 100.5600 }, isInterchange: true },
  { id: 'arl-ratchaprarop', code: 'A7', slug: 'ratchaprarop', name: { th: 'ราชปรารภ', en: 'Ratchaprarop' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7535, lng: 100.5419 }, isInterchange: false },
  { id: 'arl-phaya-thai', code: 'A8', slug: 'phaya-thai-arl', name: { th: 'พญาไท', en: 'Phaya Thai' }, lineId: 'arl', operatorId: 'arl', coordinates: { lat: 13.7565, lng: 100.5347 }, isInterchange: true },
];
