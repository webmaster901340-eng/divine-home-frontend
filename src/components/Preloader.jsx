import { useEffect } from 'react';

// Opens the gate painted by index.html (#dhi-gate) once React has rendered the page.
// First visit in a session: the brand shows for ~1.1s, then the doors slide apart.
// Later full page loads in the same session: the doors open straight away.
const Preloader = () => {
  useEffect(() => {
    const gate = document.getElementById('dhi-gate');
    if (!gate) return undefined;

    let firstVisit = true;
    try {
      firstVisit = !sessionStorage.getItem('dhi_visited');
      sessionStorage.setItem('dhi_visited', '1');
    } catch {
      /* storage blocked: treat as first visit */
    }

    const wait = Math.max(0, (firstVisit ? 1900 : 600) - performance.now());
    const timers = [];
    timers.push(setTimeout(() => {
      gate.classList.add('open');
      timers.push(setTimeout(() => gate.remove(), 1400));
    }, wait));
    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
};

Preloader.displayName = 'Preloader';
export default Preloader;
