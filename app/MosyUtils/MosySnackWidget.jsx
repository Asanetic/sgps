'use client';
import { useEffect, useState } from 'react';
import mosyThemeConfigs from '../appConfigs/mosyTheme';

export default function MosySnackWidget({
  content = "This is a snack!",
  duration = 10000,
  type = "info",
  onDone = () => {},
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDone]);

  if (!visible) return null;

  const handleClick = () => {
    setVisible(false);
    onDone();
  };

  const getBgColor = () => {
    switch (type) {
      case "success": return "#198754";
      case "error": return "#dc3545";
      case "warning": return "#ffc107";
      case "info":
      default: return mosyThemeConfigs.btnBg;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="mosy-snack-slide p-3"
      style={{
        position: "fixed",
        top: "0%",
        left: "50%",
        transform: "translateX(-50%)",
        background: getBgColor(),
        color: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 9999,
        cursor: "pointer",
        animation: "slideSnackInOut 1s ease-in-out, stayPut linear forwards",
        animationDelay: "0s, 1s", // first animation runs, then pause/stay
        animationDuration: `1s, ${duration / 1000 - 2}s, 1s`, // entrance, stay, exit
      }}
    >
      {content}

      <style jsx>{`
        @keyframes slideSnackInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 40vh);
          }
        }

        @keyframes stayPut {
          0% {
            transform: translate(-50%, 40vh);
            opacity: 1;
          }
          95% {
            transform: translate(-50%, 40vh);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
