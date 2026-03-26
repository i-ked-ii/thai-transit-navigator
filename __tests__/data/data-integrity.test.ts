import { describe, it, expect } from 'vitest';
import { allStations, lines, interchanges, getStationById } from '@/data';

describe('Data Integrity', () => {
  it('should have no duplicate station IDs', () => {
    const ids = allStations.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have all station IDs referenced in lines exist in data', () => {
    for (const line of lines) {
      for (const stationId of line.stationIds) {
        const station = getStationById(stationId);
        expect(station, `Station ${stationId} not found (line: ${line.id})`).toBeDefined();
      }
    }
  });

  it('should have all interchange station IDs exist in data', () => {
    for (const interchange of interchanges) {
      const from = getStationById(interchange.fromStationId);
      const to = getStationById(interchange.toStationId);
      expect(from, `From station ${interchange.fromStationId} not found`).toBeDefined();
      expect(to, `To station ${interchange.toStationId} not found`).toBeDefined();
    }
  });

  it('should have valid coordinates for all stations (within Thailand)', () => {
    for (const station of allStations) {
      expect(station.coordinates.lat).toBeGreaterThan(5);
      expect(station.coordinates.lat).toBeLessThan(21);
      expect(station.coordinates.lng).toBeGreaterThan(97);
      expect(station.coordinates.lng).toBeLessThan(106);
    }
  });

  it('should have at least 2 stations per line', () => {
    for (const line of lines) {
      expect(line.stationIds.length, `Line ${line.id} has < 2 stations`).toBeGreaterThanOrEqual(2);
    }
  });

  it('should have interchange stations marked as isInterchange', () => {
    for (const interchange of interchanges) {
      const from = getStationById(interchange.fromStationId);
      const to = getStationById(interchange.toStationId);
      expect(from?.isInterchange, `${interchange.fromStationId} should be marked as interchange`).toBe(true);
      expect(to?.isInterchange, `${interchange.toStationId} should be marked as interchange`).toBe(true);
    }
  });

  it('should have correct number of lines', () => {
    expect(lines.length).toBe(5); // BTS Sukhumvit, BTS Silom, MRT Blue, ARL, MRT Purple
  });

  it('should have correct line IDs matching station lineIds', () => {
    for (const station of allStations) {
      const line = lines.find((l) => l.id === station.lineId);
      expect(line, `No line found for station ${station.id} with lineId ${station.lineId}`).toBeDefined();
    }
  });
});
