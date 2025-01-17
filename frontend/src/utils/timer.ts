import { useEffect, useState } from 'react';

export const calculateTimer = (from: Date, to: Date): string => {
  const fromTime = Math.round(from.getTime() / 1000);
  const toTime = Math.round(to.getTime() / 1000);

  if (fromTime >= toTime) return '00:00:00';

  let rem = toTime - fromTime;
  const s = (toTime - fromTime) % 60;
  rem = Math.floor(rem / 60);
  const m = rem % 60;
  rem = Math.floor(rem / 60);
  const h = rem;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// receives a string declaring a date
// and returns a formatted time until
// string that updates every second
export const useTimeUntil = (until: string) => {
  const [timeUntil, setTimeUntil] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      // returns a "hh:mm:ss" timer
      const timer = calculateTimer(new Date(), new Date(until));
      setTimeUntil(timer);
    };

    // update every second
    const timerId = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timerId);
  }, [until]); // every time `until` changes, we want to reset the timer

  return timeUntil;
};
