import React from 'react';

/**
 * Computes a dynamic greeting based on the current hour of the day:
 * - 04:00 to 11:59: "Good morning"
 * - 12:00 to 16:59: "Good afternoon"
 * - 17:00 to 03:59: "Good evening"
 *
 * @param date Optional custom Date instance (defaults to current date/time)
 */
export function getTimeBasedGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 4 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * React hook that returns the current time-based greeting,
 * and updates every minute to guarantee correct time-of-day accuracy.
 */
export function useGreeting(): string {
  const [greeting, setGreeting] = React.useState<string>(() => getTimeBasedGreeting());

  React.useEffect(() => {
    // Initial check
    setGreeting(getTimeBasedGreeting());

    // Update every minute so day transitions update smoothly
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
}
