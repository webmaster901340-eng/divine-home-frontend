import React, { useEffect, useState } from 'react';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="pointer-events-none fixed w-[420px] h-[420px] rounded-full z-[2] transition-transform duration-100 ease-out mix-blend-multiply opacity-90"
      style={{
        left: `${position.x - 210}px`,
        top: `${position.y - 210}px`,
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.35) 20%, rgba(180, 130, 60, 0.18) 20%, transparent 80%)',
        filter: 'blur(45px)',
      }}
    />
  );
};

export default CursorFollower;