import { Trip } from '../types/tripTypes';
import { tripService } from './tripService';
import { userService } from './userService';
import { addYears, addDays } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface NextPossibleTrip {
  sevenDayTrip: Date | null;
  fourteenDayTrip: Date | null;
}

interface ResidenceCheckResult {
  isValid: boolean;
  failureReason?: string;
  maxAbsencePeriod: {
    days: number;
    startDate: Date;
    endDate: Date;
  };
  qualifyingPeriodEnd?: Date;
  nextPossibleTrips?: NextPossibleTrip;
}

/**
 * Converts an ISO date string to a Date object
 */
function toDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Calculates the number of days between two dates, inclusive
 */
function countDaysBetween(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Gets the total number of absence days within a specific window
 */
function getAbsenceDaysInWindow(trips: Trip[], windowStart: Date, windowEnd: Date, visaStartDate: Date, firstEntryDate: Date): number {
  let total = 0;

  // Add the period between visa approval and first entry
  if (windowStart <= firstEntryDate && windowEnd >= visaStartDate) {
    const periodStart = Math.max(windowStart.getTime(), visaStartDate.getTime());
    const periodEnd = Math.min(windowEnd.getTime(), firstEntryDate.getTime());
    if (periodEnd > periodStart) {
      total += Math.floor((periodEnd - periodStart) / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  // Add all trips within the window
  for (const trip of trips) {
    const tripStart = toDate(trip.startDate);
    const tripEnd = toDate(trip.endDate);

    // Find overlap between trip and the window
    const overlapStart = tripStart > windowStart ? tripStart : windowStart;
    const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd;

    if (overlapStart <= overlapEnd) {
      total += countDaysBetween(overlapStart, overlapEnd);
    }
  }

  return total;
}

/**
 * Finds the earliest date when a trip of specified length can be taken
 */
function findNextPossibleTripDate(
  trips: Trip[],
  visaStartDate: Date,
  firstEntryDate: Date,
  maxAbsenceIn12Months: number,
  buffer: number,
  tripLength: number,
  qualifyingPeriodEnd: Date,
  startSearchFromDate: Date = new Date()
): Date | null {
  const adjustedMaxAbsence = maxAbsenceIn12Months - buffer;
  let testDate = new Date(Math.max(startSearchFromDate.getTime(), new Date().getTime()));
  
  // Ensure we're not starting before tomorrow
  testDate.setHours(0, 0, 0, 0);
  testDate = addDays(testDate, 1);
  
  // Set a reasonable limit to prevent infinite loops (e.g., 2 years of daily checks)
  const searchEndDate = new Date(Math.min(
    qualifyingPeriodEnd.getTime(),
    addDays(testDate, 730).getTime() // 2 years max search
  ));
  
  while (testDate <= searchEndDate) {
    // Create a test trip
    const testTrip: Trip = {
      id: 'test',
      userId: 'test',
      title: 'test',
      description: '',
      country: 'test',
      startDate: testDate.toISOString(),
      endDate: addDays(testDate, tripLength - 1).toISOString(),
      createdAt: Timestamp.now(),
      emoji: ''
    };

    // Check if this trip would be valid
    let isValid = true;
    let current = new Date(testDate);
    const tripEndDate = addDays(testDate, tripLength - 1);
    
    while (current <= tripEndDate) {
      const windowStart = new Date(current);
      windowStart.setFullYear(windowStart.getFullYear() - 1);

      if (windowStart < visaStartDate) {
        windowStart.setTime(visaStartDate.getTime());
      }

      const absenceDays = getAbsenceDaysInWindow([...trips, testTrip], windowStart, current, visaStartDate, firstEntryDate);

      if (absenceDays > adjustedMaxAbsence) {
        isValid = false;
        break;
      }

      current = addDays(current, 1);
    }

    if (isValid) {
      return testDate;
    }

    // Try the next day
    testDate = addDays(testDate, 1);
  }

  return null;
}

/**
 * Checks if the trips meet continuous residence requirements
 * @param trips - Array of trips (absences)
 * @param visaStartDate - The start date of the qualifying period (e.g. visa approval date)
 * @param firstEntryDate - The date of first entry to the UK
 * @param maxAbsenceIn12Months - Maximum allowed absence days in any 12-month period (default: 180)
 * @param buffer - Number of days to subtract from maxAbsenceIn12Months as safety buffer
 * @param proposedTrip - Optional trip to include in the check (for validation before creation)
 * @returns Object containing validity, failure reason if applicable, and maximum absence period details
 */
function checkContinuousResidence(
  trips: Trip[],
  visaStartDate: Date,
  firstEntryDate: Date,
  maxAbsenceIn12Months: number = 180,
  buffer: number = 0,
  proposedTrip?: Trip
): ResidenceCheckResult {
  const current = new Date(visaStartDate);
  let maxAbsenceDays = 0;
  const qualifyingPeriodEnd = addYears(visaStartDate, 5);
  let maxAbsenceStart = new Date();
  let maxAbsenceEnd = new Date();

  // Add the proposed trip to the list if provided
  const allTrips = proposedTrip ? [...trips, proposedTrip] : trips;

  // Adjust maximum allowed absence by subtracting buffer
  const adjustedMaxAbsence = maxAbsenceIn12Months - buffer;

  while (current <= qualifyingPeriodEnd) {
    const windowStart = new Date(current);
    windowStart.setFullYear(windowStart.getFullYear() - 1);

    if (windowStart < visaStartDate) {
      windowStart.setTime(visaStartDate.getTime());
    }

    const absenceDays = getAbsenceDaysInWindow(allTrips, windowStart, current, visaStartDate, firstEntryDate);

    if (absenceDays > maxAbsenceDays) {
      maxAbsenceDays = absenceDays;
      maxAbsenceStart = new Date(windowStart);
      maxAbsenceEnd = new Date(current);
    }

    if (absenceDays > adjustedMaxAbsence) {
      return {
        isValid: false,
        failureReason: `Exceeded maximum allowed absence: ${absenceDays} days outside UK from ${windowStart.toDateString()} to ${current.toDateString()} (maximum: ${adjustedMaxAbsence} days with ${buffer} days safety buffer)`,
        maxAbsencePeriod: {
          days: absenceDays,
          startDate: windowStart,
          endDate: current
        },
        qualifyingPeriodEnd
      };
    }

    current.setDate(current.getDate() + 1);
  }

  // Calculate next possible trip dates if the current check is valid
  const startSearchFrom = proposedTrip ? new Date(proposedTrip.endDate) : new Date();
  const nextPossibleTrips = {
    sevenDayTrip: findNextPossibleTripDate(
      allTrips,
      visaStartDate,
      firstEntryDate,
      maxAbsenceIn12Months,
      buffer,
      7,
      qualifyingPeriodEnd,
      startSearchFrom
    ),
    fourteenDayTrip: findNextPossibleTripDate(
      allTrips,
      visaStartDate,
      firstEntryDate,
      maxAbsenceIn12Months,
      buffer,
      14,
      qualifyingPeriodEnd,
      startSearchFrom
    )
  };

  return {
    isValid: true,
    maxAbsencePeriod: {
      days: maxAbsenceDays,
      startDate: maxAbsenceStart,
      endDate: maxAbsenceEnd
    },
    qualifyingPeriodEnd,
    nextPossibleTrips
  };
}

export const residenceService = {
  async checkContinuousResidence(
    userId: string,
    proposedTrip?: Trip
  ): Promise<ResidenceCheckResult> {
    const trips = await tripService.getUserTrips(userId);
    const user = await userService.getUser(userId);
    const visaStartDate = new Date(user.prInfo.visaApprovalDate);
    const firstEntryDate = new Date(user.prInfo.firstEntryToUK);
    return checkContinuousResidence(trips, visaStartDate, firstEntryDate, 180, user.prInfo.buffer, proposedTrip);
  }
}