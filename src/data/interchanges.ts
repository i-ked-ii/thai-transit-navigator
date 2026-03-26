import type { Interchange } from '@/types';

export const interchanges: Interchange[] = [
  // BTS Sukhumvit ↔ BTS Silom (Siam)
  {
    fromStationId: 'bts-sukhumvit-siam',
    toStationId: 'bts-silom-siam',
    walkingTimeMinutes: 2,
    description: { th: 'เปลี่ยนชานชาลาภายในสถานีสยาม', en: 'Platform transfer at Siam station' },
  },
  // BTS Asok ↔ MRT Sukhumvit
  {
    fromStationId: 'bts-sukhumvit-asok',
    toStationId: 'mrt-blue-sukhumvit',
    walkingTimeMinutes: 5,
    description: { th: 'ทางเชื่อมใต้ดิน', en: 'Underground passage' },
  },
  // BTS Sala Daeng ↔ MRT Si Lom
  {
    fromStationId: 'bts-silom-sala-daeng',
    toStationId: 'mrt-blue-si-lom',
    walkingTimeMinutes: 4,
    description: { th: 'ทางเชื่อมใต้ดิน', en: 'Underground passage' },
  },
  // BTS Mo Chit ↔ MRT Chatuchak Park
  {
    fromStationId: 'bts-sukhumvit-mo-chit',
    toStationId: 'mrt-blue-chatuchak-park',
    walkingTimeMinutes: 5,
    description: { th: 'เดินระยะสั้น', en: 'Short walk' },
  },
  // BTS Ha Yaek Lat Phrao ↔ MRT Phahon Yothin
  {
    fromStationId: 'bts-sukhumvit-ha-yaek-lat-phrao',
    toStationId: 'mrt-blue-phahon-yothin',
    walkingTimeMinutes: 3,
    description: { th: 'สถานีติดกัน', en: 'Adjacent stations' },
  },
  // BTS Phaya Thai ↔ ARL Phaya Thai
  {
    fromStationId: 'bts-sukhumvit-phaya-thai',
    toStationId: 'arl-phaya-thai',
    walkingTimeMinutes: 4,
    description: { th: 'ทางเดินลอยฟ้า', en: 'Skywalk connection' },
  },
  // ARL Makkasan ↔ MRT Phetchaburi
  {
    fromStationId: 'arl-makkasan',
    toStationId: 'mrt-blue-phetchaburi',
    walkingTimeMinutes: 8,
    description: { th: 'ทางเดินยกระดับ', en: 'Elevated walkway' },
  },
  // BTS Bang Wa ↔ MRT Bang Wa
  {
    fromStationId: 'bts-silom-bang-wa',
    toStationId: 'mrt-blue-bang-wa-mrt',
    walkingTimeMinutes: 3,
    description: { th: 'ทางเชื่อม', en: 'Connected walkway' },
  },
  // MRT Blue Tao Poon ↔ MRT Purple Tao Poon
  {
    fromStationId: 'mrt-blue-tao-poon',
    toStationId: 'mrt-purple-tao-poon',
    walkingTimeMinutes: 3,
    description: { th: 'เปลี่ยนสายสีน้ำเงิน-ม่วง', en: 'Blue-Purple interchange' },
  },
];
