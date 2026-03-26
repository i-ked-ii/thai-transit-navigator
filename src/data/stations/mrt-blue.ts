import type { Station } from '@/types';

export const mrtBlueStations: Station[] = [
  // Original line (underground section)
  { id: 'mrt-blue-hua-lamphong', code: 'BL28', slug: 'hua-lamphong', name: { th: 'หัวลำโพง', en: 'Hua Lamphong' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7378, lng: 100.5172 }, isInterchange: false },
  { id: 'mrt-blue-sam-yan', code: 'BL27', slug: 'sam-yan', name: { th: 'สามย่าน', en: 'Sam Yan' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7325, lng: 100.5288 }, isInterchange: false },
  { id: 'mrt-blue-si-lom', code: 'BL26', slug: 'si-lom', name: { th: 'สีลม', en: 'Si Lom' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7290, lng: 100.5361 }, isInterchange: true },
  { id: 'mrt-blue-lumphini', code: 'BL25', slug: 'lumphini', name: { th: 'ลุมพินี', en: 'Lumphini' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7262, lng: 100.5418 }, isInterchange: false },
  { id: 'mrt-blue-khlong-toei', code: 'BL24', slug: 'khlong-toei', name: { th: 'คลองเตย', en: 'Khlong Toei' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7226, lng: 100.5520 }, isInterchange: false },
  { id: 'mrt-blue-queen-sirikit', code: 'BL23', slug: 'queen-sirikit', name: { th: 'ศูนย์การประชุมแห่งชาติสิริกิติ์', en: 'Queen Sirikit National Convention Centre' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7231, lng: 100.5597 }, isInterchange: false },
  { id: 'mrt-blue-sukhumvit', code: 'BL22', slug: 'sukhumvit', name: { th: 'สุขุมวิท', en: 'Sukhumvit' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7362, lng: 100.5606 }, isInterchange: true },
  { id: 'mrt-blue-phetchaburi', code: 'BL17', slug: 'phetchaburi', name: { th: 'เพชรบุรี', en: 'Phetchaburi' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7482, lng: 100.5617 }, isInterchange: true },
  { id: 'mrt-blue-phra-ram-9', code: 'BL18', slug: 'phra-ram-9', name: { th: 'พระราม 9', en: 'Phra Ram 9' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7573, lng: 100.5652 }, isInterchange: false },
  { id: 'mrt-blue-thailand-cultural-centre', code: 'BL19', slug: 'thailand-cultural-centre', name: { th: 'ศูนย์วัฒนธรรมแห่งประเทศไทย', en: 'Thailand Cultural Centre' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7651, lng: 100.5700 }, isInterchange: false },
  { id: 'mrt-blue-huai-khwang', code: 'BL20', slug: 'huai-khwang', name: { th: 'ห้วยขวาง', en: 'Huai Khwang' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7771, lng: 100.5739 }, isInterchange: false },
  { id: 'mrt-blue-sutthisan', code: 'BL21', slug: 'sutthisan', name: { th: 'สุทธิสาร', en: 'Sutthisan' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7882, lng: 100.5738 }, isInterchange: false },
  { id: 'mrt-blue-ratchadaphisek', code: 'BL16', slug: 'ratchadaphisek', name: { th: 'รัชดาภิเษก', en: 'Ratchadaphisek' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7976, lng: 100.5736 }, isInterchange: false },
  { id: 'mrt-blue-lat-phrao', code: 'BL15', slug: 'lat-phrao', name: { th: 'ลาดพร้าว', en: 'Lat Phrao' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.8059, lng: 100.5734 }, isInterchange: true },
  { id: 'mrt-blue-phahon-yothin', code: 'BL13', slug: 'phahon-yothin', name: { th: 'พหลโยธิน', en: 'Phahon Yothin' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.8133, lng: 100.5611 }, isInterchange: true },
  { id: 'mrt-blue-chatuchak-park', code: 'BL12', slug: 'chatuchak-park', name: { th: 'สวนจตุจักร', en: 'Chatuchak Park' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.8023, lng: 100.5537 }, isInterchange: true },
  { id: 'mrt-blue-kamphaeng-phet', code: 'BL11', slug: 'kamphaeng-phet', name: { th: 'กำแพงเพชร', en: 'Kamphaeng Phet' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7986, lng: 100.5498 }, isInterchange: false },
  { id: 'mrt-blue-bang-sue', code: 'BL10', slug: 'bang-sue', name: { th: 'บางซื่อ', en: 'Bang Sue' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.8064, lng: 100.5376 }, isInterchange: true },
  // Extension (elevated section - loop)
  { id: 'mrt-blue-tao-poon', code: 'BL09', slug: 'tao-poon', name: { th: 'เตาปูน', en: 'Tao Poon' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.8065, lng: 100.5289 }, isInterchange: true },
  { id: 'mrt-blue-bang-pho', code: 'BL08', slug: 'bang-pho', name: { th: 'บางโพ', en: 'Bang Pho' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.8067, lng: 100.5178 }, isInterchange: false },
  { id: 'mrt-blue-bang-o', code: 'BL07', slug: 'bang-o', name: { th: 'บางอ้อ', en: 'Bang O' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7994, lng: 100.5092 }, isInterchange: false },
  { id: 'mrt-blue-bang-phlat', code: 'BL06', slug: 'bang-phlat', name: { th: 'บางพลัด', en: 'Bang Phlat' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7923, lng: 100.5027 }, isInterchange: false },
  { id: 'mrt-blue-sirindhorn', code: 'BL05', slug: 'sirindhorn', name: { th: 'สิรินธร', en: 'Sirindhorn' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7830, lng: 100.4987 }, isInterchange: false },
  { id: 'mrt-blue-bang-yi-khan', code: 'BL04', slug: 'bang-yi-khan', name: { th: 'บางยี่ขัน', en: 'Bang Yi Khan' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7749, lng: 100.4846 }, isInterchange: false },
  { id: 'mrt-blue-bang-khun-non', code: 'BL03', slug: 'bang-khun-non', name: { th: 'บางขุนนนท์', en: 'Bang Khun Non' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7650, lng: 100.4747 }, isInterchange: false },
  { id: 'mrt-blue-fai-chai', code: 'BL02', slug: 'fai-chai', name: { th: 'ไฟฉาย', en: 'Fai Chai' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7568, lng: 100.4727 }, isInterchange: false },
  { id: 'mrt-blue-tha-phra', code: 'BL01', slug: 'tha-phra', name: { th: 'ท่าพระ', en: 'Tha Phra' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7474, lng: 100.4760 }, isInterchange: false },
  { id: 'mrt-blue-bang-wa-mrt', code: 'BL32', slug: 'bang-wa-mrt', name: { th: 'บางหว้า', en: 'Bang Wa' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7200, lng: 100.4577 }, isInterchange: true },
  { id: 'mrt-blue-phetkasem-48', code: 'BL31', slug: 'phetkasem-48', name: { th: 'เพชรเกษม 48', en: 'Phetkasem 48' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7160, lng: 100.4526 }, isInterchange: false },
  { id: 'mrt-blue-phasi-charoen', code: 'BL30', slug: 'phasi-charoen', name: { th: 'ภาษีเจริญ', en: 'Phasi Charoen' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7231, lng: 100.4583 }, isInterchange: false },
  { id: 'mrt-blue-bang-phai', code: 'BL29', slug: 'bang-phai', name: { th: 'บางไผ่', en: 'Bang Phai' }, lineId: 'mrt-blue', operatorId: 'mrt', coordinates: { lat: 13.7312, lng: 100.4663 }, isInterchange: false },
  // Connects back to BL28 (Hua Lamphong) to form the loop
];
