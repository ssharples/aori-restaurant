'use client';

import { useState, useEffect } from 'react';

interface OpeningHours {
  [key: number]: { start: number; end: number } | null; // null means closed
}

interface OpeningStatus {
  isOpen: boolean;
  message: string;
  nextOpeningTime?: string;
}

// Opening hours: 11am-8pm Tuesday-Sunday, closed Monday
// Correct mapping - Monday is day 1 in getDay()
const CORRECT_OPENING_HOURS: OpeningHours = {
  1: null, // Monday - closed
  2: { start: 11, end: 20 }, // Tuesday
  3: { start: 11, end: 20 }, // Wednesday  
  4: { start: 11, end: 20 }, // Thursday
  5: { start: 11, end: 20 }, // Friday
  6: { start: 11, end: 20 }, // Saturday
  0: { start: 11, end: 20 }, // Sunday
};

export function useOpeningStatus(): OpeningStatus {
  const [status, setStatus] = useState<OpeningStatus>({
    isOpen: false,
    message: 'Checking hours...',
  });

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeDecimal = currentHour + currentMinute / 60;

      const todayHours = CORRECT_OPENING_HOURS[currentDay];

      if (!todayHours) {
        // Closed today, find next opening day
        const nextOpeningDay = findNextOpeningDay(currentDay);
        const daysUntilOpen = getDaysUntilNext(currentDay, nextOpeningDay);
        
        let message = 'Closed on Mondays';
        if (daysUntilOpen === 1) {
          message = 'Opening tomorrow at 11:00 AM';
        } else if (daysUntilOpen > 1) {
          const dayName = getDayName(nextOpeningDay);
          message = `Opening ${dayName} at 11:00 AM`;
        }

        setStatus({
          isOpen: false,
          message,
          nextOpeningTime: '11:00 AM'
        });
      } else {
        const { start, end } = todayHours;
        
        if (currentTimeDecimal >= start && currentTimeDecimal < end) {
          // Currently open
          const closingTime = formatTime(end);
          setStatus({
            isOpen: true,
            message: `Open now • Closes ${closingTime}`,
          });
        } else if (currentTimeDecimal < start) {
          // Before opening today
          const openingTime = formatTime(start);
          const hoursUntilOpen = Math.ceil(start - currentTimeDecimal);
          setStatus({
            isOpen: false,
            message: hoursUntilOpen === 1 ? 'Opening in 1 hour' : `Opening in ${hoursUntilOpen} hours`,
            nextOpeningTime: openingTime
          });
        } else {
          // After closing today, find next opening day
          const nextOpeningDay = findNextOpeningDay(currentDay);
          const daysUntilOpen = getDaysUntilNext(currentDay, nextOpeningDay);
          
          let message;
          if (daysUntilOpen === 1) {
            message = 'Opening tomorrow at 11:00 AM';
          } else {
            const dayName = getDayName(nextOpeningDay);
            message = `Opening ${dayName} at 11:00 AM`;
          }

          setStatus({
            isOpen: false,
            message,
            nextOpeningTime: '11:00 AM'
          });
        }
      }
    };

    // Update immediately
    updateStatus();

    // Update every minute
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return status;
}

function findNextOpeningDay(currentDay: number): number {
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    if (CORRECT_OPENING_HOURS[nextDay]) {
      return nextDay;
    }
  }
  return 2; // Fallback to Tuesday
}

function getDaysUntilNext(currentDay: number, nextDay: number): number {
  if (nextDay > currentDay) {
    return nextDay - currentDay;
  } else {
    return 7 - currentDay + nextDay;
  }
}

function getDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
}

function formatTime(hour: number): string {
  if (hour === 12) return '12:00 PM';
  if (hour > 12) return `${hour - 12}:00 PM`;
  if (hour === 0) return '12:00 AM';
  return `${hour}:00 AM`;
}