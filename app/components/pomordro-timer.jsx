"use client";
import { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [quoteVisible, setQuoteVisible] = useState(true);

  const quotes = [
    // ... (önceki alıntılar)
  ];

  let pomodoroEndSound;
  let breakEndSound;

  useEffect(() => {
    // Tarayıcı ortamında Audio nesnelerini oluştur
    pomodoroEndSound = new Audio("/zil.mp3");
    breakEndSound = new Audio("/zil.mp3");

    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            if (isBreak) {
              breakEndSound.play();
              resetTimer();
            } else {
              setIsBreak(true);
              pomodoroEndSound.play();
              return 300;
            }
          }
          return prevTime > 0 ? prevTime - 1 : 0;
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time, isBreak]);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setMotivationalQuote(quotes[randomIndex]);
        setQuoteVisible(true);
      }, 500);
    }, 10000);

    return () => clearInterval(quoteInterval);
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTime(1500);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white font-sans">
      <h1
        className={`text-7xl font-extrabold mb-10 ${
          isBreak ? "text-green-200" : "text-white"
        }`}
      >
        {isBreak ? "Ara Zamanı!" : "Buhara Pomodoro Zamanlayıcı"}
      </h1>
      <div className="text-7xl mb-10 font-semibold">{formatTime(time)}</div>
      <div className="flex space-x-6">
        <button
          className={`w-32 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            isActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-teal-700 hover:bg-teal-600"
          }`}
          onClick={toggleTimer}
        >
          {isActive ? "Duraklat" : "Başla"}
        </button>
        <button
          className="w-32 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg shadow-lg transition duration-300"
          onClick={resetTimer}
        >
          Sıfırla
        </button>
      </div>
      <div
        className={`mt-10 text-2xl text-center transition-opacity duration-500 ${
          quoteVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {motivationalQuote || "İşinize odaklanın!"}
      </div>
    </div>
  );
};

export default PomodoroTimer;
