/** @format */
import { DateTime } from 'luxon';

// utils/Calendar/nepaliDate.ts

interface CreateNepalDateParams {
  year: number;
  month: number; // 0-11
  date: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * Gets current date and time in Nepal's timezone
 * @returns Date object with Nepal's current time
 */
export function getNepalDate(): Date {
  const currentDate: Date = DateTime.now().setZone('Asia/Kathmandu').toJSDate();

  return currentDate;
}

/**
 * Creates a new Date object with the specified date and time in Nepal's timezone
 * @param params - Object containing date and time parameters
 * @returns Date object in Nepal's timezone
 * @throws Error if invalid date parameters are provided
 */
export function createNepalDate({
  year,
  month,
  date,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: CreateNepalDateParams): Date {
  // Validate input parameters
  if (month < 0 || month > 11) {
    throw new Error('Month must be between 0 and 11');
  }

  if (date < 1 || date > 31) {
    throw new Error('Date must be between 1 and 31');
  }

  if (hours < 0 || hours > 23) {
    throw new Error('Hours must be between 0 and 23');
  }

  if (minutes < 0 || minutes > 59) {
    throw new Error('Minutes must be between 0 and 59');
  }

  if (seconds < 0 || seconds > 59) {
    throw new Error('Seconds must be between 0 and 59');
  }

  // Create date in UTC
  const utcDate = new Date(Date.UTC(year, month, date, hours, minutes, seconds));

  // Add Nepal's offset (UTC+5:45)
  const nepalOffsetHours = 5;
  const nepalOffsetMinutes = 45;

  return new Date(utcDate.getTime() + 3600000 * nepalOffsetHours + 60000 * nepalOffsetMinutes);
}

// Example usage:
/*
// Get current Nepal time
const currentNepalTime: Date = getNepalDate();
console.log(currentNepalTime.toISOString());

// Create a specific date in Nepal time
const specificNepalDate: Date = createNepalDate({
  year: 2025,
  month: 1,  // February (0-based)
  date: 15,
  hours: 14,
  minutes: 30
});
console.log(specificNepalDate.toISOString());
*/