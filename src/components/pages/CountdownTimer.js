import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const targetTime = parseCustomDate(targetDate).getTime();
    const timeRemaining = targetTime - now;

    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  function parseCustomDate(dateString) {
    try {
      // Split the date string and parse it
      const parts = dateString.split(' ');
      const day = parseInt(parts[0], 10);
      const month = parseMonth(parts[1]);
      const year = parseInt(parts[2], 10);

      return new Date(year, month, day);
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date(0); // Return a default date in case of error
    }
  }

  function parseMonth(monthName) {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return months.indexOf(monthName.toLowerCase());
  }

  return (
    <div>
      <h1 className="text-sm font-bold">Closing Date</h1>
      <div className="flex space-x-4">
        {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
          <>
            <div className="flex flex-col items-center">
              <p className="text-sm">Days:</p>
              <span className="text-sm font-bold">{timeLeft.days}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">Hr:</span>
              <span className="text-sm font-bold">{timeLeft.hours}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">Min:</span>
              <span className="text-sm font-bold">{timeLeft.minutes}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">Sec:</span>
              <span className="text-sm font-bold">{timeLeft.seconds}</span>
            </div>
          </>
        ) : (
          <span className="text-sm font-bold">Event Ended</span>
        )}
      </div>
    </div>
  );
  
};

export default CountdownTimer;
