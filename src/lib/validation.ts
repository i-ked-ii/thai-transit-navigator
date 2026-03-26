import { getStationById } from '@/data';

const STATION_ID_PATTERN = /^[a-z]{2,4}-[a-z0-9-]+$/;
const STATION_CODE_PATTERN = /^[A-Z]{1,3}[0-9]{0,3}$/;
const MAX_PARAM_LENGTH = 100;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateStationId(id: unknown): ValidationResult {
  if (typeof id !== 'string') {
    return { valid: false, error: 'Station ID must be a string' };
  }
  if (id.length === 0 || id.length > MAX_PARAM_LENGTH) {
    return { valid: false, error: 'Station ID length invalid' };
  }
  if (!STATION_ID_PATTERN.test(id)) {
    return { valid: false, error: 'Station ID format invalid' };
  }
  if (!getStationById(id)) {
    return { valid: false, error: 'Station not found' };
  }
  return { valid: true };
}

export function validateStationCode(code: unknown): ValidationResult {
  if (typeof code !== 'string') {
    return { valid: false, error: 'Station code must be a string' };
  }
  if (code.length === 0 || code.length > 10) {
    return { valid: false, error: 'Station code length invalid' };
  }
  if (!STATION_CODE_PATTERN.test(code)) {
    return { valid: false, error: 'Station code format invalid' };
  }
  return { valid: true };
}

export function sanitizeString(input: string, maxLength: number = MAX_PARAM_LENGTH): string {
  return input.slice(0, maxLength).replace(/[<>"'&]/g, '');
}
