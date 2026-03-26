export type OperatorId = 'bts' | 'mrt' | 'arl' | 'srt';

export type LineId =
  | 'bts-sukhumvit'
  | 'bts-silom'
  | 'bts-gold'
  | 'mrt-blue'
  | 'mrt-purple'
  | 'mrt-yellow'
  | 'mrt-pink'
  | 'arl'
  | 'srt-dark-red'
  | 'srt-light-red'
  | 'srt-northern'
  | 'srt-northeastern'
  | 'srt-eastern'
  | 'srt-southern';

export interface Station {
  id: string;
  code: string;
  slug: string;
  name: {
    th: string;
    en: string;
  };
  lineId: LineId;
  operatorId: OperatorId;
  coordinates: {
    lat: number;
    lng: number;
  };
  isInterchange: boolean;
  zone?: number;
  distanceFromStart?: number;
}
