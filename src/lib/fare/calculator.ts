import type { Station, OperatorId, RouteSegment } from '@/types';
import type { FareByPassenger } from '@/types';
import { calculateBtsFare } from './bts-fare';

export function calculateSegmentFare(segment: RouteSegment): number {
  return calculateFare(segment.operatorId, segment.fromStation, segment.toStation, segment.intermediateStations.length + 2);
}

export function calculateFare(
  operatorId: OperatorId,
  fromStation: Station,
  toStation: Station,
  stationCount: number,
): number {
  return calculateFareByType(operatorId, fromStation, toStation, stationCount).adult;
}

export function calculateFareByType(
  operatorId: OperatorId,
  fromStation: Station,
  toStation: Station,
  stationCount: number,
): FareByPassenger {
  const adultFare = calculateAdultFare(operatorId, fromStation, toStation, stationCount);

  switch (operatorId) {
    case 'bts':
      return btsPassengerFares(adultFare);
    case 'mrt':
      return mrtPassengerFares(adultFare);
    case 'arl':
      return arlPassengerFares(adultFare);
    case 'srt':
      return srtPassengerFares(adultFare);
    default:
      return { adult: adultFare, student: adultFare, senior: adultFare, child: 0 };
  }
}

function calculateAdultFare(
  operatorId: OperatorId,
  fromStation: Station,
  toStation: Station,
  stationCount: number,
): number {
  switch (operatorId) {
    case 'bts':
      return calculateBtsFare(fromStation, toStation);
    case 'mrt':
      if (fromStation.lineId === 'mrt-purple') return calculateMrtPurpleFare(stationCount);
      return calculateMrtBlueFare(stationCount);
    case 'arl':
      return calculateArlFare(stationCount);
    case 'srt':
      return calculateSrtFare(stationCount);
    default:
      return 20;
  }
}

// === BTS Fare Types ===
// BTS: ราคาเท่ากันทุกประเภทบัตร (จาก BTS API - FarePrice เท่ากันหมด)
// แต่มี Rabbit Card ที่อาจมีส่วนลดในอนาคต
// เด็กสูงไม่เกิน 105 ซม. ฟรี
function btsPassengerFares(adultFare: number): FareByPassenger {
  return {
    adult: adultFare,
    student: adultFare,  // BTS ราคาเท่ากัน (จาก API)
    senior: adultFare,   // BTS ราคาเท่ากัน (จาก API)
    child: 0,
    childNote: 'สูงไม่เกิน 105 ซม. ฟรี',
  };
}

// === MRT Fare Types ===
// MRT Blue: ผู้สูงอายุ/เด็ก ลด 50%, นักเรียน ราคาปกติ
function mrtPassengerFares(adultFare: number): FareByPassenger {
  return {
    adult: adultFare,
    student: adultFare,
    senior: Math.round(adultFare * 0.5),
    child: 0,
    childNote: 'สูงไม่เกิน 91 ซม. ฟรี',
  };
}

// === ARL Fare Types ===
// ARL: นักเรียน -20%, ผู้สูงอายุ -50%, เด็กสูงไม่เกิน 90 ซม. ฟรี
function arlPassengerFares(adultFare: number): FareByPassenger {
  return {
    adult: adultFare,
    student: Math.round(adultFare * 0.8),
    senior: Math.round(adultFare * 0.5),
    child: 0,
    childNote: 'สูงไม่เกิน 90 ซม. ฟรี',
  };
}

// === SRT Fare Types ===
function srtPassengerFares(adultFare: number): FareByPassenger {
  return {
    adult: adultFare,
    student: adultFare,
    senior: Math.round(adultFare * 0.5),
    child: Math.round(adultFare * 0.5),
    childNote: 'เด็กอายุ 3-12 ปี ครึ่งราคา',
  };
}

// === Fare Calculation by Operator ===

function calculateMrtBlueFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  const stops = stationCount - 1;
  const fareTable = [0, 17, 19, 21, 24, 26, 28, 30, 32, 35, 37, 39, 42, 42, 42, 42, 42];
  if (stops < fareTable.length) return fareTable[stops];
  return 42;
}

// MRT Purple Line: 14-42 THB
function calculateMrtPurpleFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  const stops = stationCount - 1;
  const fareTable = [0, 14, 17, 20, 23, 25, 27, 29, 31, 33, 35, 37, 39, 40, 41, 42];
  if (stops < fareTable.length) return fareTable[stops];
  return 42;
}

function calculateArlFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  const stops = stationCount - 1;
  // ARL: 15, 20, 25, 30, 35, 40, 45 (เพิ่ม 5 บาท/สถานี)
  const fareTable = [0, 15, 20, 25, 30, 35, 40, 45];
  if (stops < fareTable.length) return fareTable[stops];
  return 45;
}

function calculateSrtFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  return Math.min(12 + (stationCount - 2) * 3, 42);
}
